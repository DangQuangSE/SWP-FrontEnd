// pages/UserProfile/Booking.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

const TABS = [
  { key: "upcoming", label: "Lịch hẹn sắp đến" },
  { key: "completed", label: "Hoàn thành" },
  { key: "history", label: "Lịch sử đặt chỗ" },
  { key: "packages", label: "Gói khám sức khỏe" },
];

const Booking = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("pendingBooking");
    if (!storedId) {
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(storedId);
    const appointmentId = parsed?.appointmentId;

    axios
      .get(`/api/appointment/${appointmentId}`)
      .then((res) => {
        setAppointment(res.data);
        setLoading(false);
        console.log("Lịch hẹn đã lấy:", res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy lịch hẹn:", err);
        setLoading(false);
      });
  }, []);

  const renderAppointment = () => {
    if (loading)
      return (
        <div className="booking-loading-profile">Đang tải lịch hẹn...</div>
      );

    if (!appointment) {
      return (
        <div className="booking-empty-profile">
          <h3>Không có lịch hẹn sắp đến</h3>
          <p>Đừng lo lắng. Đặt lịch hẹn với một chuyên gia gần đó</p>
          <button onClick={() => navigate("/services")}>
            Đăng kí khám bệnh
          </button>
        </div>
      );
    }

    return (
      <div className="booking-card-profile">
        <h2>Thông tin lịch hẹn</h2>
        <div className="booking-info-profile">
          <p>
            <strong>Ngày hẹn:</strong> {appointment.preferredDate}
          </p>
          <p>
            <strong>Dịch vụ:</strong> {appointment.serviceName}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className={`status ${appointment.status.toLowerCase()}`}>
              {appointment.status}
            </span>
          </p>
          <p>
            <strong>Ghi chú:</strong> {appointment.note || "Không có"}
          </p>
          <p>
            <strong>Giá:</strong> {appointment.price?.toLocaleString()} VND
          </p>
          <p>
            <strong>Thời gian tạo:</strong>{" "}
            {new Date(appointment.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "upcoming") return renderAppointment();
    return (
      <div className="booking-empty-profile">
        <h3>
          Không có {TABS.find((t) => t.key === activeTab).label.toLowerCase()}
        </h3>
        <p>Đừng lo lắng. Bạn có thể đặt lịch khi cần</p>
      </div>
    );
  };

  return (
    <div className="booking-tab-wrapper-profile">
      <h2 className="booking-title-profile">Lịch sử đặt chỗ</h2>

      <div className="booking-tabs-profile">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button-profile ${
              activeTab === tab.key ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="booking-tab-content-profile">{renderTabContent()}</div>
    </div>
  );
};

export default Booking;
