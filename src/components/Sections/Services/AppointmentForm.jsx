import React, { useState } from "react";
import "./AppointmentForm.css";
import BookingForm from "./BookingForm";
import { Link } from "react-router-dom";

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
            <Link
              to="./DoctorList"
              className={`nav-tab ${
                location.pathname === "/doctors" ? "active" : ""
              }`}
            >
              Bác sĩ (30)
            </Link>
            <span className="nav-tab">Đánh giá (4)</span>
          </div>
        </div>
        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
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
