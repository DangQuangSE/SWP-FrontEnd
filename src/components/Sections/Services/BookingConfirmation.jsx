"use client";
import { useLocation, useNavigate } from "react-router-dom";
import { message, Avatar } from "antd";
import "./BookingConfirmation.css";
import { useEffect, useState } from "react";
import axios from "axios"; // ✅ Thêm dòng này

const BookingConfirmation = () => {
  const { state: booking } = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");
  //   const token =
  //     localStorage.getItem("token") ||
  //     "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZ3V5ZW5xdW9jYW4xMDEwQGdtYWlsLmNvbSIsImlkIjoxLCJmdWxsbmFtZSI6IlF1b2MgQW4iLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NTAzNTM4ODgsImV4cCI6MTc1MDQ0MDI4OH0.kXNoq9P3q5cRTuq2NgDCxGEKu-j-6TnpNJmem6tX3Po";
  const [paymentMethod, setPaymentMethod] = useState("momo");

  useEffect(() => {
    if (!token) {
      message.error("Bạn chưa đăng nhập. Đang chuyển về trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="booking-confirmation-container">
        <p style={{ padding: 40, color: "red", fontWeight: "bold" }}>
          Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục đặt lịch.
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-confirmation-container">
        <div className="booking-no-data">Không có thông tin đặt lịch!</div>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    const payload = {
      service_id: Number.parseInt(booking.serviceId, 10),
      preferredDate: booking.preferredDate,
      slot: booking.slot,
      note: booking.note,
      paymentMethod,
      slot_id: booking.slotId, // Thêm slot_id nếu cần thiết
    };
    console.log("🧪 Token dùng để gửi:", token);
    try {
      const res = await axios.post("/api/booking/medicalService", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      message.success("Đặt lịch thành công!");
      navigate("/payment", { state: { bookingId: res.data.id } });
    } catch (error) {
      //  Xử lý mọi trường hợp backend trả lỗi dạng JSON hoặc plain text
      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : "Lỗi không xác định từ máy chủ");
      message.error(`Đặt lịch thất bại: ${errorMessage}`);
    }
  };

  // ⬇phần còn lại giữ nguyên
  return (
    <div className="booking-confirmation-container">
      <div className="booking-notification">
        <div className="booking-notification-content">
          <div className="booking-notification-icon">!</div>
          <span className="booking-notification-text">
            Vui lòng xác minh lại thông tin của bạn và xác nhận đặt lịch hẹn.
          </span>
        </div>
      </div>

      <div className="booking-main-content">
        {/* Left: Thông tin người dùng */}
        <div className="booking-card">
          <h2 className="booking-card-title">Người sử dụng dịch vụ</h2>

          <div className="booking-user-profile">
            <Avatar
              size={48}
              src={user.picture}
              className="booking-user-avatar"
            >
              {user.name?.charAt(0) || "U"}
            </Avatar>
            <div className="booking-user-info">
              <h3>{user.name || "Không có tên"}</h3>
              <p>{user.email || "Không có email"}</p>
            </div>
          </div>

          <div className="booking-info-item">
            <span className="booking-info-label">Giới tính:</span>
            <span className="booking-info-value">
              {user.gender || "Chưa cung cấp"}
            </span>
          </div>

          <div className="booking-info-item">
            <span className="booking-info-label">Ngày sinh:</span>
            <span className="booking-info-value">
              {user.dob || "Chưa cung cấp"}
            </span>
          </div>

          <div className="booking-info-item">
            <span className="booking-info-label">Số điện thoại:</span>
            <span className="booking-info-value">
              {user.phone || "Chưa cung cấp"}
            </span>
          </div>
          <div className="booking-info-item">
            <span className="booking-info-label">Địa chỉ:</span>
            <span className="booking-info-value">
              {booking.address || "(Không có)"}
            </span>
          </div>
          <div className="booking-info-item">
            <span className="booking-info-label">Ghi chú:</span>
            <span className="booking-info-value">
              {booking.note || "(Không có)"}
            </span>
          </div>
        </div>

        {/* Right: Thông tin lịch hẹn */}
        <div className="booking-card">
          <h2 className="booking-card-title">Lịch hẹn của bạn</h2>

          <div className="booking-info-item">
            <span className="booking-info-label">Dịch vụ:</span>
            <span className="booking-info-value booking-service-name">
              {booking.serviceName}
            </span>
          </div>

          <div className="booking-info-item">
            <span className="booking-info-label">Thời lượng:</span>
            <span className="booking-info-value">{booking.duration} phút</span>
          </div>

          <div className="booking-info-item">
            <span className="booking-info-label">Giá:</span>
            <span className="booking-info-value booking-price">
              {booking.price?.toLocaleString()} đ
            </span>
          </div>

          <div className="booking-info-item">
            <span className="booking-info-label">Ngày hẹn:</span>
            <span className="booking-info-value">{booking.preferredDate}</span>
          </div>

          <div className="booking-info-item">
            <span className="booking-info-label">Khung giờ:</span>
            <span className="booking-info-value">{booking.slot}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="booking-card booking-payment-section">
        <h2 className="booking-payment-title">Phương thức thanh toán</h2>

        <div
          className={`booking-payment-method ${
            paymentMethod === "momo" ? "selected" : ""
          }`}
          onClick={() => setPaymentMethod("momo")}
        >
          <input
            type="radio"
            id="momo"
            name="payment"
            value="momo"
            checked={paymentMethod === "momo"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <img
            src="/momo_icon_square_pinkbg_RGB.png"
            alt="MoMo"
            className="booking-payment-logo"
          />
          <div className="booking-payment-info">
            <label htmlFor="momo">Thanh toán qua MoMo</label>
            <p>Ví điện tử MoMo - Nhanh chóng, tiện lợi</p>
          </div>
        </div>

        <div
          className={`booking-payment-method ${
            paymentMethod === "vnpay" ? "selected" : ""
          }`}
          onClick={() => setPaymentMethod("vnpay")}
        >
          <input
            type="radio"
            id="vnpay"
            name="payment"
            value="vnpay"
            checked={paymentMethod === "vnpay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <img
            src="/LOGOGVNPAY-QR.png"
            alt="VNPay"
            className="booking-payment-logo"
          />
          <div className="booking-payment-info">
            <label htmlFor="vnpay">Thanh toán qua VNPay</label>
            <p>Thẻ ATM, Visa, Mastercard, QR Code</p>
          </div>
        </div>
      </div>
      <div className="booking-confirm-section">
        <button
          className="booking-confirm-button"
          onClick={handleConfirmBooking}
        >
          Tiến hành xác nhận
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
