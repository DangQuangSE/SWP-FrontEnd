import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { API_BASE_URL } from "../../configs/serverConfig";
import "./CommentSection.css";

const CommentSection = ({
  blogId,
  onCommentAdded: onCommentAddedFromParent,
  onCommentDeleted: onCommentDeletedFromParent,
}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userData && token) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  // Load comments when component mounts
  const loadComments = async () => {
    try {
      setLoading(true);
      console.log(" Loading comments cho blogId:", blogId);
      const response = await fetch(`${API_BASE_URL}/comment/blog/${blogId}`);
      const data = await response.json();
      console.log("API trả về:", data);

      // Transform comments data
      const transformedComments = Array.isArray(data)
        ? data.map((comment) => ({
            id: comment.id,
            description: comment.description,
            userName: comment.commenterName || "Người dùng ẩn danh",
            userId: comment.commenterId, // Sửa lại lấy từ commenterId
            createdAt: comment.createAt,
            blogId: blogId,
            userAvatar: "/placeholder-user.jpg",
          }))
        : [];

      setComments(transformedComments);
    } catch (error) {
      console.error(" Error loading comments:", error);
      toast.error("Không thể tải bình luận");
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  const handleCommentAdded = (newComment) => {
    console.log("New comment added:", newComment);
    setComments((prev) => [newComment, ...prev]);

    // Notify parent component to update comment count
    if (typeof onCommentAddedFromParent === "function") {
      onCommentAddedFromParent();
    }
  };

  const handleCommentDeleted = (commentId) => {
    console.log(`🗑️ Comment ${commentId} deleted`);
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));

    // Notify parent component to update comment count
    if (typeof onCommentDeletedFromParent === "function") {
      onCommentDeletedFromParent();
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <h3 className="comment-title">💬 Bình luận ({comments.length})</h3>
        <p className="comment-subtitle">
          Chia sẻ suy nghĩ của bạn về bài viết này
        </p>
      </div>

      {/* Comment Form - Only show if user is logged in */}
      {user ? (
        <CommentForm
          blogId={blogId}
          user={user}
          onCommentAdded={handleCommentAdded}
          onRefresh={loadComments}
        />
      ) : (
        <div className="login-prompt">
          <p>🔐 Bạn cần đăng nhập để có thể bình luận</p>
          <button
            className="login-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Đăng nhập ngay
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="comment-list">
        {loading ? (
          <div className="comments-loading">
            <span className="loading-spinner"></span>
            Đang tải bình luận...
          </div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>Chưa có bình luận nào</p>
            <p>Hãy là người đầu tiên chia sẻ ý kiến!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
