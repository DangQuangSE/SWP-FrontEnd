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

const specialties = [
  { id: 1, name: "Nội khoa" },
  { id: 2, name: "Ngoại khoa" },
  { id: 3, name: "Nhi khoa" },
  { id: 4, name: "Da liễu" },
  { id: 5, name: "Mắt" },
];

const doctors = {
  1: [
    { id: 1, name: "BS. Nguyễn Văn A" },
    { id: 2, name: "BS. Trần Thị B" },
  ],
  2: [
    { id: 3, name: "BS. Lê Văn C" },
    { id: 4, name: "BS. Phạm Thị D" },
  ],
};

const BookingForm = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("day"),
    dayjs().add(30, "day"),
  ]);
  const [specialty, setSpecialty] = useState();
  const [doctor, setDoctor] = useState();
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [activeTab, setActiveTab] = useState("morning");

  useEffect(() => {
    if (doctor && dateRange.length === 2) {
      axios
        .get("/api/view-schedule", {
          params: {
            consultant_id: doctor,
            from: dateRange[0].format("YYYY-MM-DD"),
            to: dateRange[1].format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          console.log("Schedule API Response:", res.data);
          try {
            const parsed =
              typeof res.data === "string" ? JSON.parse(res.data) : res.data;

            // Kiểm tra parsed có phải array không
            if (Array.isArray(parsed)) {
              setScheduleData(parsed);
            } else {
              console.error(
                "❌ API không trả về mảng schedule hợp lệ!",
                parsed
              );
              setScheduleData([]); // fallback
            }
          } catch (err) {
            console.error("❌ Lỗi parse JSON hoặc dữ liệu sai format:", err);
            setScheduleData([]); // fallback
          }
        })
        .catch((err) => {
          console.error("❌ Lỗi khi gọi API:", err);
          setScheduleData([]); // fallback
        });
    }
  }, [doctor, dateRange]);

  const displayDays = useMemo(() => {
    return scheduleData.map((s) => ({
      date: s.workDate,
      day: dayjs(s.workDate).format("dd"),
      dayNum: dayjs(s.workDate).format("D/M"),
      available: s.available,
    }));
  }, [scheduleData]);

  const getTimeSlotsForDay = (date) => {
    const entry = scheduleData.find((s) => s.workDate === date);
    if (!entry || !entry.available) return [];

    const slots = [];
    let current = dayjs(`${entry.workDate}T${entry.startTime}`);
    const end = dayjs(`${entry.workDate}T${entry.endTime}`);

    while (current.isBefore(end)) {
      const next = current.add(30, "minute");
      slots.push(`${current.format("HH:mm")} - ${next.format("HH:mm")}`);
      current = next;
    }

    return slots;
  };

  const getDoctorsBySpecialty = (id) => (id ? doctors[id] || [] : []);

  return (
    <Card className="appointment-card">
      <div className="appointment-header">
        <Title level={3}>Đặt lịch hẹn</Title>
        <div className="location-info">
          <EnvironmentOutlined className="location-icon" />
          <Text className="location-text">
            Đồng 22/12, TP Thuận An, Tỉnh Bình Dương
          </Text>
        </div>
      </div>

      <div className="form-section">
        <Text strong>Chuyên khoa</Text>
        <div style={{ width: "100%" }}>
          <div className="select-container">
            <Select
              className="full-width-select"
              style={{ width: "100%" }}
              placeholder="Chọn chuyên khoa"
              value={specialty}
              onChange={(value) => {
                setSpecialty(value);
                setDoctor(undefined);
                setScheduleData([]);
              }}
              size="large"
            >
              {specialties.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <Text strong style={{ marginTop: 16, display: "block" }}>
          Bác sĩ
        </Text>
        <Select
          placeholder={
            specialty ? "Chọn bác sĩ" : "Vui lòng chọn chuyên khoa trước"
          }
          className="full-width-select"
          disabled={!specialty}
          value={doctor}
          onChange={(id) => {
            setDoctor(id);
            setSelectedDay(undefined);
          }}
          size="large"
        >
          {getDoctorsBySpecialty(specialty).map((doc) => (
            <Select.Option key={doc.id} value={doc.id}>
              {doc.name}
            </Select.Option>
          ))}
        </Select>

        <Text strong style={{ marginTop: 16, display: "block" }}>
          Khoảng thời gian (tối đa 1 tháng)
        </Text>
        <ConfigProvider
          theme={{
            components: {
              DatePicker: {
                panelWidth: 300,
              },
            },
          }}
        >
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              if (!dates || dates.length !== 2) return;
              const [start, end] = dates;
              const today = dayjs().startOf("day");
              const max = today.add(30, "day");
              if (start.isBefore(today) || end.isAfter(max)) {
                alert("Chỉ được chọn trong 1 tháng kể từ hôm nay!");
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
            showTime={false}
            showToday={false}
            mode={["date", "date"]}
            panelRender={(panel) => <div style={{ width: 320 }}>{panel}</div>}
            picker="date"
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

      <GradientButton
        type="primary"
        block
        size="large"
        onClick={() => alert("Đặt lịch thành công!")}
      >
        TIẾP TỤC ĐẶT LỊCH
      </GradientButton>
    </Card>
  );
};

export default BookingForm;
