// src/pages/MomoReturn.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Spin, Button, message } from "antd";
import axios from "axios";

const MomoReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("info");
  const [resultMessage, setResultMessage] = useState(
    "Đang xác nhận kết quả thanh toán..."
  );

  useEffect(() => {
    const handleReturn = async () => {
      const searchParams = new URLSearchParams(location.search);
      const data = {};

      for (const [key, value] of searchParams.entries()) {
        data[key] = value;
      }

      try {
        const res = await axios.post("/api/payment/momo/return", data);
        console.log("Kết quả trả về từ Momo:", res.data);
        if (res.data?.success) {
          setStatus("success");
          setResultMessage(res.data.message || "Thanh toán thành công!");
          message.success("Thanh toán thành công!");
        } else {
          setStatus("error");
          setResultMessage(res.data.message || "Thanh toán thất bại.");
          message.error("Thanh toán thất bại.");
        }
      } catch (error) {
        console.error("Lỗi xử lý momo return:", error);
        setStatus("error");
        setResultMessage("Lỗi khi xác nhận thanh toán. Vui lòng thử lại.");
        message.error("Không thể xác nhận thanh toán.");
      } finally {
        setLoading(false);
        localStorage.removeItem("pendingBooking"); // Xoá sau khi thanh toán
      }
    };

    handleReturn();
  }, [location.search]);

  if (loading) {
    return <Spin tip="Đang xác nhận thanh toán..." fullscreen />;
  }

  return (
    <Result
      status={status}
      title={
        status === "success"
          ? "Thanh toán thành công!"
          : "Thanh toán không thành công"
      }
      subTitle={resultMessage}
      extra={[
        <Button key="home" type="primary" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>,
      ]}
    />
  );
};

export default MomoReturn;
