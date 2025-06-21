import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ServiceList.css";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/service")
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải service:", err);
        setServices([]);
      });
  }, []);

  const consultingServices = services.filter(
    (s) => s.type === "CONSULTING" && !s.isCombo
  );
  const testingServices = services.filter(
    (s) => s.type?.startsWith("TESTING") && !s.isCombo
  );
  const comboServices = services.filter((s) => s.isCombo === true);

  const renderServiceList = (list, layout = "grid") => (
    <div
      className={`service-list-wrapper ${
        layout === "vertical" ? "vertical" : ""
      }`}
    >
      {list.map((service) => {
        const isCombo = service.isCombo === true;
        const discount = service.discountPercent || 0;
        const basePrice = service.price || 0;

        let originalPrice = basePrice;
        let finalPrice = basePrice;

        if (isCombo && Array.isArray(service.subServices)) {
          originalPrice = service.subServices.reduce(
            (sum, s) => sum + (s.price || 0),
            0
          );
          finalPrice = basePrice; // đã được backend giảm giá sẵn
        } else {
          finalPrice = basePrice * (1 - discount / 100);
        }

        return (
          <div
            key={service.id}
            className={`service-card ${isCombo ? "combo" : ""}`}
          >
            <div className="service-info">
              <h3>{service.name}</h3>
              <p className="desc">{service.description}</p>

              {isCombo && (
                <>
                  {/* <p>
                    <strong>Combo gồm:</strong>
                  </p> */}
                  <ul>
                    {service.subServices?.map((s) => (
                      <li key={s.id}>
                        {s.name} – {s.price?.toLocaleString()} đ
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="price-block">
                <p>
                  <strong>Giá gốc:</strong>{" "}
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
              </div>
            </div>

            <button
              className="booking-button"
              onClick={() => navigate(`/service-detail/${service.id}`)}
            >
              Đặt Lịch Hẹn
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Dịch vụ tư vấn */}
      {consultingServices.length > 0 && (
        <div className="service-subsection">
          <h3 className="section-title">🧑‍⚕️ Dịch vụ tư vấn</h3>
          {renderServiceList(consultingServices, "grid")}
        </div>
      )}

      {/* Dịch vụ xét nghiệm */}
      {testingServices.length > 0 && (
        <div className="service-subsection">
          <h3 className="section-title">🧪 Dịch vụ xét nghiệm</h3>
          {renderServiceList(testingServices, "vertical")}
        </div>
      )}

      {/* Combo dịch vụ */}
      {comboServices.length > 0 && (
        <div className="service-subsection">
          <h3 className="section-title">📦 Combo dịch vụ</h3>
          {renderServiceList(comboServices, "grid")}
        </div>
      )}
    </>
  );
};

export default ServiceList;
