import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceList.css";

const mockService = {
  id: 999,
  name: "Gói khám Tầm soát Ung thư Vú 01",
  description:
    "Kiểm tra sức khỏe tầm soát ung thư vú với các xét nghiệm chuyên sâu",
  discountPercent: 0.1,
  subServices: [
    { id: 101, name: "Siêu âm vú", price: 300000 },
    { id: 102, name: "Xét nghiệm CA 15-3", price: 600000 },
  ],
};

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("/api/service/comboService")
      .then((res) => {
        console.log("Dữ liệu combo service:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        } else {
          setServices([mockService]); // fallback mock
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải combo service:", err);
        setServices([mockService]); // fallback nếu lỗi API
      });
  }, []);

  return (
    <div className="service-list-wrapper">
      {services.map((combo) => {
        const total = combo.subServices?.reduce(
          (sum, s) => sum + (s.price || 0),
          0
        );
        const discount = combo.discountPercent || 0;
        const finalPrice = total * (1 - discount);

        return (
          <div key={combo.id} className="service-card">
            <h3>{combo.name}</h3>
            <p>{combo.description}</p>

            <ul>
              {combo.subServices?.map((s) => (
                <li key={s.id}>
                  {s.name} – {s.price?.toLocaleString()} đ
                </li>
              ))}
            </ul>

            <p>
              <strong>Giá sau giảm:</strong>{" "}
              <span style={{ color: "green", fontWeight: 600 }}>
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
