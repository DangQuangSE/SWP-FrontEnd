import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import RelatedArticlesSection from "./RelatedArticlesSection";
import { fetchBlogDetail, likeBlog } from "../../api/consultantAPI";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const loadBlogDetail = async () => {
      try {
        setLoading(true);
        console.log(`🔄 Loading blog detail for ID: ${id}`);

        // Call API to get blog detail (this will auto-increment view count)
        const response = await fetchBlogDetail(id);
        const blogData = response.data;

        console.log("📋 Blog detail loaded:", blogData);

        // Transform blog data
        const transformedArticle = {
          id: blogData.id,
          title: blogData.title,
          content: blogData.content,
          image:
            blogData.imgUrl ||
            "https://via.placeholder.com/800x400?text=No+Image",
          author: {
            name: blogData.author?.fullname || "Tác giả ẩn danh",
            avatar: blogData.author?.imageUrl || "/placeholder.svg",
          },
          date: blogData.createdAt
            ? new Date(blogData.createdAt).toLocaleDateString("vi-VN")
            : "Không có ngày",
          viewCount: blogData.viewCount || 0,
          likeCount: blogData.likeCount || 0,
          category: blogData.tags?.[0]?.name || "general",
        };

        setArticle(transformedArticle);

        // Load related articles from localStorage as fallback
        const sampleArticles = JSON.parse(
          localStorage.getItem("allArticles") || "[]"
        );
        const related = sampleArticles.filter(
          (item) => item.id.toString() !== id
        );
        setRelatedArticles(related);
      } catch (error) {
        console.error("❌ Error loading blog detail:", error);

        // Fallback to localStorage
        const sampleArticles = JSON.parse(
          localStorage.getItem("allArticles") || "[]"
        );
        const fallbackArticle = sampleArticles.find(
          (item) => item.id.toString() === id
        );
        setArticle(fallbackArticle || null);

        const related = sampleArticles.filter(
          (item) => item.id.toString() !== id
        );
        setRelatedArticles(related);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBlogDetail();
    }
  }, [id]);

  // Handle like blog
  const handleLikeBlog = async () => {
    if (liking || !article) return;

    try {
      setLiking(true);
      await likeBlog(article.id);

      // Update local state
      setArticle((prev) => ({
        ...prev,
        likeCount: (prev.likeCount || 0) + 1,
      }));

      console.log(`✅ Liked blog ${article.id}`);
    } catch (error) {
      console.error(`❌ Error liking blog ${article.id}:`, error);
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-detail-page-wrapper">
        <div className="slogan-section">
          <h1 className="slogan-title">
            CHĂM SÓC SỨC KHỎE GIỚI TÍNH SHEALTHCARE
          </h1>
          <p className="slogan-text">
            "Vì sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi"
          </p>
        </div>
        <div className="blog-detail-container">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-500 mb-4">
              🔄 Đang tải bài viết...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="blog-detail-page-wrapper">
        <div className="top-header-container">
          <div className="breadcrumbs"></div>
        </div>
        <div className="slogan-section">
          <h1 className="slogan-title">
            TRUNG TÂM NỘI SOI TIÊU HÓA DOCTOR CHECK
          </h1>
          <p className="slogan-text">
            "Vì một Việt Nam nói không với ung thư dạ dày & đại tràng"
          </p>
        </div>
        <div className="blog-detail-container">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-500 mb-4">
              Bài viết không tồn tại.
            </h2>
            <Link to="/blog" className="back-button">
              Quay lại danh sách bài viết
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page-wrapper">
      <div className="slogan-section">
        <h1 className="slogan-title">
          CHĂM SÓC SỨC KHỎE GIỚI TÍNH SHEALTHCARE
        </h1>
        <p className="slogan-text">
          "Vì sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi"
        </p>
      </div>
      <div className="blog-detail-container">
        <article>
          <header className="blog-header">
            <img
              src={article.image}
              alt={article.title}
              className="blog-image"
            />
            <h1 className="blog-title">{article.title}</h1>
            <div className="blog-meta">
              {article.author.avatar && (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="author-avatar"
                />
              )}
              <span className="font-medium">{article.author.name}</span>
              <span className="mx-2">•</span>
              <span>{article.date}</span>
            </div>

            {/* Blog Stats */}
            <div className="blog-stats">
              <div className="stat-item">
                <span className="stat-icon">👁️</span>
                <span className="stat-count">
                  {article.viewCount || 0} lượt xem
                </span>
              </div>
              <button
                className={`stat-item like-button ${liking ? "liking" : ""}`}
                onClick={handleLikeBlog}
                disabled={liking}
              >
                <span className="stat-icon">❤️</span>
                <span className="stat-count">
                  {article.likeCount || 0} lượt thích
                </span>
              </button>
              <div className="stat-item">
                <span className="stat-icon">💬</span>
                <span className="stat-count">0 bình luận</span>
              </div>
            </div>
          </header>

          <div className="blog-content">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </div>
      <RelatedArticlesSection articles={relatedArticles} />
    </div>
  );
};

export default BlogDetail;
