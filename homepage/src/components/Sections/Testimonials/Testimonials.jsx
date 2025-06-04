"use client"

import "./Testimonials.css"

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
      avatar: "/placeholder.svg?height=120&width=120",
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
      avatar: "/placeholder.svg?height=120&width=120",
      isSpecialist: true,
    },
  ]

  const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < Math.floor(rating) ? "filled" : ""}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <section className="doctors-section section">
      <div className="container">
        <h2 className="section-title">ĐỘI NGŨ BÁC SĨ</h2>

        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-avatar">
                <img src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
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
                {doctor.title && <p className="doctor-title">{doctor.title}</p>}

                <div className="doctor-details">
                  <div className="specialty">
                    <span className="specialty-icon">🩺</span>
                    <span>{doctor.specialty}</span>
                  </div>
                  <div className="price">
                    <span className="price-icon">💰</span>
                    <span>{doctor.price}</span>
                  </div>
                  {doctor.isSpecialist && (
                    <div className="specialist-badge">
                      <span className="specialist-icon">🏥</span>
                      <span>Bác sĩ Chuyên Khoa</span>
                    </div>
                  )}
                </div>
              </div>

              <button className="consult-btn">Tư vấn ngay</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
