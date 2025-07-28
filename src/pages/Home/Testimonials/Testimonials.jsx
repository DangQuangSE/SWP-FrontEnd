import React, { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import api from "../../../configs/api";
import doctor1 from "../../../assets/images/doctor1.jpg";
import "./Testimonials.css";

const Testimonials = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch consultants from API
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const response = await api.get("/consultants");
        console.log("Consultants data:", response.data);
        setConsultants(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
        message.error("Không thể tải danh sách bác sĩ");
        setConsultants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  // Handle consultation booking
  const handleConsultation = (consultant) => {
    // Store consultant info in localStorage
    // localStorage.setItem("selectedConsultantId", consultant.id);

    // Navigate to services page and scroll to top
    navigate("/services");
    window.scrollTo(0, 0);
    // message.success(
    //   `Đã chọn bác sĩ ${consultant.fullname}. Vui lòng chọn dịch vụ để đặt lịch.`
    // );
  };

  if (loading) {
    return (
      <section className="doctors-section section">
        <div className="container">
          <h3 className="section-title">ĐỘI NGŨ BÁC SĨ</h3>
          <p className="section-subtitle-description">
            Đang tải danh sách bác sĩ...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="doctors-section section">
      <div className="container">
        <h3 className="section-title">ĐỘI NGŨ BÁC SĨ</h3>
        <p className="section-subtitle-description">
          Đội ngũ bác sĩ chuyên khoa của chúng tôi luôn sẵn sàng hỗ trợ bạn chăm
          sóc sức khỏe.
        </p>

        {consultants.length > 0 ? (
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
            {consultants.map((consultant) => (
              <SplideSlide key={consultant.id}>
                <div className="doctor-card">
                  <div className="doctor-avatar">
                    <img
                      src={consultant.imageUrl || consultant.img || doctor1}
                      alt={consultant.fullname || "Bác sĩ"}
                    />
                  </div>
                  <div className="doctor-stats">
                    <div className="rating-section">
                      <span className="rating-display">
                        ⭐ {consultant.rating?.toFixed(1) || "0.0"}/5
                      </span>
                    </div>
                    <div className="views-section"></div>
                  </div>
                  <div className="doctor-info">
                    <h3 className="doctor-name">
                      {consultant.fullname || "Chưa có tên"}
                    </h3>
                    <p className="doctor-title">
                      {consultant.specializationNames || "Chưa có chuyên khoa"}
                    </p>
                    <div className="doctor-details">
                      {/* <div className="contact">
                        <span>�</span>
                        {consultant.email || "Chưa có email"}
                      </div> */}
                      <div className="specialist-badge">
                        <span> Trung Tâm Chăm sóc Sức khỏe Giới Tính</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="consult-btn"
                    onClick={() => handleConsultation(consultant)}
                  >
                    Xem dịch vụ
                  </button>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        ) : (
          <div className="no-consultants">
            <p>Hiện tại chưa có bác sĩ nào trong hệ thống.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
