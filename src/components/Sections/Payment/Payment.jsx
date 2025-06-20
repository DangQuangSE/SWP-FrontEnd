import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // hoặc thêm useLocation nếu cần
import { Result, Button, Spin, message } from "antd";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const booking = JSON.parse(localStorage.getItem("pendingBooking"));

  useEffect(() => {
    const createPayment = async () => {
      if (
        !booking ||
        !booking.appointmentId ||
        !booking.amount ||
        !booking.serviceName ||
        !booking.paymentMethod
      ) {
        message.error("Thiếu thông tin thanh toán hoặc lịch hẹn.");
        setLoading(false);
        return;
      }

      try {
        const payload = {
          appointmentId: booking.appointmentId,
          amount: booking.amount,
          serviceName: booking.serviceName,
        };

        console.log("📤 Gửi tới /api/payment/momo/create:", payload);

        const res = await axios.get("/api/payment/momo/create", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            appointmentId: booking.appointmentId,
            amount: booking.amount,
            serviceName: booking.serviceName,
          },
        });

        const payUrl = res.data.payUrl || res.data.paymentUrl;

        if (!payUrl) {
          throw new Error("Không nhận được liên kết thanh toán.");
        }
        window.location.href = payUrl; // Chuyển hướng sang trang thanh toán
      } catch (err) {
        console.error("Lỗi khi tạo thanh toán:", err);
        const msg =
          err.response?.data?.message ||
          "Không thể khởi tạo thanh toán, vui lòng thử lại.";
        message.error(msg);
        setLoading(false);
      }
    };

    createPayment();
  }, []);

  if (loading) {
    return <Spin tip="Đang tạo thanh toán..." fullscreen />;
  }

  return (
    <Result
      status="info"
      title="Đang chuyển đến cổng thanh toán..."
      subTitle="Vui lòng đợi trong giây lát."
      extra={[
        <Button key="home" onClick={() => navigate("/")}>
          Trở về trang chủ
        </Button>,
      ]}
    />
  );
};

export default Payment;
