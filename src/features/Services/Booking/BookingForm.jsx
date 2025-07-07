import React, { useEffect, useMemo, useState, useCallback } from "react";
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

import { useSearchParams, useNavigate } from "react-router-dom";
import "./BookingForm.css";
import GradientButton from "../../../components/common/GradientButton";
import api from "../../../configs/api";
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const TAB_LABELS = {
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
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

  // Function to fetch schedule data
  const fetchScheduleData = useCallback(() => {
    if (defaultServiceId) {
      const from = dateRange[0].format("YYYY-MM-DD");
      const to = dateRange[1].format("YYYY-MM-DD");

      console.log(" Fetching schedule data for service:", defaultServiceId);
      api
        .get("/schedules/slot-free-service", {
          params: { service_id: defaultServiceId, from, to },
        })
        .then((res) => {
          const parsed =
            typeof res.data === "string" ? JSON.parse(res.data) : res.data;
          console.log(" Schedule data updated:", parsed);
          setServiceDetail(parsed.serviceDTO);
          setScheduleData(parsed.scheduleResponses || []);
        })
        .catch((err) => {
          console.error(" Lỗi khi gọi slot-free-service:", err);
          setScheduleData([]);
        });
    }
  }, [defaultServiceId, dateRange]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData, detailProp]);

  // Listen for schedule refresh trigger
  useEffect(() => {
    const checkRefreshTrigger = () => {
      const shouldRefresh = localStorage.getItem("shouldRefreshSchedule");
      const lastBookedServiceId = localStorage.getItem("lastBookedServiceId");

      if (
        shouldRefresh === "true" &&
        lastBookedServiceId === defaultServiceId
      ) {
        console.log(" Refreshing schedule data after booking...");
        fetchScheduleData();

        // Clear the trigger
        localStorage.removeItem("shouldRefreshSchedule");
        localStorage.removeItem("lastBookedServiceId");
      }
    };

    // Check immediately
    checkRefreshTrigger();

    // Also listen for storage events (when user comes back from another tab)
    window.addEventListener("storage", checkRefreshTrigger);
    window.addEventListener("focus", checkRefreshTrigger);

    return () => {
      window.removeEventListener("storage", checkRefreshTrigger);
      window.removeEventListener("focus", checkRefreshTrigger);
    };
  }, [defaultServiceId, fetchScheduleData]);

  const displayDays = useMemo(() => {
    if (!Array.isArray(scheduleData)) return [];
    return scheduleData.map((s) => {
      // Tính tổng availableBooking từ tất cả slots
      const totalAvailableBooking =
        s.slots?.reduce((sum, slot) => {
          return sum + (slot.availableBooking || 0);
        }, 0) || 0;

      return {
        date: s.workDate,
        day: dayjs(s.workDate).format("dd"),
        dayNum: dayjs(s.workDate).format("D/M"),
        available: totalAvailableBooking > 0,
        totalSlots: totalAvailableBooking,
      };
    });
  }, [scheduleData]);

  const getTimeSlotsForDay = (date) => {
    const entry = scheduleData.find((s) => s.workDate === date);
    if (!entry || !entry.slots) return [];

    return entry.slots
      .filter(({ availableBooking }) => availableBooking > 0)
      .map(({ startTime, endTime, slotId, availableBooking, maxBooking }) => ({
        time: `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`,
        slotId,
        hour: parseInt(startTime.slice(0, 2), 10),
        availableBooking,
        maxBooking,
        timeDisplay: `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`,
        slotDisplay: `(${availableBooking}/${maxBooking} chỗ trống)`,
      }));
  };

  const handleBooking = () => {
    if (!defaultServiceId || !selectedDay || !selectedTime || !selectedSlotId) {
      message.warning("Vui lòng chọn đủ thông tin!");
      return;
    }

    const bookingPreviewData = {
      serviceId: defaultServiceId,
      serviceName: serviceDetail.name,
      serviceType: serviceDetail.type, // Thêm type của service
      price: serviceDetail.price,
      duration: serviceDetail.duration,
      preferredDate: selectedDay,
      // slot: selectedTime,
      slot: selectedTime.split(" - ")[0],
      slotId: selectedSlotId,
      note,
    };

    console.log(
      "🚀 [DEBUG] Booking preview data with service type:",
      bookingPreviewData
    );

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
              "Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh"}
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
              const parts = { morning: [], afternoon: [] /*evening: [] */ };
              slots.forEach((slot) => {
                const hour = parseInt(slot.time.split(":"[0]), 10);
                if (hour < 12) parts.morning.push(slot);
                else if (hour < 18) parts.afternoon.push(slot);
                // else parts.evening.push(slot);
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
                        <div className="time-slot-content">
                          <div className="time-display">{slot.timeDisplay}</div>
                          <div className="slot-available">
                            {slot.slotDisplay}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabPane>
              ));
            })()}
          </Tabs>
        )}
      </div>
      {serviceDetail?.price && (
        <div className="booking-price">
          <span>Giá:</span>{" "}
          <span className="price-highlight">
            {serviceDetail.price.toLocaleString()} đ
          </span>
        </div>
      )}

      <GradientButton type="primary" block size="large" onClick={handleBooking}>
        TIẾP TỤC ĐẶT LỊCH
      </GradientButton>
    </Card>
  );
};

export default BookingForm;
