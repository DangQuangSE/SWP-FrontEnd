import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceList.css";

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("/api/service/comboService")
      .then((res) => {
        console.log("Dữ liệu combo service:", res.data);
        setServices(res.data);
      })
      .catch((err) => console.error("Lỗi khi tải combo service:", err));
  }, []);

  return (
    <div className="service-list-wrapper">
      {Array.isArray(services) && services.length > 0 ? (
        services.map((combo) => (
          <div key={combo.id} className="service-card">
            <h3>{combo.name}</h3>
            <p>{combo.description}</p>
            <ul>
              {combo.subServices?.map((s) => (
                <li key={s.id}>
                  {s.name} - {s.price?.toLocaleString()} đ
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Không có dịch vụ nào để hiển thị</p>
      )}
    </div>
  );
};

export default ServiceList;
