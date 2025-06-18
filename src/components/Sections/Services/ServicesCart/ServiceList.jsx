import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceList.css";

const ServiceList = () => {
  const [services, setServices] = useState([]);

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

  return (
    <div className="service-list-wrapper">
      {services.map((service) => {
        const isCombo = service.isCombo === true;
        const discount = service.discountPercent || 0;
        let totalPrice = service.price || 0;

        if (isCombo && Array.isArray(service.subServices)) {
          totalPrice = service.subServices.reduce(
            (sum, s) => sum + (s.price || 0),
            0
          );
        }

        const finalPrice = totalPrice * (1 - discount);

        return (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>

            {isCombo && (
              <>
                <p>
                  <strong>Combo gồm:</strong>
                </p>
                <ul>
                  {service.subServices?.map((s) => (
                    <li key={s.id}>
                      {s.name} – {s.price?.toLocaleString()} đ
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p>
              <strong>Giá sau giảm:</strong>{" "}
              <span className="price-highlight">
                {finalPrice?.toLocaleString()} đ
              </span>
            </p>

            <button className="booking-button">Đặt Lịch Hẹn</button>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceList;
