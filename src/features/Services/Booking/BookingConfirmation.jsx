"use client";
import { useLocation, useNavigate } from "react-router-dom";
import { message, Avatar, Modal } from "antd";
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
  const [showDepositModal, setShowDepositModal] = useState(false);
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
        console.log("User data from /api/me:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error(" Error fetching user data:", error);
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
    // Nếu chọn thanh toán trực tiếp, hiển thị modal cảnh báo trước
    if (paymentMethod === "direct") {
      setShowDepositModal(true);
      return;
    }

    // Tiếp tục với logic booking bình thường cho VNPay
    await processBooking();
  };

  const processBooking = async () => {
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

      // Lưu service type vào localStorage
      if (booking.serviceType) {
        localStorage.setItem("lastBookedServiceType", booking.serviceType);
        console.log(
          "💾 [DEBUG] Saved service type to localStorage:",
          booking.serviceType
        );
      }

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
            serviceType: booking.serviceType, // Thêm service type vào pendingBooking
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

  const handleDepositConfirm = async () => {
    console.log("🚀 [DEBUG] handleDepositConfirm started");
    console.log("🚀 [DEBUG] Current booking data:", booking);
    console.log("🚀 [DEBUG] Full booking data:", fullBooking);
    console.log("🚀 [DEBUG] Deposit amount:", depositAmount);

    setShowDepositModal(false);

    // Tạo appointment trước, sau đó lưu thông tin và chuyển đến Payment giống hệt VNPay
    try {
      const bookingPayload = {
        service_id: Number(booking.serviceId),
        preferredDate: booking.preferredDate,
        slot: booking.slot,
        slot_id: booking.slotId,
        note: booking.note,
        paymentMethod: "direct",
      };

      console.log("📤 [DEBUG] Sending booking payload:", bookingPayload);

      const res = await api.post("/booking/medicalService", bookingPayload);

      console.log("📥 [DEBUG] Backend response:", res.data);
      console.log("📥 [DEBUG] Response status:", res.status);
      console.log("📥 [DEBUG] Full response object:", res);

      const appointmentId = res.data.appointmentId;
      console.log("🆔 [DEBUG] Extracted appointmentId:", appointmentId);

      if (!appointmentId) {
        console.error("❌ [DEBUG] No appointmentId in response!");
        message.error("Không lấy được mã lịch hẹn từ phản hồi server.");
        return;
      }

      // Trigger refresh schedule data khi user quay lại booking form
      localStorage.setItem("shouldRefreshSchedule", "true");
      localStorage.setItem("lastBookedServiceId", booking.serviceId);

      // Lưu service type vào localStorage
      if (booking.serviceType) {
        localStorage.setItem("lastBookedServiceType", booking.serviceType);
        console.log(
          "💾 [DEBUG] Saved service type to localStorage (direct payment):",
          booking.serviceType
        );
      }

      message.success("Đặt lịch thành công!");

      // Lưu thông tin và chuyển đến trang Payment để xử lý create-off giống VNPay
      const pendingBookingData = {
        appointmentId,
        paymentMethod: "direct",
        amount: depositAmount, // 20% giá trị dịch vụ
        serviceName: fullBooking.serviceName,
        serviceType: booking.serviceType, // Thêm service type vào pendingBooking
        isDirectPayment: true, // Flag để Payment.jsx biết gọi create-off
      };

      console.log("💾 [DEBUG] Saving to localStorage:", pendingBookingData);
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify(pendingBookingData)
      );

      console.log("🔄 [DEBUG] Navigating to /payment");
      // Chuyển đến trang Payment để xử lý create-off
      navigate("/payment");
    } catch (error) {
      console.error("❌ [DEBUG] Error occurred:", error);
      console.error("❌ [DEBUG] Error response:", error.response);
      console.error("❌ [DEBUG] Error response data:", error.response?.data);
      console.error(
        "❌ [DEBUG] Error response status:",
        error.response?.status
      );

      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : "Lỗi không xác định từ máy chủ");

      console.error("❌ [DEBUG] Final error message:", errorMessage);
      message.error(`Đặt lịch thất bại: ${errorMessage}`);
    }
  };

  const handleDepositCancel = () => {
    setShowDepositModal(false);
  };

  const depositAmount = Math.round(booking.price * 0.2);

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
            <span className="booking-info-label">Email:</span>
            <span className="booking-info-value">
              {user?.email || "Chưa cung cấp"}
            </span>
          </div>
          <div className="booking-info-item">
            <span className="booking-info-label">Ngày sinh:</span>
            <span className="booking-info-value">
              {user?.dateOfBirth || "Chưa cung cấp"}
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
          <div className="booking-info-item">
            <span className="booking-info-label">Ghi chú:</span>
            <span className="booking-info-value">
              {booking.note || "(Không có)"}
            </span>
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

      {/* Modal cảnh báo thanh toán trực tiếp */}
      <Modal
        title="Thông báo về thanh toán trực tiếp"
        open={showDepositModal}
        onOk={handleDepositConfirm}
        onCancel={handleDepositCancel}
        okText="Tôi đã hiểu, tiếp tục"
        cancelText="Hủy bỏ"
        width={500}
        centered
      >
        <div style={{ padding: "16px 0" }}>
          <div
            style={{
              backgroundColor: "#fff7e6",
              border: "1px solid #ffd591",
              borderRadius: "6px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  marginRight: "8px",
                  color: "#fa8c16",
                }}
              >
                ⚠️
              </span>
              <strong style={{ color: "#fa8c16" }}>Lưu ý quan trọng</strong>
            </div>
            <p style={{ margin: 0, lineHeight: "1.6" }}>
              Để giữ chỗ cho lịch hẹn của bạn, bạn cần thanh toán{" "}
              <strong style={{ color: "#2753d0" }}>
                20% giá trị dịch vụ ({depositAmount.toLocaleString()} đ)
              </strong>{" "}
              khi đến khám tại phòng khám.
            </p>
          </div>

          <div style={{ fontSize: "14px", color: "#666" }}>
            <p>
              <strong>Chi tiết:</strong>
            </p>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              <li>
                Tổng giá trị dịch vụ:{" "}
                <strong>{booking.price?.toLocaleString()} đ</strong>
              </li>
              <li>
                Số tiền cần thanh toán để giữ chỗ:{" "}
                <strong style={{ color: "#2753d0" }}>
                  {depositAmount.toLocaleString()} đ
                </strong>
              </li>
              <li>
                Số tiền còn lại thanh toán khi khám:{" "}
                <strong>
                  {(booking.price - depositAmount).toLocaleString()} đ
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingConfirmation;
