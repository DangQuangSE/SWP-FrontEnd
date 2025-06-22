import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";
import callIcon from "../../../assets/images/call-svgrepo-com.svg";
import bloodTestIcon from "../../../assets/images/blood-test-svgrepo-com.svg";
import menstruationIcon from "../../../assets/images/menstruation-cycle.svg";

const Services = () => {
  const navigate = useNavigate();

  const handleCycleTrackerClick = () => {
    navigate("/CycleTracker");
  };

  return (
    <section className="home-services">
      <div className="container">
        <h2 className="home-section-title">DỊCH VỤ CỦA CHÚNG TÔI</h2>
        <p className="home-section-subtitle">
          Các dịch vụ được thiết kế chuyên biệt để đáp ứng nhu cầu chăm sóc sức
          khỏe giới tính một cách riêng tư, an toàn và chuyên nghiệp.
        </p>
        <div className="home-services-grid">
          <div className="home-service-card">
            <div className="home-service-header">
              <div
                className="home-service-icon"
                style={{ background: "#FF5A7D" }}
              >
                <img src={callIcon} alt="docter-svg" />
              </div>
              <h3>Tư vấn trực tuyến</h3>
            </div>
            <p>
              Chúng tôi cung cấp dịch vụ tư vấn sức khỏe tổng quát với các bác
              sĩ chuyên khoa
            </p>
            <ul>
              <li>Đặt lịch nhanh chóng</li>
              <li>Gặp chuyên gia theo yêu cầu</li>
              <li>Phù hợp mọi độ tuổi & giới</li>
            </ul>
            <button className="home-service-button">Learn More</button>
          </div>

          <div className="home-service-card">
            <div className="home-service-header">
              <div
                className="home-service-icon"
                style={{ background: "#A855F7" }}
              >
                <img src={bloodTestIcon} alt="blood-test" />
              </div>
              <h3>Xét nghiệm STIs</h3>
            </div>
            <p>
              Chúng tôi cung cấp dịch vụ tư vấn và điều trị các bệnh lây truyền
              qua đường tình dục
            </p>
            <ul>
              <li>Kết quả nhanh 24–48h</li>
              <li>Bảo mật tuyệt đối</li>
              <li>Lập kế hoạch điều trị</li>
            </ul>
            <button className="home-service-button">Learn More</button>
          </div>

          <div className="home-service-card">
            <div className="home-service-header">
              <div
                className="home-service-icon"
                style={{ background: "#3B82F6" }}
              >
                <img src={menstruationIcon} alt="menstruation-cycle" />
              </div>
              <h3>Theo dõi chu kì kinh nguyệt</h3>
            </div>
            <p>
              Chúng tôi cung cấp dịch vụ tham vấn tâm lý cho các vấn đề liên
              quan đến sức khỏe tâm thần
            </p>
            <ul>
              <li>Dự đoán rụng trứng</li>
              <li>Thông báo kỳ kinh</li>
              <li>Nhắc nhở & hỗ trợ chuyên sâu</li>
            </ul>
            <button
              className="home-service-button"
              onClick={handleCycleTrackerClick}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
