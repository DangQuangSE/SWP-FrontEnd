import React, { useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../configs/serverConfig";
const CommentItem = ({ comment, currentUser, onCommentDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Check if current user can delete this comment
  const canDelete = currentUser && currentUser.id === comment.userId;

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} năm trước`;
  };

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    try {
      setDeleting(true);
      console.log(`🗑️ Deleting comment ${comment.id}...`);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/comment/${comment.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      console.log("✅ Comment deleted successfully");
      onCommentDeleted(comment.id);
      toast.success("Đã xóa bình luận thành công!");
    } catch (error) {
      console.error("❌ Error deleting comment:", error);

      let errorMessage = "Có lỗi xảy ra khi xóa bình luận";
      if (error.message.includes("401")) {
        errorMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!";
      } else if (error.message.includes("403")) {
        errorMessage = "Bạn không có quyền xóa bình luận này";
      } else if (error.message.includes("404")) {
        errorMessage = "Bình luận không tồn tại";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <img
          src={comment.userAvatar || "/placeholder-user.jpg"}
          alt={comment.userName || "User"}
          className="comment-avatar"
        />
        <div className="comment-meta">
          <span className="comment-author">
            {comment.userName || "Người dùng"}
          </span>
          <span className="comment-time">
            {formatTimeAgo(comment.createdAt)}
          </span>
          {comment.createdAt !== comment.updatedAt && (
            <span className="comment-edited">(đã chỉnh sửa)</span>
          )}
        </div>

        {canDelete && (
          <div className="comment-actions">
            {!showConfirm ? (
              <button
                onClick={handleDelete}
                className="delete-btn"
                disabled={deleting}
                title="Xóa bình luận"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            ) : (
              <div className="confirm-delete">
                <span className="confirm-text">Xóa?</span>
                <button
                  onClick={handleDelete}
                  className="confirm-yes"
                  disabled={deleting}
                >
                  {deleting ? <span className="loading-spinner"></span> : "Có"}
                </button>
                <button
                  onClick={cancelDelete}
                  className="confirm-no"
                  disabled={deleting}
                >
                  Không
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="comment-content">
        <p>{comment.description}</p>
      </div>
    </div>
  );
};

export default CommentItem;
