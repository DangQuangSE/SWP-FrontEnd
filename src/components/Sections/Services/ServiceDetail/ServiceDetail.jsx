import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../BookingForm";
import { Tabs } from "antd";
import "./ServiceDetail.css";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/service/id/${id}`)
      .then((res) => {
        setService(res.data);
        setLoading(false);
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
        <p className="service-price">
          ₫ {service.price?.toLocaleString()} {service.unit || "đ"}
        </p>

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Thông tin dịch vụ" key="1">
            {/* Mô tả dịch vụ từ API */}
            <div className="service-description">
              <h3>Về dịch vụ</h3>
              <ul>
                <li>
                  Mang theo sổ khám bệnh, kết quả khám và các xét nghiệm trước
                  đó (nếu có).
                </li>
                <li>
                  Trường hợp có các biểu hiện đau nhức bất thường, có thể trao
                  đổi cùng đội ngũ y bác sĩ.
                </li>
                <li>
                  Vui lòng liên hệ với bộ phận Chăm sóc khách hàng của Columbia
                  Asia để được tư vấn cụ thể hơn về quá trình chuẩn bị.
                </li>
                <li>
                  Hotline: <strong>0274 381 9933</strong>
                </li>
              </ul>
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>

            {/* Thêm phần chuẩn bị */}
            <div className="prep-section">
              <h3>Quá trình chuẩn bị</h3>
              <ul>
                <li>
                  Mang theo sổ khám bệnh, kết quả khám và các xét nghiệm trước
                  đó (nếu có).
                </li>
                <li>
                  Trường hợp có các biểu hiện đau nhức bất thường, có thể trao
                  đổi cùng đội ngũ y bác sĩ.
                </li>
                <li>
                  Vui lòng liên hệ với bộ phận Chăm sóc khách hàng của Columbia
                  Asia để được tư vấn cụ thể hơn về quá trình chuẩn bị.
                </li>
                <li>
                  📞 Hotline: <strong>0274 381 9933</strong>
                </li>
              </ul>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab={`Đánh giá (${service.ratingCount || 0})`} key="2">
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <img src="/no-comment-icon.svg" alt="No review" width={60} />
              <p style={{ color: "#888", marginTop: 12 }}>
                Chưa có đánh giá nào
              </p>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>

      <div className="booking-form-wrapper">
        <BookingForm serviceIdProp={id} serviceDetail={service} />
      </div>
    </div>
  );
};

export default ServiceDetail;
