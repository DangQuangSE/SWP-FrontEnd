import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "../../Booking/BookingForm";
import { Tabs, Card, Avatar, Modal, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./ServiceDetail.css";
import api from "../../../../configs/api.js";
const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  // Thêm state mới cho đánh giá
  const [feedbacks, setFeedbacks] = useState([]);
  // Thêm state cho danh sách bác sĩ
  const [consultants, setConsultants] = useState([]);
  // State cho modal thông tin bác sĩ
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  // Hàm xử lý modal
  const showConsultantModal = (consultant) => {
    setSelectedConsultant(consultant);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedConsultant(null);
  };

  const handleSelectConsultant = (consultant) => {
    // Lưu thông tin bác sĩ đã chọn vào localStorage
    localStorage.setItem("selectedConsultantId", consultant.id);
    localStorage.setItem(
      "selectedConsultantName",
      consultant.fullname || "Chưa có tên"
    );
    localStorage.setItem(
      "selectedConsultantSpecialization",
      consultant.specialization || "Chưa có chuyên khoa"
    );

    // Trigger event để BookingForm cập nhật
    window.dispatchEvent(new Event("consultantSelected"));

    console.log("Đã chọn bác sĩ:", consultant.fullname);
    handleModalClose();
  };

  // Component hiển thị đánh giá sao
  const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  useEffect(() => {
    if (!id) return;

    api
      .get(`/services/${id}`)
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết dịch vụ:", err);
        setLoading(false);
      });

    // Thêm phần lấy đánh giá
    api
      .get(`/feedback/service/${id}`)
      .then((res) => {
        console.log("Danh sách đánh giá:", res.data);
        setFeedbacks(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách đánh giá:", err);
      });

    // Thêm phần lấy danh sách bác sĩ by id
    api
      .get(`/consultants/by-service/${id}`)
      .then((res) => {
        console.log("Danh sách bác sĩ:", res.data);
        setConsultants(res.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách bác sĩ:", err);
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
          <Tabs.TabPane tab={`Bác sĩ (${consultants.length || 0})`} key="3">
            {consultants.length > 0 ? (
              <div className="consultants-list">
                {consultants.map((consultant) => (
                  <Card
                    key={consultant.id}
                    className="consultant-card consultant-card-clickable"
                    onClick={() => showConsultantModal(consultant)}
                  >
                    <div className="consultant-info">
                      <Avatar
                        size={64}
                        src={consultant.imageUrl}
                        icon={<UserOutlined />}
                      />
                      <div className="consultant-details">
                        <h4 className="consultant-name">
                          {consultant.fullname || "Chưa có tên"}
                        </h4>
                        <p className="consultant-specialization">
                          {consultant.specialization || "Chưa có chuyên khoa"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="empty-state-text">Chưa có bác sĩ nào</p>
              </div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab={`Đánh giá (${feedbacks.length || 0})`} key="2">
            {feedbacks.length > 0 ? (
              <div className="feedback-list">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="feedback-card">
                    <div className="feedback-header">
                      <h4 className="feedback-author">
                        {feedback.userName || "Khách hàng"}
                      </h4>
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
              <div className="empty-state">
                <p className="empty-state-text">Chưa có đánh giá nào</p>
              </div>
            )}
          </Tabs.TabPane>
        </Tabs>
      </div>

      <div className="booking-form-wrapper">
        <BookingForm serviceIdProp={id} serviceDetail={service} />
      </div>

      {/* Modal thông tin chi tiết bác sĩ */}
      <Modal
        title="Thông tin chi tiết bác sĩ"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Đóng
          </Button>,
          <Button
            key="select"
            type="primary"
            onClick={() => handleSelectConsultant(selectedConsultant)}
          >
            Chọn bác sĩ này
          </Button>,
        ]}
        width={600}
        className="consultant-modal"
      >
        {selectedConsultant && (
          <div className="consultant-modal-content">
            <div className="consultant-modal-left">
              <Avatar
                size={120}
                src={selectedConsultant.imageUrl}
                icon={<UserOutlined />}
                className="consultant-modal-avatar"
              />
            </div>
            <div className="consultant-modal-right">
              <h3 className="consultant-modal-name">
                {selectedConsultant.fullname || "Chưa có tên"}
              </h3>
              <p className="consultant-modal-specialization">
                <strong>Chuyên khoa:</strong>{" "}
                {selectedConsultant.specialization || "Chưa có chuyên khoa"}
              </p>
              <p className="consultant-modal-email">
                <strong>Email:</strong> {selectedConsultant.email}
              </p>
              {selectedConsultant.phone && (
                <p className="consultant-modal-phone">
                  <strong>Số điện thoại:</strong> {selectedConsultant.phone}
                </p>
              )}
              {selectedConsultant.experience && (
                <p className="consultant-modal-experience">
                  <strong>Kinh nghiệm:</strong> {selectedConsultant.experience}
                </p>
              )}
              {selectedConsultant.description && (
                <p className="consultant-modal-description">
                  <strong>Mô tả:</strong> {selectedConsultant.description}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceDetail;
