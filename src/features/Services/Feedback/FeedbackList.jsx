// src/.../AppointmentForm/FeedbackList/FeedbackList.jsx

import React, { useState, useEffect } from "react";
import { message, Spin } from "antd";
import "./FeedbackList.css";

// Component nhỏ để hiển thị ngôi sao
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

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch feedback data from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/feedback");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        message.error("Không thể tải danh sách đánh giá. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="feedback-list-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Spin size="large" />
          <p style={{ marginTop: "1rem" }}>Đang tải đánh giá...</p>
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="feedback-list-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Chưa có đánh giá nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-list-container">
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="feedback-card">
          <div className="feedback-header">
            <h4 className="feedback-author">{feedback.customerName}</h4>
            <StarRating rating={feedback.rating} />
          </div>
          <p className="feedback-date">{formatDate(feedback.createdAt)}</p>
          <p className="feedback-comment">{feedback.comment}</p>
          <div className="feedback-meta">
            {feedback.serviceFeedbackName && (
              <span className="feedback-service">
                Dịch vụ: {feedback.serviceFeedbackName}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
