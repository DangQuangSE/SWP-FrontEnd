import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../../Booking/BookingForm";
import { Tabs } from "antd";
import "./ServiceDetail.css";
import api from "../../../../configs/api.js";
const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  // Thêm state mới cho đánh giá
  const [feedbacks, setFeedbacks] = useState([]);

  // Component hiển thị đánh giá sao
  const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>);
    }
    return <div className="star-rating">{stars}</div>;
  };

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/services/${id}`)
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết dịch vụ:", err);
        setLoading(false);
      });

    // Thêm phần lấy đánh giá
    api.get(`/feedback/service/${id}`)
      .then((res) => {
        console.log("Danh sách đánh giá:", res.data);
        setFeedbacks(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách đánh giá:", err);
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
            <div className="service-details-wrapper">
              <div className="service-description">
                <h3>Về dịch vụ</h3>
                <ul>
                  <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                </ul>
              </div>

              {/* Thêm phần chuẩn bị */}
              <div className="prep-section">
                <h3>Quá trình chuẩn bị</h3>
                <div className="prep-items">
                  <div className="prep-item">
                    Mang theo sổ khám bệnh, kết quả khám và các xét nghiệm trước
                    đó (nếu có).
                  </div>
                  <div className="prep-item">
                    💬 Trường hợp có các biểu hiện đau nhức bất thường, có thể
                    trao đổi cùng đội ngũ y bác sĩ.
                  </div>
                  <div className="prep-item">
                    📞 Vui lòng liên hệ với bộ phận Chăm sóc khách hàng của
                    Columbia Asia để được tư vấn cụ thể hơn.
                  </div>
                  <div className="prep-item">
                    ☎️ Hotline: <strong>0274 381 9933</strong>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane tab={`Đánh giá (${feedbacks.length || 0})`} key="2">
            {feedbacks.length > 0 ? (
              <div className="feedback-list">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="feedback-card">
                    <div className="feedback-header">
                      <h4 className="feedback-author">{feedback.userName || "Khách hàng"}</h4>
                      <StarRating rating={feedback.rating} />
                    </div>
                    <p className="feedback-date">
                      {new Date(feedback.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="feedback-comment">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ color: "#888", marginTop: 12 }}>
                  Chưa có đánh giá nào
                </p>
              </div>
            )}
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
