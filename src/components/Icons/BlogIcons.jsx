import React from "react";

// Eye Icon Component (View Count)
export const EyeIcon = ({ size = 16, color = "#666" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill={color}
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M0 16q0.064 0.192 0.192 0.512t0.576 1.248 0.992 1.888 1.344 2.176 1.792 2.368 2.144 2.176 2.592 1.888 2.976 1.248 3.392 0.512q2.208 0 4.288-0.768t3.616-2.016 2.912-2.72 2.304-3.008 1.6-2.72 0.96-1.984l0.32-0.8q-0.064-0.16-0.192-0.48t-0.576-1.28-0.992-1.856-1.344-2.208-1.792-2.336-2.144-2.176-2.56-1.888-3.008-1.28-3.392-0.48q-2.208 0-4.288 0.768t-3.616 2.016-2.912 2.72-2.304 2.976-1.6 2.72-0.96 2.016zM6.016 16q0-2.72 1.344-5.024t3.616-3.616 5.024-1.344q2.048 0 3.872 0.8t3.2 2.112 2.144 3.2 0.8 3.872q0 2.72-1.344 5.024t-3.648 3.648-5.024 1.344q-2.016 0-3.872-0.8t-3.2-2.144-2.144-3.168-0.768-3.904zM10.016 16q0 2.496 1.728 4.256t4.256 1.76 4.256-1.76 1.76-4.256-1.76-4.224-4.256-1.76q-0.96 0-1.984 0.352v3.648h-3.648q-0.352 0.992-0.352 1.984z" />
  </svg>
);

// Heart Icon Component (Like Count)
export const HeartIcon = ({ size = 16, color = "#ff4757", filled = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={filled ? color : color}
    strokeWidth={filled ? "0" : "2"}
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// Comment Icon Component (Comment Count)
export const CommentIcon = ({ size = 16, color = "#666" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// Blog Stats Component - Combines all icons
export const BlogStats = ({
  viewCount = 0,
  likeCount = 0,
  commentCount = 0,
  onLike,
  isLiking = false,
  showLabels = false,
  size = 16,
}) => (
  <div className="blog-stats-icons">
    <div className="stat-item">
      <EyeIcon size={size} color="#666" />
      <span className="stat-count">
        {viewCount}
        {showLabels ? " lượt xem" : ""}
      </span>
    </div>

    {onLike ? (
      <button
        className={`stat-item like-button ${isLiking ? "liking" : ""}`}
        onClick={onLike}
        disabled={isLiking}
      >
        <HeartIcon size={size} color="#ff4757" filled={true} />
        <span className="stat-count">
          {likeCount}
          {showLabels ? " lượt thích" : ""}
        </span>
      </button>
    ) : (
      <div className="stat-item">
        <HeartIcon size={size} color="#ff4757" filled={true} />
        <span className="stat-count">
          {likeCount}
          {showLabels ? " lượt thích" : ""}
        </span>
      </div>
    )}

    <div className="stat-item">
      <CommentIcon size={size} color="#666" />
      <span className="stat-count">
        {commentCount}
        {showLabels ? " bình luận" : ""}
      </span>
    </div>
  </div>
);
