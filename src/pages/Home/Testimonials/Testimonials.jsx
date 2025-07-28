import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import doctor1 from "../../../assets/images/doctor1.jpg";
import "./Testimonials.css";

const Testimonials = () => {
  const doctors = [
    {
      id: 1,
      name: "Ths BS. Trần Thị Oanh",
      title: "BV Hùng Việt",
      specialty: "Sản khoa",
      rating: 4.3,
      views: 38,
      price: "150.000đ",
      avatar: "/placeholder.svg?height=120&width=120",
      isSpecialist: true,
    },
    {
      id: 2,
      name: "BS CKI. Lê Ngọc Hồng Hạnh",
      title: "Bv...",
      specialty: "Nhi - Thận kinh",
      rating: 4.2,
      views: 118,
      price: "200.000đ",
      isSpecialist: true,
    },
    {
      id: 3,
      name: "BS CKI. Nguyễn Phúc Thiện",
      title: "",
      specialty: "Nội tim mạch",
      rating: 4.9,
      views: 143,
      price: "0đ - 300.000đ",
      isSpecialist: true,
    },
    {
      id: 4,
      name: "BS CKI. Nguyễn Văn A",
      title: "Bệnh viện ABC",
      specialty: "Nội tiết",
      rating: 4.7,
      views: 120,
      price: "250.000đ",
      isSpecialist: true,
    },
    {
      id: 5,
      name: "BS CKII. Trần Văn B",
      title: "Bệnh viện XYZ",
      specialty: "Tai Mũi Họng",
      rating: 4.8,
      views: 98,
      price: "300.000đ",
      isSpecialist: true,
    },
  ];

  const renderStars = (rating) => (
    <div className="rating-stars">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`star ${i < Math.floor(rating) ? "filled" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <section className="doctors-section section">
      <div className="container">
        <h3 className="section-title">ĐỘI NGŨ BÁC SĨ</h3>
        <p className="section-subtitle-description">
          Đội ngũ bác sĩ chuyên khoa của chúng tôi luôn sẵn sàng hỗ trợ bạn chăm
          sóc sức khỏe.
        </p>

        <Splide
          options={{
            type: "loop",
            gap: "1rem",
            perPage: 3,
            pagination: false,
            arrows: false,
            autoScroll: {
              speed: 1,
              pauseOnHover: true,
              pauseOnFocus: false,
            },
            breakpoints: {
              1024: { perPage: 2 },
              640: { perPage: 1 },
            },
          }}
          extensions={{ AutoScroll }}
          aria-label="Carousel bác sĩ"
        >
          {doctors.map((doctor) => (
            <SplideSlide key={doctor.id}>
              <div className="doctor-card">
                <div className="doctor-avatar">
                  <img src={doctor1} alt={doctor.name} />
                </div>
                <div className="doctor-stats">
                  <div className="rating-section">
                    <span className="rating-label">Đánh giá:</span>
                    <span className="rating-value">{doctor.rating}</span>
                    {renderStars(doctor.rating)}
                  </div>
                  <div className="views-section">
                    <span className="views-label">Lượt khám:</span>
                    <span className="views-value">{doctor.views}</span>
                    <span className="views-icon">👥</span>
                  </div>
                </div>
                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  {doctor.title && (
                    <p className="doctor-title">{doctor.title}</p>
                  )}
                  <div className="doctor-details">
                    <div className="specialty">
                      <span>🩺</span>
                      {doctor.specialty}
                    </div>
                    <div className="price">
                      <span>💰</span>
                      {doctor.price}
                    </div>
                    {doctor.isSpecialist && (
                      <div className="specialist-badge">
                        <span></span>Bác sĩ Chuyên Khoa
                      </div>
                    )}
                  </div>
                </div>
                <button className="consult-btn">Tư vấn ngay</button>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
};

export default Testimonials;
