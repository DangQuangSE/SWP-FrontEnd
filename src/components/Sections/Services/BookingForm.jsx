import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Select,
  Button,
  Typography,
  Tabs,
  DatePicker,
  ConfigProvider,
} from "antd";
import {
  EnvironmentOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import "./BookingForm.css";
import GradientButton from "../../common/GradientButton";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const BookingForm = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState();
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("day"),
    dayjs().add(30, "day"),
  ]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [activeTab, setActiveTab] = useState("morning");

  useEffect(() => {
    axios
      .get("/api/service")
      .then((res) => {
        const activeServices = res.data.filter((s) => s.isActive);
        setServices(activeServices);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách dịch vụ:", err));
  }, []);

  useEffect(() => {
    if (selectedService && dateRange.length === 2) {
      const from = dateRange[0].format("YYYY-MM-DD");
      const to = dateRange[1].format("YYYY-MM-DD");

      axios
        .get("/api/slot-free-service", {
          params: { service_id: selectedService, from, to },
        })
        .then((res) => {
          console.log("\ud83d\udce6 Raw scheduleData response:", res.data);
          const parsed =
            typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          const schedules = Array.isArray(parsed.scheduleResponses)
            ? parsed.scheduleResponses
            : [];
          setScheduleData(schedules);
        })
        .catch((err) => {
          console.error("Lỗi khi gọi slot-free-service:", err);
          setScheduleData([]);
        });
    }
  }, [selectedService, dateRange]);

  const displayDays = useMemo(() => {
    if (!Array.isArray(scheduleData)) return [];
    return scheduleData.map((s) => ({
      date: s.workDate,
      day: dayjs(s.workDate).format("dd"),
      dayNum: dayjs(s.workDate).format("D/M"),
      available: s.timeSlotDTOs?.length > 0,
    }));
  }, [scheduleData]);

  const getTimeSlotsForDay = (date) => {
    const entry = scheduleData.find((s) => s.workDate === date);
    if (!entry || !entry.timeSlotDTOs) return [];

    const slots = [];
    entry.timeSlotDTOs.forEach(({ startTime, endTime }) => {
      let current = dayjs(`${entry.workDate}T${startTime}`);
      const end = dayjs(`${entry.workDate}T${endTime}`);
      while (current.isBefore(end)) {
        const next = current.add(30, "minute");
        slots.push(`${current.format("HH:mm")} - ${next.format("HH:mm")}`);
        current = next;
      }
    });
    return slots;
  };

  const handleBooking = () => {
    if (!selectedService || !selectedDay || !selectedTime) {
      alert("Vui lòng chọn đủ thông tin!");
      return;
    }

    const [startTime, endTime] = selectedTime.split(" - ");
    const payload = {
      service_id: selectedService,
      preferredDate: selectedDay,
      slot: { startTime, endTime },
      note: "",
    };

    axios
      .post("/api/booking/medicalService", payload)
      .then(() => alert("\u0110ặt lịch thành công!"))
      .catch((err) => {
        console.error("\u0110ặt lịch thất bại:", err);
        alert("\u0110ặt lịch thất bại!");
      });
  };

  return (
    <Card className="appointment-card">
      <div className="appointment-header">
        <Title level={3}>\u0110ặt lịch hẹn</Title>
        <div className="location-info">
          <EnvironmentOutlined className="location-icon" />
          <Text className="location-text">
            Đồng 22/12, TP Thuận An, Bình Dương
          </Text>
        </div>
      </div>

      <div className="form-section">
        <Text strong>Chọn dịch vụ</Text>
        <Select
          className="full-width-select"
          style={{ width: "100%" }}
          placeholder="Chọn dịch vụ"
          value={selectedService}
          onChange={(value) => {
            setSelectedService(value);
            setScheduleData([]);
            setSelectedDay(undefined);
            setSelectedTime(undefined);
          }}
          size="large"
        >
          {services.map((s) => (
            <Select.Option key={s.id} value={s.id}>
              {s.name} – {s.price?.toLocaleString()} đ
            </Select.Option>
          ))}
        </Select>

        <Text strong style={{ marginTop: 16, display: "block" }}>
          Khoảng thời gian (tối đa 1 tháng)
        </Text>
        <ConfigProvider>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (!dates || dates.length !== 2) return;
              const [start, end] = dates;
              const today = dayjs().startOf("day");
              const max = today.add(30, "day");
              if (start.isBefore(today) || end.isAfter(max)) {
                alert("Chỉ được chọn trong 1 tháng!");
                return;
              }
              setDateRange(dates);
            }}
            disabledDate={(current) => {
              const today = dayjs().startOf("day");
              return current < today || current > today.add(30, "day");
            }}
            format="DD [thg] MM, YYYY"
            size="large"
            className="date-range-picker"
          />
        </ConfigProvider>
      </div>

      <div className="schedule-section">
        <div className="day-selector">
          <Button icon={<LeftOutlined />} type="text" />
          <div className="days-container">
            {displayDays.map((d) => (
              <div
                key={d.date}
                className={`day-card ${
                  selectedDay === d.date ? "selected" : ""
                } ${!d.available ? "disabled" : ""}`}
                onClick={() => d.available && setSelectedDay(d.date)}
              >
                <div>{d.day}</div>
                <div>{d.dayNum}</div>
              </div>
            ))}
          </div>
          <Button icon={<RightOutlined />} type="text" />
        </div>

        {selectedDay && (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="time-tabs"
          >
            {(() => {
              const slots = getTimeSlotsForDay(selectedDay);
              const parts = { morning: [], afternoon: [], evening: [] };
              slots.forEach((slot) => {
                const hour = parseInt(slot.split(":"));
                if (hour < 12) parts.morning.push(slot);
                else if (hour < 18) parts.afternoon.push(slot);
                else parts.evening.push(slot);
              });
              return Object.entries(parts).map(([key, list]) => (
                <TabPane tab={key.toUpperCase()} key={key}>
                  <div className="time-slots-grid">
                    {list.map((slot) => (
                      <Button
                        key={slot}
                        className={`time-slot ${
                          selectedTime === slot ? "selected" : ""
                        }`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </TabPane>
              ));
            })()}
          </Tabs>
        )}
      </div>

      <GradientButton type="primary" block size="large" onClick={handleBooking}>
        TIẾP TỤC ĐẶT LỊCH
      </GradientButton>
    </Card>
  );
};

export default BookingForm;
