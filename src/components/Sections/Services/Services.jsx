import React from "react";
import "./Services.css";
const Services = () => (
  <section className="services">
    <div className="container">
      <h2 className="section-title gradient-text">DỊCH VỤ CỦA CHÚNG TÔI</h2>
      <p className="section-subtitle">
        Các dịch vụ được thiết kế chuyên biệt để đáp ứng nhu cầu chăm sóc sức
        khỏe giới tính một cách riêng tư, an toàn và chuyên nghiệp.
      </p>
      <div className="services-grid">
        <div className="service-card">
          <div className="service-header">
            <div className="service-icon" style={{ background: "#FF5A7D" }}>
              <img src="call-svgrepo-com.svg" alt="docter-svg" />
            </div>
            <h3>Tư vấn trực tuyến</h3>
          </div>
          <p>
            Chúng tôi cung cấp dịch vụ tư vấn sức khỏe tổng quát với các bác sĩ
            chuyên khoa
          </p>
          <ul>
            <li>Đặt lịch nhanh chóng</li>
            <li>Gặp chuyên gia theo yêu cầu</li>
            <li>Phù hợp mọi độ tuổi & giới</li>
          </ul>
          <button className="service-button">Learn More</button>
        </div>

        <div className="service-card">
          <div className="service-header">
            <div className="service-icon" style={{ background: "#A855F7" }}>
              {" "}
              <img src="blood-test-svgrepo-com.svg" alt="" />
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
          <button className="service-button">Learn More</button>
        </div>

        <div className="service-card">
          <div className="service-header">
            <div className="service-icon" style={{ background: "#3B82F6" }}>
              <img src="menstruation-cycle.svg" alt="" />
            </div>
            <h3>Theo dõi chu kì kinh nguyệt</h3>
          </div>
          <p>
            Chúng tôi cung cấp dịch vụ tham vấn tâm lý cho các vấn đề liên quan
            đến sức khỏe tâm thần
          </p>
          <ul>
            <li>Dự đoán rụng trứng</li>
            <li>Thông báo kỳ kinh</li>
            <li>Nhắc nhở & hỗ trợ chuyên sâu</li>
          </ul>
          <button className="service-button">Learn More</button>
        </div>
      </div>
    </div>
  </section>
);

export default Services;
