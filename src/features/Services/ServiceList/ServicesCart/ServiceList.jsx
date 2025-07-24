import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ServiceList.css";
import { Button } from "antd";

// Thêm component hiển thị đánh giá sao
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "star filled" : "star"}>
        ★
      </span>
    );
  }
  return <div className="star-rating">{stars}</div>;
};

const TABS = {
  ALL: "Tất cả dịch vụ",
  CONSULTING: "Dịch vụ tư vấn",
  TESTING: "Dịch vụ xét nghiệm",
  COMBO: "Combo ",
};

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [serviceRatings, setServiceRatings] = useState({});
  const navigate = useNavigate();

  // Fetch dịch vụ
  useEffect(() => {
    axios
      .get("/api/services")
      .then((res) => {
        setServices(res.data);
        // Sau khi lấy danh sách dịch vụ, lấy đánh giá cho từng dịch vụ
        res.data.forEach((service) => {
          fetchServiceRating(service.id);
        });
      })
      .catch((err) => {
        console.error("Lỗi khi tải service:", err);
        setServices([]);
      });
  }, []);

  // Hàm lấy đánh giá trung bình cho dịch vụ
  const fetchServiceRating = (serviceId) => {
    axios
      .get(`/api/feedback/average-rating/${serviceId}`)
      .then((res) => {
        setServiceRatings((prev) => ({
          ...prev,
          [serviceId]: {
            averageRating: res.data.averageRating || 0,
            totalRatings: res.data.totalAppointment || 0,
          },
        }));
      })
      .catch((err) => {
        console.error(`Lỗi khi lấy đánh giá cho dịch vụ ${serviceId}:`, err);
      });
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTabServices = () => {
    switch (activeTab) {
      case "CONSULTING":
        return filteredServices.filter(
          (s) =>
            (s.type === "CONSULTING" || s.type === "CONSULTING_ON") &&
            !s.isCombo
        );
      case "TESTING":
        return filteredServices.filter(
          (s) => s.type?.startsWith("TESTING") && !s.isCombo
        );
      case "COMBO":
        return filteredServices.filter((s) => s.isCombo === true);
      default:
        return filteredServices;
    }
  };

  const renderServiceList = (list) => (
    <div className="service-list-wrapper">
      {list.map((service) => {
        const isCombo = service.isCombo === true;
        const discount = service.discountPercent || 0;
        const basePrice = service.price || 0;
        const rating = serviceRatings[service.id] || {
          averageRating: 0,
          totalRatings: 0,
        };

        let originalPrice = basePrice;
        let finalPrice = basePrice;

        if (isCombo && Array.isArray(service.subServices)) {
          originalPrice = service.subServices.reduce(
            (sum, s) => sum + (s.price || 0),
            0
          );
          finalPrice = basePrice;
        } else {
          finalPrice = basePrice * (1 - discount / 100);
        }

        return (
          <div
            key={service.id}
            className={`service-card ${isCombo ? "combo" : ""}`}
          >
            <div className="service-card-content">
              <div className="left-info">
                <div className="service-name-container">
                  <h3 className="service-name">{service.name}</h3>
                  {service.type === "CONSULTING_ON" && (
                    <h2 className="online-tag">trực tuyến</h2>
                  )}
                </div>
                <p className="desc">{service.description}</p>
                <div className="price-block">
                  {discount > 0 ? (
                    <>
                      <p>
                        <span>Giá gốc:</span>{" "}
                        <span className="original-price">
                          {originalPrice.toLocaleString()} đ
                        </span>
                      </p>
                      <p>
                        <strong>Giá sau giảm:</strong>{" "}
                        <span className="price-highlight">
                          {finalPrice.toLocaleString()} đ
                        </span>
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>Giá:</strong>{" "}
                      <span className="price-highlight">
                        {finalPrice.toLocaleString()} đ
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="right-action">
                <Button
                  className="booking-button"
                  onClick={() => navigate(`/service-detail/${service.id}`)}
                >
                  <span>Đặt Lịch Hẹn</span>
                </Button>
                <div className="service-rating">
                  <StarRating rating={rating.averageRating} />
                  <span className="rating-text">
                    {rating.averageRating.toFixed(1)} ({rating.totalRatings}{" "}
                    đánh giá)
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="service-page-container">
      <div className="service-search-box">
        <input
          type="text"
          placeholder=" Tìm kiếm dịch vụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="service-tab-buttons">
        {Object.entries(TABS).map(([key, label]) => (
          <button
            key={key}
            className={`service-tab-button ${
              activeTab === key ? "active" : ""
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {renderServiceList(getTabServices())}
    </div>
  );
};

export default ServiceList;
