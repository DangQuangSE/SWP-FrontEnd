// src/.../AppointmentForm/FeedbackList/FeedbackList.jsx

import React from 'react';
import './FeedbackList.css'; // Sẽ tạo ở bước 2

// Dữ liệu mẫu, sau này bạn có thể lấy từ API
const sampleFeedback = [
  {
    id: 1,
    author: 'Nguyễn Thu Trang',
    rating: 5,
    date: '20/05/2024',
    comment: 'Dịch vụ rất chuyên nghiệp, bác sĩ tư vấn tận tình. Mình rất hài lòng và sẽ quay lại.',
  },
  {
    id: 2,
    author: 'Trần Minh Hoàng',
    rating: 4,
    date: '18/05/2024',
    comment: 'Phòng khám sạch sẽ, trang thiết bị hiện đại. Thời gian chờ hơi lâu một chút nhưng chấp nhận được.',
  },
  {
    id: 3,
    author: 'Lê Thị Bích',
    rating: 5,
    date: '15/05/2024',
    comment: 'Nhân viên thân thiện, hướng dẫn chu đáo. Bác sĩ giỏi, giải thích cặn kẽ. Cảm ơn phòng khám!',
  },
  {
    id: 4,
    author: 'Phạm Văn Nam',
    rating: 4,
    date: '12/05/2024',
    comment: 'Quy trình đặt lịch online tiện lợi, tiết kiệm thời gian. Sẽ giới thiệu cho bạn bè.',
  },
];

// Component nhỏ để hiển thị ngôi sao
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
    );
  }
  return <div className="star-rating">{stars}</div>;
};

const FeedbackList = () => {
  return (
    <div className="feedback-list-container">
      {sampleFeedback.map(feedback => (
        <div key={feedback.id} className="feedback-card">
          <div className="feedback-header">
            <h4 className="feedback-author">{feedback.author}</h4>
            <StarRating rating={feedback.rating} />
          </div>
          <p className="feedback-date">{feedback.date}</p>
          <p className="feedback-comment">{feedback.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;