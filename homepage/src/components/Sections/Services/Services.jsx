import React from "react";
import "./Services.css";

const Services = () => {
  const services = [
    {
      title: "Tư vấn trực tuyến",
      description:
        "Chúng tôi cung cấp dịch vụ tư vấn sức khỏe tổng quát với các bác sĩ chuyên khoa",
      color: "ff5a7d",
    },
    {
      title: "Xét nghiệm STIs",
      description:
        "Chúng tôi cung cấp dịch vụ tư vấn và điều trị các bệnh lây truyền qua đường tình dục",
      color: "#8a4ebd",
    },
    {
      title: "Theo dõi chu kì kinh nguyệt",
      description:
        "Chúng tôi cung cấp dịch vụ tham vấn tâm lý cho các vấn đề liên quan đến sức khỏe tâm thần",
      color: "#3870ff",
    },
  ];

  return (
    <section className="services section">
      <div className="container">
        <h2 className="section-title">DỊCH VỤ CỦA CHÚNG TÔI</h2>

        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card"
              style={{
                background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
              }}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
