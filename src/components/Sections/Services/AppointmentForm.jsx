import React, { useState } from "react";
import "./AppointmentForm.css";
import BookingForm from "./BookingForm";

const ServiceDangKi = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const workingHours = [
    { day: "Thứ Hai", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Ba", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Tư", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Năm", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Sáu", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Thứ Bảy", hours: "07:30 - 11:30, 12:30 - 16:30" },
    { day: "Chủ Nhật", hours: "Đóng cửa" },
  ];
  const faqItems = [
    "S-HeathyCare nằm ở đâu?",
    "Thời gian làm việc của S-HeathyCare?",
    "S-HeathyCare có hỗ trợ bảo hiểm y tế không?",
    "S-HeathyCare có dịch vụ nội soi tiêu hóa không?",
    "S-HeathyCare có dịch vụ cấp cứu không?",
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="hospital-page-container">
      <div className="hospital-center-wrapper">
        {/* Hero Section */}
        <div className="hospital-hero">
          <div className="hospital-profile">
            <div className="hospital-logo">
              <div className="logo-content">
                <div className="logo-icon">
                  <img
                    src="logostc.png"
                    alt="Hospital Logo"
                    className="logo-image"
                  />
                </div>
              </div>
            </div>

            <div className="hospital-info">
              <h1>S-HeathyCare</h1>
              <div className="hospital-address">
                <span className="icon">📍</span>
                <span>
                  Đường 22/12 Khu phố Hòa Lân, Phường Thuận Giao, Thành phố
                  Thuận An, Tỉnh Bình Dương
                </span>
              </div>
              <div className="hospital-actions">
                <a href="#" className="action-link">
                  <span className="icon"></span>
                </a>
              </div>

              {/* Tabs đã được di chuyển vào trong hospital-info */}
            </div>
          </div>
        </div>
        <div className="profile-nav-tabs">
          <div className="nav-tabs">
            <span className="nav-tab active">Thông tin chung</span>
            <span className="nav-tab">Dịch vụ (4)</span>
            <span className="nav-tab">Bác sĩ (30)</span>
            <span className="nav-tab">Đánh giá (4)</span>
          </div>
        </div>
        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            <div className="content-section">
              <h2 className="section-title">
                <span className="icon">🏥</span>
                <span>Giới thiệu chung</span>
              </h2>
              <div className="about-text">
                <p>
                  <strong>SheathyCare</strong> là cơ sở chăm sóc sức khỏe tiên
                  phong trong việc kết hợp giữa chuyên môn y tế, công nghệ hiện
                  đại và dịch vụ thân thiện với người dùng, hướng đến việc chăm
                  sóc toàn diện sức khỏe giới tính và sinh sản cho cộng đồng.
                </p>

                <p>
                  Chúng tôi cung cấp một hệ sinh thái y tế thông minh, cho phép
                  người dùng dễ dàng:
                </p>
                <ul>
                  <li>Theo dõi chu kỳ sinh sản</li>
                  <li>Đặt lịch tư vấn với chuyên gia</li>
                  <li>
                    Thực hiện xét nghiệm các bệnh lây truyền qua đường tình dục
                    (STIs)
                  </li>
                  <li>Nhận lời khuyên y tế cá nhân hóa</li>
                  <li>Quản lý hồ sơ sức khỏe riêng tư, bảo mật</li>
                </ul>

                <p>
                  <strong>Điểm nổi bật tại SheathyCare:</strong>
                </p>
                <ul>
                  <li>
                    <strong>Đội ngũ chuyên gia hàng đầu:</strong> gồm các bác sĩ
                    chuyên khoa Sản – Phụ khoa, Nam khoa, Da liễu, Thận – Tiết
                    niệu… giàu kinh nghiệm và tận tâm.
                  </li>
                  <li>
                    <strong>Công nghệ tiên tiến, tiện lợi:</strong> chẩn đoán
                    hình ảnh hiện đại, kết quả trả online, nhắc nhở chu kỳ sinh
                    sản.
                  </li>
                  <li>
                    <strong>Dịch vụ chuyên biệt:</strong> tư vấn sức khỏe giới
                    tính, xét nghiệm & điều trị STIs, gói khám sức khỏe định kỳ.
                  </li>
                </ul>

                <p>
                  <strong>Chuyên khoa hỗ trợ:</strong> Sản – Phụ khoa, Nam khoa,
                  Nội – Ngoại tổng quát, Da liễu, Thận – Tiết niệu, Cơ – Xương –
                  Khớp, Nội thần kinh, Tai – Mũi – Họng.
                </p>

                <p>
                  <strong>Cơ sở vật chất – Trang thiết bị:</strong> phòng xét
                  nghiệm hiện đại, máy siêu âm màu, MRI, CT Scan, phòng tư vấn
                  riêng tư, bảo mật.
                </p>

                <p>
                  <strong>Tích hợp trong phần mềm SheathyCare:</strong>
                </p>
                <ul>
                  <li>Giao diện trực quan, dễ sử dụng</li>
                  <li>Tư vấn viên quản lý lịch hẹn & hồ sơ người dùng</li>
                  <li>Người dùng đặt lịch, nhận nhắc nhở tự động</li>
                  <li>Tích hợp AI hỗ trợ đánh giá nguy cơ STIs</li>
                  <li>Phản hồi – đánh giá minh bạch sau mỗi dịch vụ</li>
                </ul>
              </div>
            </div>

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

          {/* Right Column: Booking Form */}
          <div className="right-column">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDangKi;
