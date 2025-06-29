import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Result, Button, Spin, message } from "antd";
import api from "../../../configs/api";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const booking = JSON.parse(localStorage.getItem("pendingBooking"));

  // Check VNPay return parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const vnpResponseCode = urlParams.get("vnp_ResponseCode");

    if (vnpResponseCode) {
      // User quay lại từ VNPay
      if (vnpResponseCode === "00") {
        // Thanh toán thành công
        localStorage.removeItem("pendingBooking");
        message.success("Thanh toán thành công!");
        setPaymentSuccess(true);
        setLoading(false);

        setTimeout(() => {
          navigate("/user/booking");
        }, 2000);
      } else {
        // Thanh toán thất bại
        message.error("Thanh toán thất bại hoặc đã bị hủy.");
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      return; // Không chạy createPayment nếu đã có VNPay response
    }
  }, [location.search, navigate]);

  useEffect(() => {
    // Chỉ tạo payment nếu không có VNPay response trong URL
    const urlParams = new URLSearchParams(location.search);
    const vnpResponseCode = urlParams.get("vnp_ResponseCode");

    if (vnpResponseCode) {
      return; // Đã xử lý VNPay response ở useEffect trên
    }

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

        console.log(" Gửi tới /api/payment/momo/create:", payload);

        const res = await api.get("/payment/vnpay/create", {
          params: {
            appointmentId: booking.appointmentId,
            amount: booking.amount,
            serviceName: booking.serviceName,
          },
        });

        // Kiểm tra responseCode để xử lý kết quả tạo payment
        if (res.data.responseCode === 0 && res.data.url) {
          // Tạo payment URL thành công, chuyển hướng đến VNPay
          const payUrl = res.data.url;

          localStorage.removeItem("pendingBooking");
          setLoading(false); // Hiển thị trang "Đang chuyển đến cổng thanh toán..."

          // Chuyển hướng sau 5 giây
          setTimeout(() => {
            window.location.href = payUrl;
          }, 5000);
        } else if (res.data.responseCode === 0 && !res.data.url) {
          // Trường hợp đặc biệt: responseCode = 0 nhưng không có URL (có thể là thanh toán trực tiếp)
          localStorage.removeItem("pendingBooking");
          message.success(res.data.message || "Đặt lịch thành công!");
          setPaymentSuccess(true);
          setLoading(false);

          // Chuyển hướng đến trang booking sau 2 giây
          setTimeout(() => {
            navigate("/user/booking");
          }, 2000);
        } else {
          // Lỗi tạo payment
          throw new Error(
            res.data.message || "Không thể tạo liên kết thanh toán."
          );
        }
      } catch (err) {
        console.error("Lỗi khi tạo thanh toán:", err);
        const msg =
          err.response?.data?.message ||
          "Không thể khởi tạo thanh toán, vui lòng thử lại.";
        message.error(msg);
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    createPayment();
  }, [booking, navigate, location.search]);

  if (loading) {
    return <Spin tip="Đang tạo thanh toán..." fullscreen />;
  }

  // Hiển thị UI dựa trên trạng thái thanh toán
  if (paymentSuccess) {
    return (
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle="Bạn sẽ được chuyển hướng đến trang lịch hẹn trong 2 giây..."
        extra={[
          <Button
            key="booking"
            type="primary"
            onClick={() => navigate("/user/booking")}
          >
            Xem lịch hẹn
          </Button>,
          <Button key="home" onClick={() => navigate("/")}>
            Trở về trang chủ
          </Button>,
        ]}
      />
    );
  }

  return (
    <Result
      status="info"
      title="Đang chuyển đến cổng thanh toán..."
      subTitle="Bạn sẽ được chuyển hướng đến VNPay trong 5 giây..."
      extra={[
        <Button key="home" onClick={() => navigate("/")}>
          Trở về trang chủ
        </Button>,
      ]}
    />
  );
};

export default Payment;
