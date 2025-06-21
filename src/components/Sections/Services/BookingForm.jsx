import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Tabs,
  DatePicker,
  ConfigProvider,
  Input,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./BookingForm.css";
import GradientButton from "../../common/GradientButton";

dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const TAB_LABELS = {
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
  evening: "Buổi tối",
};

const BookingForm = ({ serviceIdProp, serviceDetail: detailProp }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultServiceId = serviceIdProp || searchParams.get("service_id");

  const [serviceDetail, setServiceDetail] = useState(detailProp || null);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(30, "day")]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [activeTab, setActiveTab] = useState("morning");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (defaultServiceId) {
      const from = dateRange[0].format("YYYY-MM-DD");
      const to = dateRange[1].format("YYYY-MM-DD");

      axios
        .get("/api/schedules/slot-free-service", {
          params: { service_id: defaultServiceId, from, to },
        })
        .then((res) => {
          const parsed =
            typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          console.log("Response nè đm:", parsed);
          setServiceDetail(parsed.serviceDTO);
          setScheduleData(parsed.scheduleResponses || []);
        })
        .catch((err) => {
          console.error("Lỗi khi gọi slot-free-service:", err);
          setScheduleData([]);
        });
    }
  }, [defaultServiceId, dateRange, detailProp]);

  const displayDays = useMemo(() => {
    if (!Array.isArray(scheduleData)) return [];
    return scheduleData.map((s) => {
      const totalSlots = s.slots?.length || 0;
      return {
        date: s.workDate,
        day: dayjs(s.workDate).format("dd"),
        dayNum: dayjs(s.workDate).format("D/M"),
        available: totalSlots > 0,
        totalSlots,
      };
    });
  }, [scheduleData]);

  const getTimeSlotsForDay = (date) => {
    const entry = scheduleData.find((s) => s.workDate === date);
    if (!entry || !entry.slots) return [];

    const slots = [];

    entry.slots.forEach(({ startTime, endTime, slotId, availableBooking }) => {
      if (availableBooking > 0 && startTime && endTime) {
        let current = dayjs(`${date}T${startTime}`);
        const end = dayjs(`${date}T${endTime}`);

        while (current.isBefore(end)) {
          slots.push({
            time: current.format("HH:mm"),
            slotId, // bạn có thể thay đổi logic nếu mỗi khung giờ cần id riêng
          });
          current = current.add(30, "minute");
        }
      }
    });

    return slots;
  };

  const handleBooking = () => {
    if (!defaultServiceId || !selectedDay || !selectedTime || !selectedSlotId) {
      message.warning("Vui lòng chọn đủ thông tin!");
      return;
    }

    const bookingPreviewData = {
      serviceId: defaultServiceId,
      serviceName: serviceDetail.name,
      price: serviceDetail.price,
      duration: serviceDetail.duration,
      preferredDate: selectedDay,
      slot: selectedTime,
      slotId: selectedSlotId,
      note,
    };

    navigate("/booking-confirmation", { state: bookingPreviewData });
  };

  return (
    <Card className="appointment-card">
      <div className="appointment-header">
        <Title level={3}>Đặt lịch hẹn</Title>
        <div className="location-info">
          <EnvironmentOutlined className="location-icon" />
          <Text className="location-text">
            {serviceDetail?.location ||
              "Địa chỉ sẽ hiển thị tại trang xác nhận"}
          </Text>
        </div>
      </div>

      {serviceDetail && (
        <div className="service-info-section">
          <Title level={4}>{serviceDetail.name}</Title>
          <Text>{serviceDetail.description}</Text>
          <p>
            Giá: {serviceDetail.price?.toLocaleString()} đ – Thời lượng:{" "}
            {serviceDetail.duration} phút
          </p>
        </div>
      )}

      <div className="form-section">
        <Text strong style={{ marginTop: 16, display: "block" }}>
          Ghi chú (nếu có)
        </Text>
        <TextArea
          rows={2}
          placeholder="Mô tả triệu chứng, yêu cầu đặc biệt..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Text strong style={{ marginTop: 16, display: "block" }}>
          Khoảng thời gian (tối đa 1 tháng)
        </Text>
        <ConfigProvider locale={locale}>
          <DatePicker
            picker="date"
            value={dateRange[0]}
            onChange={(date) => {
              const today = dayjs().startOf("day");
              const max = today.add(30, "day");
              if (!date || date.isBefore(today) || date.isAfter(max)) {
                message.warning("Chỉ được chọn trong 1 tháng!");
                return;
              }
              setDateRange([date.startOf("day"), date.add(30, "day")]);
            }}
            format={() =>
              `Từ ${dateRange[0].format(
                "DD/MM/YYYY"
              )} đến ${dateRange[1].format("DD/MM/YYYY")}`
            }
            size="large"
            className="date-range-picker"
            allowClear={false}
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
                {d.available && (
                  <div className="slot-count">{d.totalSlots} chỗ trống</div>
                )}
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
                const hour = parseInt(slot.time.split(":"[0]), 10);
                if (hour < 12) parts.morning.push(slot);
                else if (hour < 18) parts.afternoon.push(slot);
                else parts.evening.push(slot);
              });
              return Object.entries(parts).map(([key, list]) => (
                <TabPane tab={TAB_LABELS[key] || key} key={key}>
                  <div className="time-slots-grid">
                    {list.map((slot) => (
                      <Button
                        key={`${slot.slotId}-${slot.time}`}
                        className={`time-slot ${
                          selectedTime === slot.time ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedTime(slot.time);
                          setSelectedSlotId(slot.slotId);
                        }}
                      >
                        {slot.time}
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
