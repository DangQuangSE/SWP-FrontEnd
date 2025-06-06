import React from "react";
import "./ServiceDangKi.css";
import { useState } from "react";

const ServiceDangKi = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const workingHours = [
    { day: "Thứ Hai", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Ba", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Tư", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Năm", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Sáu", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Bảy", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Chủ Nhật", hours: "Đóng cửa" },
  ];

  const services = [
    "Máy chụp mạch máu số hóa xóa nền",
    "Phòng xét nghiệm",
    "X-quang",
    "Chụp cộng hưởng từ (Chụp MRI)",
    "Hệ thống máy chạy thận nhân tạo",
    "Chụp cắt lớp vi tính - Cone Beam CT Gendex",
    "Máy thở",
  ];

  const faqItems = [
    "Bệnh viện Columbia Asia Bình Dương nằm ở đâu?",
    "Thời gian làm việc của Bệnh viện Columbia Asia Bình Dương?",
    "Bệnh viện Columbia Asia Bình Dương có số đường bảo hiểm y tế không?",
    "Bệnh viện Columbia Asia Bình Dương có dịch vụ nội soi tiêu hóa không?",
    "Bệnh viện Columbia Asia Bình Dương có dịch vụ cấp cứu không?",
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="hospital-page-container">
      <div className="hospital-center-wrapper">
        {/* Hospital Hero Section */}
        <div className="hospital-hero">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wPIbKVckKZ6In8MDvFKwsNypyL6MAn.png"
            alt="Columbia Asia Hospital Building"
            className="hospital-main-image"
          />

          <div className="hospital-profile">
            <div className="hospital-logo">
              <div className="logo-content">
                <div className="logo-icon">🏥</div>
                <div className="logo-text">
                  <span className="logo-main">COLUMBIA</span>
                  <span className="logo-sub">ASIA</span>
                </div>
              </div>
            </div>
            <div className="hospital-info">
              <h1>Bệnh viện Quốc tế Columbia Asia Bình Dương</h1>
              <div className="hospital-address">
                <span className="icon">📍</span>
                <span>
                  Đường 22/12 Khu phố Hòa Lân, Phường Thuận Giao, Thành phố
                  Thuận An, Tỉnh Bình Dương
                </span>
              </div>
              <div className="hospital-actions">
                <a href="#" className="action-link">
                  <span className="icon">📊</span>
                  <span>
                    Xem đánh giá chi tiết của những bệnh nhân đã từng khám chữa
                    bệnh
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="profile-nav-tabs">
            <div className="nav-tabs">
              <span className="nav-tab active">Thông tin chung</span>
              <span className="nav-tab">Dịch vụ (4)</span>
              <span className="nav-tab">Bác sĩ (30)</span>
              <span className="nav-tab">Đánh giá (4)</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            {/* Working Hours */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="icon">⏰</span>
                <span>Giờ làm việc</span>
              </h2>
              <div className="hours-table">
                {workingHours.map((item, index) => (
                  <div key={index} className="hours-row">
                    <span className="day">{item.day}</span>
                    <span
                      className={`hours ${
                        item.hours === "Đóng cửa" ? "closed" : ""
                      }`}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
              <div className="update-hours">
                <button className="update-btn">Có cập cửa</button>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="icon">ℹ️</span>
                <span>Thông tin bệnh viện</span>
              </h2>
              <div className="description-text">
                <p>
                  Bệnh viện Quốc tế Columbia Asia Bình Dương là bệnh viện đa
                  khoa quốc tế đầu tiên tại Bình Dương được đầu tư 100% vốn nước
                  ngoài. Bệnh viện là thành viên thuộc Tập đoàn chăm sóc sức
                  khỏe tư nhân Quốc tế Columbia Asia với hơn 25 năm hoạt động
                  trong lĩnh vực y tế tại Malaysia, Indonesia và Việt nam.
                </p>
                <p>
                  Bệnh viện Columbia Asia Dương là một trong những bệnh viện tư
                  nhân hàng đầu tại Bình Dương, nhận được sự tin nhiệm từ nhiều
                  bệnh nhân ở Bình Dương và khu vực lân cận.
                </p>
                <p>
                  Kết hợp giữa quy trình chăm sóc tận tâm và công nghệ tiên
                  tiến, bệnh nhân sẽ được tận hưởng từ dịch vụ y tế thông thường
                  cho đến các chăm sóc sức khỏe uy tín cao cùng đội ngũ các
                  chuyên khoa giàu kinh nghiệm và tận tâm. Bệnh viện đang trang
                  bị đầy đủ các thiết bị hiện đại...
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="icon">🏥</span>
                <span>Cơ sở vật chất</span>
              </h2>
              <div className="services-grid">
                {services.map((service, index) => (
                  <div key={index} className="service-item">
                    <span className="bullet">•</span>
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="icon">📍</span>
                <span>Vị trí</span>
              </h2>
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="map-icon">📍</div>
                  <p>Bản đồ Google Maps</p>
                  <small>10°56'54.1"N 106°43'10.2"E</small>
                </div>
              </div>
              <div className="location-details">
                <strong>Bệnh viện Quốc tế Columbia Asia Bình Dương</strong>
                <br />
                Đường 22/12 Khu phố Hòa Lân, Phường Thuận Giao, Thành phố Thuận
                An, Tỉnh Bình Dương
              </div>
            </div>

            {/* Appointment Guide */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="icon">📋</span>
                <span>Hướng dẫn thăm bệnh</span>
              </h2>
              <p>
                Hiện tại, Bệnh viện Quốc tế Columbia Asia Bình Dương đang áp
                dụng quy trình khám chữa bệnh như sau:
              </p>
              <div className="guide-box">
                <p>
                  <strong>Bước 1:</strong> Lấy số thứ tự - Đăng ký thông tin
                  bệnh nhân...
                </p>
                <button className="see-more">Xem thêm</button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="icon">💳</span>
                <span>Hình thức thanh toán</span>
              </h2>
              <div className="payment-options">
                <div className="payment-item">
                  <div className="payment-icon visa">VISA</div>
                  <span>Visa</span>
                </div>
                <div className="payment-item">
                  <div className="payment-icon card">💳</div>
                  <span>Thẻ tín dụng khác</span>
                </div>
                <div className="payment-item">
                  <div className="payment-icon cash">💵</div>
                  <span>Tiền mặt</span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="content-section">
              <h2 className="section-title">
                <span className="icon">❓</span>
                <span>Câu hỏi thường gặp</span>
              </h2>
              <div className="faq-list">
                {faqItems.map((question, index) => (
                  <div key={index} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => toggleFaq(index)}
                    >
                      <span>
                        {index + 1}. {question}
                      </span>
                      <span className="faq-icon">
                        {expandedFaq === index ? "−" : "+"}
                      </span>
                    </button>
                    {expandedFaq === index && (
                      <div className="faq-answer">
                        Thông tin chi tiết về câu hỏi này sẽ được hiển thị ở
                        đây.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="right-sidebar">
            <div className="booking-section">
              <h3>Đặt lịch ngay</h3>
              <p className="booking-subtitle">
                Lựa chọn bác sĩ phù hợp, đặt lịch và đến khám và sẵn sàng đặt
                lịch ngay.
              </p>

              <div className="booking-tabs">
                <button className="tab-btn active">
                  <span className="icon">📅</span>
                  <span>Bác sĩ</span>
                </button>
                <button className="tab-btn">Đặt khám ngay</button>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>Bệnh viện</label>
                  <div className="hospital-selected">
                    Bệnh viện Quốc tế Columbia Asia
                  </div>
                </div>

                <div className="form-group">
                  <label>Chuyên khoa</label>
                  <div className="select-wrapper">
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Tìm chuyên khoa</option>
                      <option value="cardiology">Tim mạch</option>
                      <option value="neurology">Thần kinh</option>
                      <option value="orthopedics">
                        Chấn thương chỉnh hình
                      </option>
                    </select>
                    <span className="select-icon">▼</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Bác sĩ</label>
                  <div className="select-wrapper">
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Tìm bác sĩ</option>
                      <option value="doctor1">Bác sĩ A</option>
                      <option value="doctor2">Bác sĩ B</option>
                    </select>
                    <span className="select-icon">▼</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Đặt lịch hẹn</label>
                  <div className="radio-group">
                    <input
                      type="radio"
                      id="online"
                      name="appointment"
                      defaultChecked
                    />
                    <label htmlFor="online">Đặt lịch</label>
                  </div>
                </div>

                <button className="book-btn">Đặt lịch ngay</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDangKi;
