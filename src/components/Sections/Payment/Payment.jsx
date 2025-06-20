import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button, Spin, message } from "antd";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const token = localStorage.getItem("token");
  const booking = JSON.parse(localStorage.getItem("pendingBooking"));

  const query = new URLSearchParams(location.search);
  const resultCode = query.get("resultCode");
  const transactionCode = query.get("transId");

  useEffect(() => {
    const confirmBooking = async () => {
      if (!booking || !token || resultCode !== "0") {
        message.error("Thanh toán thất bại hoặc thiếu thông tin");
        setLoading(false);
        return;
      }

      try {
        const payload = {
          ...booking,
          transactionCode,
        };

        const res = await axios.post("/api/booking/medicalService", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookingSuccess(true);
        localStorage.removeItem("pendingBooking");
      } catch (err) {
        message.error("Lưu lịch hẹn thất bại sau khi thanh toán");
      } finally {
        setLoading(false);
      }
    };

    confirmBooking();
  }, [booking, token, resultCode, transactionCode]);

  if (loading) {
    return <Spin tip="Đang xử lý thanh toán và lưu lịch..." fullscreen />;
  }

  return (
    <Result
      status={bookingSuccess ? "success" : "error"}
      title={
        bookingSuccess
          ? "Đặt lịch thành công!"
          : "Thanh toán thành công nhưng gặp lỗi khi lưu lịch"
      }
      subTitle={
        bookingSuccess
          ? "Bạn có thể kiểm tra lịch hẹn của mình trong trang tài khoản."
          : "Vui lòng liên hệ hỗ trợ nếu gặp lỗi này nhiều lần."
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>,
      ]}
    />
  );
};

export default Payment;
