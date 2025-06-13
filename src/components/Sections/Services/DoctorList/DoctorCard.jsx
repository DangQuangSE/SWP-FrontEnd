import React from "react";
import "./DoctorCard.css";
import {
  FaUserMd,
  FaBriefcaseMedical,
  FaMapMarkerAlt,
  FaStar,
  FaRegCalendarCheck,
} from "react-icons/fa";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-card-image-wrapper">
        <img
          src={doctor.image || "/images/doctor_placeholder.jpg"}
          alt={doctor.name}
          className="doctor-image"
        />
      </div>

      <div className="doctor-card-content">
        <h3 className="doctor-name">{doctor.name}</h3>

        {doctor.rating && (
          <div className="doctor-rating">
            {[...Array(Math.floor(doctor.rating))].map((_, i) => (
              <FaStar key={`full-${i}`} className="star-icon filled" />
            ))}
            {[...Array(5 - Math.ceil(doctor.rating))].map((_, i) => (
              <FaStar key={`empty-${i}`} className="star-icon empty" />
            ))}
            <span className="rating-text">{doctor.rating} / 5</span>
          </div>
        )}

        <div className="doctor-details">
          {doctor.experience && (
            <p className="doctor-detail-item">
              <FaUserMd className="detail-icon" /> {doctor.experience}
            </p>
          )}
          {doctor.specialties && (
            <p className="doctor-detail-item">
              <FaBriefcaseMedical className="detail-icon" />{" "}
              {doctor.specialties.join(", ")}
            </p>
          )}
          {doctor.workplace && (
            <p className="doctor-detail-item">
              <FaMapMarkerAlt className="detail-icon" /> {doctor.workplace}
            </p>
          )}
        </div>
      </div>

      <div className="doctor-card-action">
        <button className="btn-register">
          <FaRegCalendarCheck style={{ marginRight: "8px" }} />
          Đăng ký khám
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
