// src/.../DoctorList/DoctorDetail.jsx - FILE MỚI

import React from 'react';
import './DoctorDetail.css'; // Sẽ tạo ở bước 3

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>);
  }
  return <div className="star-rating">{stars}</div>;
};

const DoctorDetail = ({ doctor, onBack }) => {
  return (
    <div className="doctor-detail-container">
      <button className="back-button" onClick={onBack}>
        ← Quay lại danh sách
      </button>

      <div className="doctor-detail-header">
        <img src={doctor.image} alt={doctor.name} className="doctor-detail-image" />
        <div className="doctor-detail-title">
          <h1>{doctor.name}</h1>
          <p className="doctor-detail-specialty">{doctor.specialty}</p>
        </div>
      </div>

      <div className="doctor-detail-section">
        <h2>Thông tin chung</h2>
        <p><strong>Kinh nghiệm:</strong> {doctor.experience}</p>
        <p><strong>Nơi công tác:</strong> {doctor.workplace}</p>
        <p>{doctor.bio}</p>
      </div>

      <div className="doctor-detail-section">
        <h2>Đánh giá ({doctor.reviews.length})</h2>
        <div className="doctor-reviews-list">
          {doctor.reviews.length > 0 ? (
            doctor.reviews.map(review => (
              <div key={review.id} className="feedback-card">
                <div className="feedback-header">
                  <h4 className="feedback-author">{review.author}</h4>
                  <StarRating rating={review.rating} />
                </div>
                <p className="feedback-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá nào cho bác sĩ này.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;