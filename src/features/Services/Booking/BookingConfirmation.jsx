"use client";
import { useLocation, useNavigate } from "react-router-dom";
import { message, Avatar } from "antd";
import "./BookingConfirmation.css";
import { useState, useEffect } from "react";
import api from "../../../configs/api";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { state: booking } = useLocation();
  const token = localStorage.getItem("token");
  const [paymentMethod, setPaymentMethod] = useState("direct");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fullBooking = {
    ...booking,
    price: booking.price,
    serviceName: booking.serviceName,
  };

  // Fetch user data from API /api/me
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/me");
        console.log("✅ User data from /api/me:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        message.error("Không thể lấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);
  if (!token) {
    return (
      <div className="booking-confirmation-container">
        <p
          style={{
            padding: 40,
            color: "#2753d0",
            fontWeight: "bold",
            fontSize: "30px",
            textAlign: "center",
          }}
        >
          Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục đặt lịch.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="booking-confirmation-container">
        <p
          style={{
            padding: 40,
            color: "#2753d0",
            fontWeight: "bold",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          Đang tải thông tin người dùng...
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
      // userId: user.id,
      service_id: Number(booking.serviceId),
      preferredDate: booking.preferredDate,
      slot: booking.slot,
      slot_id: booking.slotId,
      note: booking.note,
      paymentMethod,
    };

    console.log(" Payload gửi:", payload);

    try {
      const res = await api.post("/booking/medicalService", payload);

      //  In toàn bộ phản hồi từ server để kiểm tra
      console.log("📥 Phản hồi từ backend khi tạo booking:", res.data);

      const appointmentId = res.data.appointmentId;
      if (!appointmentId) {
        message.error("Không lấy được mã lịch hẹn từ phản hồi server.");
        return;
      }

      // Trigger refresh schedule data khi user quay lại booking form
      localStorage.setItem("shouldRefreshSchedule", "true");
      localStorage.setItem("lastBookedServiceId", booking.serviceId);

      message.success("Đặt lịch thành công!");

      // Nếu chọn thanh toán VNPay, lưu thông tin và chuyển đến trang Payment
      if (paymentMethod === "vnpay") {
        localStorage.setItem(
          "pendingBooking",
          JSON.stringify({
            appointmentId,
            paymentMethod,
            amount: fullBooking.price,
            serviceName: fullBooking.serviceName,
          })
        );

        // Chuyển đến trang Payment để xử lý VNPay
        navigate("/payment");
      } else {
        // Thanh toán trực tiếp - chuyển về trang booking
        navigate("/user/booking");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : "Lỗi không xác định từ máy chủ");

      //  In lỗi đầy đủ nếu server có trả gì đó
      console.error(" Lỗi phản hồi từ server:", error.response?.data);
      message.error(`Đặt lịch thất bại: ${errorMessage}`);
    }
  };

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
        <div className="booking-card">
          <h2 className="booking-card-title">Người sử dụng dịch vụ</h2>
          <div className="booking-user-profile">
            <Avatar
              size={48}
              src={user?.imageUrl}
              className="booking-user-avatar"
            >
              {user?.fullname?.charAt(0) || "U"}
            </Avatar>
            <div className="booking-user-info">
              <h3>{user?.fullname || "Không có tên"}</h3>
              <p>{user?.email || "Không có email"}</p>
            </div>
          </div>
          <div className="booking-info-item">
            <span className="booking-info-label">Vai trò:</span>
            <span className="booking-info-value">
              {user?.role || "Chưa cung cấp"}
            </span>
          </div>
          <div className="booking-info-item">
            <span className="booking-info-label">Số điện thoại:</span>
            <span className="booking-info-value">
              {user?.phone || "Chưa cung cấp"}
            </span>
          </div>
          <div className="booking-info-item">
            <span className="booking-info-label">Địa chỉ:</span>
            <span className="booking-info-value">
              {user?.address || "Chưa cung cấp"}
            </span>
          </div>
          <div className="booking-info-item">
            <span className="booking-info-label">Ghi chú:</span>
            <span className="booking-info-value">
              {booking.note || "(Không có)"}
            </span>
          </div>
        </div>

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

      <div className="booking-card booking-payment-section">
        <h2 className="booking-payment-title">Phương thức thanh toán</h2>
        <div
          className={`booking-payment-method ${
            paymentMethod === "direct" ? "selected" : ""
          }`}
          onClick={() => setPaymentMethod("direct")}
        >
          <input
            type="radio"
            id="direct"
            name="payment"
            value="direct"
            checked={paymentMethod === "direct"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <img
            src="/cash-wallet.svg"
            alt="Thanh toán trực tiếp"
            className="booking-payment-logo"
          />
          <div className="booking-payment-info">
            <label htmlFor="direct">Thanh toán trực tiếp</label>
            <p>Thanh toán bằng tiền mặt tại quầy</p>
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
