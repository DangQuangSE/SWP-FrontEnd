import React, { useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../configs/serverConfig";
const CommentForm = ({ blogId, user, onCommentAdded, onRefresh }) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }

    if (content.length > 1000) {
      toast.error("Bình luận không được vượt quá 1000 ký tự!");
      return;
    }

    try {
      setSubmitting(true);
      console.log(`💬 Submitting comment for blog ${blogId}...`);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập lại!");
        return;
      }

      const requestBody = {
        blogId: parseInt(blogId),
        description: content.trim(),
      };

      console.log(" Comment request body:", requestBody);

      const response = await fetch(`${API_BASE_URL}/comment`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const newComment = await response.json();
      console.log("Comment created successfully:", newComment);

      // Transform the response to match our comment structure
      const transformedComment = {
        id: newComment.id,
        description: newComment.description,
        userName:
          newComment.userName || user.fullname || user.name || "Người dùng",
        createdAt: newComment.createdAt || new Date().toISOString(),
        blogId: parseInt(blogId),
      };

      setContent("");
      onCommentAdded(transformedComment);
      if (typeof onRefresh === "function") onRefresh();
      toast.success("Đã thêm bình luận thành công!");
    } catch (error) {
      console.error(" Error creating comment:", error);

      let errorMessage = "Có lỗi xảy ra khi gửi bình luận";
      if (error.message.includes("401")) {
        errorMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!";
      } else if (error.message.includes("400")) {
        errorMessage = "Dữ liệu không hợp lệ";
      } else if (error.message.includes("403")) {
        errorMessage = "Bạn không có quyền thực hiện thao tác này";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="comment-form-header">
        <img
          src={user.imageUrl || "/placeholder-user.jpg"}
          alt={user.fullname || user.name || "User"}
          className="comment-form-avatar"
        />
        <div className="comment-form-user">
          <span className="comment-form-username">
            {user.fullname || user.name || "Người dùng"}
          </span>
          <span className="comment-form-prompt">Viết bình luận của bạn...</span>
        </div>
      </div>

      <div className="comment-input-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
          rows={4}
          maxLength={1000}
          required
          disabled={submitting}
          className="comment-textarea"
        />

        <div className="comment-form-footer">
          <div className="char-count">
            <span className={content.length > 900 ? "char-warning" : ""}>
              {content.length}/1000
            </span>
          </div>

          <div className="comment-form-actions">
            {content.trim() && (
              <button
                type="button"
                onClick={() => setContent("")}
                className="cancel-btn"
                disabled={submitting}
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="submit-btn"
            >
              {submitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang gửi...
                </>
              ) : (
                "Đăng bình luận"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
