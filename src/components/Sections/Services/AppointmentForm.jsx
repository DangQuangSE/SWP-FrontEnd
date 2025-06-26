import React, { useState } from "react";
import "./AppointmentForm.css";
import BookingForm from "./BookingForm";
import { Link } from "react-router-dom";
import ServiceList from "../../Sections/Services/ServicesCart/ServiceList";
import DoctorList from "./DoctorList/DoctorList";
import FeedbackList from "./FeedBack/FeedbackList";
const AppointmentForm = () => {
  const [activeTab, setActiveTab] = useState("intro");
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
        <div className="container-layout">
          <div className="hospital-hero">
            {/* hero section */}
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
                    Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP.
                    Thủ Đức, TP. Hồ Chí Minh
                  </span>
                </div>
                <div className="hospital-actions">
                  <a href="#" className="action-link">
                    <span className="icon"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-nav-tabs">
            <div className="nav-tabs">
              <span
                className={`nav-tab ${activeTab === "intro" ? "active" : ""}`}
                onClick={() => setActiveTab("intro")}
              >
                Thông tin chung
              </span>
              <span
                className={`nav-tab ${
                  activeTab === "services" ? "active" : ""
                }`}
                onClick={() => setActiveTab("services")}
              >
                Dịch vụ
              </span>
              <span
                className={`nav-tab ${activeTab === "doctors" ? "active" : ""}`}
                onClick={() => setActiveTab("doctors")}
              >
                Bác sĩ
              </span>
              <span
                className={`nav-tab ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Đánh giá
              </span>
            </div>
          </div>

          <div className="main-content">
            <div className="left-column">
              {activeTab === "intro" && (
                <>
                  {/* content-section: Thông tin chung, Giờ làm việc, FAQ */}
                  <div className="content-section">
                    <h2 className="section-title-appointment">
                      {/* <span className="icon"></span> */}
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
                  <div className="content-section">
                    <h2 className="section-title-appointment">
                      <span>Giới thiệu chung</span>
                    </h2>
                    <div className="about-text">
                      <p>
                        <strong>SheathyCare</strong> là cơ sở chăm sóc sức khỏe
                        tiên phong trong việc kết hợp giữa{" "}
                        <strong>chuyên môn y tế</strong>,{" "}
                        <strong>công nghệ hiện đại</strong> và{" "}
                        <strong>dịch vụ thân thiện</strong>, nhằm hướng đến chăm
                        sóc toàn diện sức khỏe giới tính và sinh sản cho cộng
                        đồng.
                      </p>

                      <p>
                        Chúng tôi cung cấp một hệ sinh thái y tế thông minh, cho
                        phép người dùng dễ dàng:
                      </p>
                      <ul>
                        <li>Theo dõi chu kỳ sinh sản cá nhân</li>
                        <li>Đặt lịch tư vấn với chuyên gia y tế</li>
                        <li>
                          Thực hiện xét nghiệm các bệnh lây truyền qua đường
                          tình dục (STIs)
                        </li>
                        <li>
                          Nhận lời khuyên y tế cá nhân hóa, phù hợp từng trường
                          hợp
                        </li>
                        <li>
                          Quản lý hồ sơ sức khỏe riêng tư, an toàn và bảo mật
                        </li>
                      </ul>

                      <p>
                        <strong>Điểm nổi bật tại SheathyCare:</strong>
                      </p>
                      <ul>
                        <li>
                          <strong>Đội ngũ chuyên gia hàng đầu:</strong> Gồm các
                          bác sĩ chuyên khoa Sản – Phụ khoa, Nam khoa, Da liễu,
                          Thận – Tiết niệu,… có chuyên môn cao, được đào tạo bài
                          bản, tận tâm.
                        </li>
                        <li>
                          <strong>Công nghệ tiên tiến – tiện lợi:</strong>
                          <ul>
                            <li>
                              Trang thiết bị chẩn đoán hình ảnh và xét nghiệm
                              hiện đại
                            </li>
                            <li>
                              Hệ thống trả kết quả và quản lý lịch khám trực
                              tuyến
                            </li>
                            <li>
                              Nhắc nhở chu kỳ sinh sản, lịch uống thuốc tránh
                              thai, và dự báo khả năng thụ thai
                            </li>
                          </ul>
                        </li>
                        <li>
                          <strong>Dịch vụ chuyên biệt:</strong>
                          <ul>
                            <li>Tư vấn sức khỏe giới tính và sinh sản</li>
                            <li>Xét nghiệm – điều trị các bệnh STIs</li>
                            <li>
                              Gói khám sức khỏe định kỳ cho cá nhân, doanh
                              nghiệp và chuyên gia nước ngoài
                            </li>
                          </ul>
                        </li>
                      </ul>

                      <p>
                        <strong>Chuyên khoa hỗ trợ tại SheathyCare:</strong>
                      </p>
                      <ul>
                        <li>Sản – Phụ khoa</li>
                        <li>Nam khoa</li>
                        <li>Nội – Ngoại tổng quát</li>
                        <li>Da liễu</li>
                        <li>Thận – Tiết niệu</li>
                        <li>Cơ – Xương – Khớp</li>
                        <li>Nội thần kinh</li>
                        <li>Tai – Mũi – Họng</li>
                      </ul>

                      <p>
                        <strong>Cơ sở vật chất – Trang thiết bị:</strong>
                      </p>
                      <ul>
                        <li>Phòng xét nghiệm hiện đại đạt chuẩn quốc tế</li>
                        <li>Máy siêu âm màu thế hệ mới</li>
                        <li>Hệ thống MRI – CT Scan tiên tiến</li>
                        <li>
                          Kỹ thuật chẩn đoán và điều trị STIs công nghệ cao
                        </li>
                        <li>Không gian tư vấn riêng tư, bảo mật tuyệt đối</li>
                      </ul>

                      <p>
                        <strong>Tích hợp trong phần mềm SheathyCare:</strong>
                      </p>
                      <ul>
                        <li>Giao diện trực quan, dễ sử dụng</li>
                        <li>
                          Tư vấn viên quản lý lịch hẹn và hồ sơ người dùng
                        </li>
                        <li>Người dùng đặt lịch, nhận nhắc nhở tự động</li>
                        <li>
                          Tích hợp AI hỗ trợ đánh giá nguy cơ STIs dựa trên tiền
                          sử
                        </li>
                        <li>Phản hồi – đánh giá minh bạch sau mỗi dịch vụ</li>
                      </ul>
                    </div>
                  </div>

                  <div className="content-section">
                    <h2 className="section-title-appointment">
                      <span className="icon"></span>
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
                              Thông tin chi tiết về câu hỏi này sẽ được hiển thị
                              ở đây.
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {activeTab === "services" && (
                <div className="content-section">
                  <ServiceList />
                </div>
              )}
              {activeTab === "doctors" && (
                <div className="content-section">
                  <h2 className="section-title-appointment">
                    <span>Danh sách bác sĩ</span>
                  </h2>
                  <DoctorList />
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="content-section">
                  <h2 className="section-title-appointment">
                    <span>Đánh giá từ khách hàng</span>
                  </h2>
                  <FeedbackList />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
