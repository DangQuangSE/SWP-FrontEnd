"use client"

import { useState } from "react"
import "./StisTest.css"

const StisTest = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState(null)
  const [activeTab, setActiveTab] = useState("DỊCH VỤ")

  const services = [
    {
      id: 1,
      name: "Gói Xét Nghiệm Viêm Gan",
      provider: "Trung Tâm Nội Soi Tiêu Hóa Doctor Check",
      address: "429 Tô Hiến Thành, Phường 14, Quận 10, Thành phố Hồ Chí Minh",
      schedule: "Thứ 2,3,4,5,6,7,Chủ nhật",
      price: 670000,
    },
    {
      id: 2,
      name: "Gói Xét Nghiệm Đầu Ấn Ung Thư",
      provider: "Trung Tâm Nội Soi Tiêu Hóa Doctor Check",
      address: "429 Tô Hiến Thành, Phường 14, Quận 10, Thành phố Hồ Chí Minh",
      schedule: "Thứ 2,3,4,5,6,7,Chủ nhật",
      price: 720000,
    },
    {
      id: 3,
      name: "Tiểu chuẩn (Trả kết quả trong vòng 25-30 ngày)",
      provider: "Trung tâm xét nghiệm ADN NOVAGEN - Hà Nội",
      address: "Số 1 Trần Thủ Độ, Phường Phúc Diễn, Quận Bắc Từ Liêm, Thành phố Hà Nội",
      schedule: "Thứ 2,3,4,5,6,7",
      price: 12000000,
    },
    {
      id: 4,
      name: "Gói Tầm Soát Tim Mạch",
      provider: "Bệnh Viện Đa Khoa Tâm Anh",
      address: "108 Hoàng Như Tiếp, Phường Bồ Đề, Quận Long Biên, Hà Nội",
      schedule: "Thứ 2,3,4,5,6,7",
      price: 1500000,
    },
    {
      id: 5,
      name: "Gói Khám Sức Khỏe Tổng Quát",
      provider: "Phòng Khám Đa Khoa Quốc Tế",
      address: "123 Nguyễn Văn Cừ, Quận 1, TP.HCM",
      schedule: "Thứ 2,3,4,5,6",
      price: 2200000,
    },
  ]

  const relatedServices = [
    {
      id: 1,
      name: "Gói xét nghiệm đầu ấn ung thư",
      description: "Tầm soát ung thư toàn diện",
      price: "2.150.000đ",
      icon: "🤲",
    },
    {
      id: 2,
      name: "Tầm soát viêm gan B",
      description: "Xét nghiệm HBsAg",
      price: "450.000đ",
      icon: "💉",
    },
    {
      id: 3,
      name: "Tầm soát ung thư đại trực tràng",
      description: "Nội soi đại tràng",
      price: "1.200.000đ",
      icon: "🏥",
    },
  ]

  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatPrice = (price) => {
    return price.toLocaleString() + "đ"
  }

  const openServiceDetail = (service) => {
    setSelectedService(service)
    document.body.style.overflow = "hidden"
  }

  const closeServiceDetail = () => {
    setSelectedService(null)
    document.body.style.overflow = "auto"
  }

  return (
    <div className="medro-app">
      {/* Hero Banner */}
      <div className="medro-hero-banner">
        <div className="medro-hero-content">
          <div className="medro-hero-text">
            <h1 className="medro-hero-title">ĐẶT LỊCH XÉT NGHIỆM</h1>
            <ul className="medro-benefits-list">
              <li className="medro-benefit-item">Đặt lịch xét nghiệm trực tuyến, không cần khám trước</li>
              <li className="medro-benefit-item">Giảm thiểu thời gian chờ đợi</li>
              <li className="medro-benefit-item">Được hoan nghênh hiệu quả phòng</li>
              <li className="medro-benefit-item">
                Được hướng dẫn tích hợp hoàn tất thủ tục đặt lịch trên medpro (đối với các trung tâm có áp dụng)
              </li>
              <li className="medro-benefit-item">Linh hoạt lựa chọn xét nghiệm tại cơ sở khác tại nhà</li>
            </ul>
            <div className="medro-contact-info">
              <span className="medro-contact-text">Liên hệ chuyên gia để tư vấn thêm</span>
              <span className="medro-phone">📞 19002115</span>
              <span className="medro-or-text">hoặc</span>
              <button className="medro-chat-btn">Chat ngay</button>
            </div>
          </div>
          <div className="medro-hero-image">
            <div className="medro-medical-illustration">🏥👩‍⚕️🔬</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="medro-search-section">
        <div className="medro-search-container">
          <div className="medro-search-input-group">
            <div className="medro-search-input-wrapper">
              <span className="medro-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="medro-search-input"
              />
            </div>
            <div className="medro-location-select-wrapper">
              <span className="medro-location-icon">📍</span>
              <select className="medro-location-select">
                <option>Tất cả địa điểm</option>
                <option>Hồ Chí Minh</option>
                <option>Hà Nội</option>
                <option>Đà Nẵng</option>
              </select>
            </div>
          </div>
          <div className="medro-tab-buttons">
            <button
              className={`medro-tab-btn ${activeTab === "DỊCH VỤ" ? "medro-tab-active" : ""}`}
              onClick={() => setActiveTab("DỊCH VỤ")}
            >
              DỊCH VỤ
            </button>
            <button
              className={`medro-tab-btn ${activeTab === "CƠ SỞ Y TẾ" ? "medro-tab-active" : ""}`}
              onClick={() => setActiveTab("CƠ SỞ Y TẾ")}
            >
              CƠ SỞ Y TẾ
            </button>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="medro-services-container">
        {filteredServices.map((service) => (
          <div key={service.id} className="medro-service-card">
            <div className="medro-service-icon">🧪</div>
            <div className="medro-service-content">
              <h3 className="medro-service-title">{service.name}</h3>
              <div className="medro-provider-info">
                <span className="medro-building-icon">🏢</span>
                <span className="medro-provider-name">{service.provider}</span>
                <span className="medro-verified-icon">✓</span>
              </div>
              <div className="medro-service-price">Giá: {formatPrice(service.price)}</div>
            </div>
            <div className="medro-service-actions">
              <button className="medro-btn-outline" onClick={() => openServiceDetail(service)}>
                Xem chi tiết
              </button>
              <button className="medro-btn-primary">Đặt khám ngay</button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="medro-modal-overlay" onClick={closeServiceDetail}>
          <div className="medro-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="medro-modal-header">
              <h2 className="medro-modal-title">{selectedService.name}</h2>
              <button className="medro-close-btn" onClick={closeServiceDetail}>
                ×
              </button>
            </div>

            <div className="medro-modal-body">
              {/* Service Header */}
              <div className="medro-service-header-card">
                <div className="medro-provider-card">
                  <div className="medro-provider-icon">🏥</div>
                  <div className="medro-provider-details">
                    <h3 className="medro-provider-title">
                      {selectedService.provider} <span className="medro-verified">✓</span>
                    </h3>
                    <p className="medro-provider-address">{selectedService.address}</p>
                    <p className="medro-provider-schedule">🕒 Lịch khám: {selectedService.schedule}</p>
                  </div>
                  <div className="medro-price-section">
                    <div className="medro-price">{formatPrice(selectedService.price)}</div>
                    <button className="medro-book-btn">Đặt khám ngay</button>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="medro-service-details">
                <div className="medro-detail-section">
                  <p className="medro-detail-title">1. Tên gói khám: Xét Nghiệm Viêm Gan</p>
                  <p className="medro-detail-item">Trị giá gói khám: 670.000VNĐ</p>

                  <p className="medro-detail-title">2. Lợi ích gói "Xét Nghiệm Viêm Gan" là gì?</p>
                  <ul className="medro-detail-list">
                    <li className="medro-detail-list-item">
                      Phát hiện sớm tổn thương ở Gan, để ngăn ngừa các biến chứng ảnh hưởng tới Gan.
                    </li>
                    <li className="medro-detail-list-item">Tầm soát các bệnh lý viêm gan B, viêm gan C.</li>
                  </ul>

                  <p className="medro-detail-title">
                    3. Quy trình thực hiện gói khám "Xét Nghiệm Viêm Gan" gồm những bước nào?
                  </p>
                  <ul className="medro-detail-list">
                    <li className="medro-detail-list-item">
                      Bước 1: Đặt lịch khám ưu tiên qua Medpro để được khám nhanh, không chờ đợi.
                    </li>
                    <li className="medro-detail-list-item">
                      Bước 2: Tới trực tiếp Trung Tâm Nội Soi Tiêu Hóa Doctor Check và được phục vụ chu đáo.
                    </li>
                  </ul>

                  <p className="medro-detail-title">4. Các dịch vụ có trong gói khám là gì?</p>
                  <ul className="medro-detail-list">
                    <li className="medro-detail-list-item">
                      Xét Nghiệm HBsAg Miễn Dịch (Tầm soát bệnh lý viêm gan vi rút B)
                    </li>
                    <li className="medro-detail-list-item">
                      Xét Nghiệm Anti HCV Miễn Dịch (Tầm soát bệnh lý viêm gan vi rút C)
                    </li>
                    <li className="medro-detail-list-item">Xét nghiệm men gan AST, ALT</li>
                    <li className="medro-detail-list-item">Xét nghiệm men Bilirubin toàn phần và trực tiếp</li>
                    <li className="medro-detail-list-item">Xét nghiệm men GGT (Gamma glutamyl transferase)</li>
                    <li className="medro-detail-list-item">Xét nghiệm men Alkaline Phosphatase</li>
                    <li className="medro-detail-list-item">
                      Siêu âm ổ bụng tổng quát để đánh giá cấu trúc gan, mật, tụy
                    </li>
                    <li className="medro-detail-list-item">Tư vấn kết quả và hướng dẫn điều trị (nếu có bất thường)</li>
                  </ul>

                  <div className="medro-medical-image">
                    <div className="medro-image-placeholder">🏥👩‍⚕️🔬📊</div>
                  </div>
                </div>

                {/* Related Services */}
                <div className="medro-related-services">
                  <div className="medro-related-header">
                    <h3 className="medro-related-title">Các gói khám liên quan (10)</h3>
                    <button className="medro-view-all">Xem tất cả</button>
                  </div>
                  <div className="medro-related-grid">
                    {relatedServices.map((related) => (
                      <div key={related.id} className="medro-related-card">
                        <div className="medro-related-icon">{related.icon}</div>
                        <h4 className="medro-related-name">{related.name}</h4>
                        <p className="medro-related-description">{related.description}</p>
                        <p className="medro-related-price">{related.price}</p>
                        <button className="medro-related-btn">Đặt khám ngay</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StisTest
