// ServiceDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../BookingForm";
import "./ServiceDetail.css";

const ServiceDetail = () => {
  const { id } = useParams(); // Lấy serviceId từ URL: /service-detail/:id
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/service/id/${id}`) // ✅ đường dẫn đúng
      .then((res) => {
        setService(res.data);
        setLoading(false);
        console.log("Chi tiết dịch vụ:", res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết dịch vụ:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (!service) return <div className="error">Không tìm thấy dịch vụ.</div>;

  return (
    <div className="service-detail-container">
      <div className="service-info-detail">
        <h2>{service.name}</h2>
        <p className="price">
          ₫ {service.price?.toLocaleString()} {service.unit || "đ"}
        </p>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: service.description }}
        />
      </div>

      <div className="booking-form-wrapper">
        <BookingForm serviceIdProp={id} serviceDetail={service} />
      </div>
    </div>
  );
};

export default ServiceDetail;
