// pages/UserProfile/Booking.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";
import { useSelector } from "react-redux";
import { message } from "antd";
import api from "../../../configs/api";
const TABS = [
  { key: "upcoming", label: "Lịch hẹn sắp đến" },
  { key: "completed", label: "Hoàn thành" },
  { key: "history", label: "Lịch sử đặt chỗ" },
  { key: "combo", label: "Gói khám" },
];

const Booking = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const { search } = useLocation();
  const reduxToken = useSelector((state) => state.user.token);
  const token = reduxToken || localStorage.getItem("token"); // fallback nếu Redux chưa có
  // const token = useSelector((state) => state.user.token);
  useEffect(() => {
    console.log("Redux token:", token);
    console.log("Token (final dùng gọi API):", token);

    const fetchAppointments = async () => {
      setLoading(true);

      try {
        let data = [];

        if (activeTab === "upcoming") {
          const [booked, pending] = await Promise.all([
            api.get("/appointment/by-status?status=CONFIRMED"),
            api.get("/appointment/by-status?status=PENDING"),
          ]);
          data = [...booked.data, ...pending.data];
        } else if (activeTab === "completed") {
          const res = await axios.get(
            "/appointment/by-status?status=COMPLETED"
          );
          data = res.data;
        } else if (activeTab === "history") {
          const res = await api.get("/appointment/by-status?status=CANCELED");
          data = res.data;
        }

        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setAppointments(data);
      } catch (err) {
        console.error(
          "Lỗi khi lấy lịch hẹn:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAppointments();
    } else {
      console.warn(" Không có token để gọi API!");
    }
  }, [activeTab, token]);

  // 2. Kiểm tra MoMo trả về resultCode
  useEffect(() => {
    const query = new URLSearchParams(search);
    const resultCode = query.get("resultCode");

    if (resultCode) {
      localStorage.removeItem("pendingBooking"); // Xoá dù thành công hay thất bại

      if (resultCode === "1000") {
        message.success("Thanh toán thành công!");
        navigate("/"); // hoặc navigate đến trang cảm ơn / lịch sử
      } else {
        message.warning("Thanh toán thất bại hoặc đã bị hủy.");
        const serviceId = JSON.parse(localStorage.getItem("lastServiceId"));
        if (serviceId) {
          navigate(`/service-detail/${serviceId}`);
        } else {
          navigate("/"); // fallback
        }
      }
    }
  }, [search, navigate]);
  const renderAppointments = () => {
    if (loading) {
      return (
        <div className="booking-loading-profile">Đang tải lịch hẹn...</div>
      );
    }

    if (!appointments?.length) {
      const currentTab = TABS.find((t) => t.key === activeTab);

      return (
        <div className="booking-empty-profile">
          <h3>Không có {currentTab?.label.toLowerCase()}</h3>
          <p>Đừng lo lắng. Bạn có thể đặt lịch khi cần</p>
          <button onClick={() => navigate("/services")}>
            Đăng kí khám bệnh
          </button>
        </div>
      );
    }

    return appointments.map((appointment) => (
      <div className="booking-card-profile" key={appointment.id}>
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
    ));
  };

  const renderTabContent = () => renderAppointments();

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
