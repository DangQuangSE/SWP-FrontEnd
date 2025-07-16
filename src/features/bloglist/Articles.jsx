import React, { useState, useEffect } from "react";
import "./Articles.css";
import { Link } from "react-router-dom";
import { likeBlog } from "../../api/consultantAPI";
import { SERVER_CONFIG } from "../../configs/api";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [likingBlogs, setLikingBlogs] = useState(new Set());
  const articlesPerPage = 4;

  // Handle like blog
  const handleLikeBlog = async (e, blogId) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (likingBlogs.has(blogId)) return; // Prevent double clicking

    try {
      setLikingBlogs((prev) => new Set([...prev, blogId]));

      const response = await likeBlog(blogId);

      // Update local state optimistically
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === blogId
            ? { ...article, likeCount: (article.likeCount || 0) + 1 }
            : article
        )
      );

      // Reload all articles to get updated data from server
      setTimeout(async () => {
        try {
          // Reload the articles data from API
          const response = await fetch(
            `${SERVER_CONFIG.API_URL}/blog?page=0&size=20`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            let blogs = [];
            if (data?.content) {
              blogs = data.content;
            } else if (Array.isArray(data)) {
              blogs = data;
            }

            // Sort and transform like before
            const topBlogs = blogs
              .filter((blog) => blog.status === "PUBLISHED")
              .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
              .slice(0, 5);

            const transformedArticles = topBlogs.map((blog, index) => ({
              id: blog.id,
              title: blog.title,
              excerpt: blog.content
                ? blog.content.substring(0, 150) + "..."
                : "Không có nội dung",
              image:
                blog.imgUrl ||
                "https://via.placeholder.com/400x300?text=No+Image",
              category: blog.tags?.[0]?.name || "general",
              author: {
                name: blog.author?.fullname || "Tác giả ẩn danh",
                avatar: blog.author?.imageUrl || "/placeholder.svg",
              },
              date: blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
                : "Không có ngày",
              viewCount: blog.viewCount || 0,
              likeCount: blog.likeCount || 0,
              featured: index === 0,
            }));

            setArticles(transformedArticles);
          }
        } catch (reloadError) {
          console.error(`Error reloading articles:`, reloadError);
        }
      }, 2000);
    } catch (error) {
      // Show user-friendly error message with login prompt
      const errorMessage =
        error.message || "Không thể thích bài viết. Vui lòng thử lại sau.";

      if (errorMessage.includes("đăng nhập")) {
        const shouldLogin = confirm(
          ` ${errorMessage}\n\n Bạn có muốn đăng nhập ngay không?`
        );
        if (shouldLogin) {
          // Redirect to login page
          window.location.href = "/login";
        }
      } else {
        alert(` ${errorMessage}`);
      }

      // Revert optimistic update on error
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === blogId
            ? {
                ...article,
                likeCount: Math.max(0, (article.likeCount || 0) - 1),
              }
            : article
        )
      );
    } finally {
      setLikingBlogs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(blogId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    const loadTopBlogs = async () => {
      try {
        setLoading(true);
        // Lấy nhiều blogs để có thể sort theo viewCount
        // Gọi API trực tiếp không qua api instance để tránh CORS
        const response = await fetch(
          `${SERVER_CONFIG.API_URL}/blog?page=0&size=20`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Không gửi Authorization header để tránh CORS preflight
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let blogs = [];
        if (data?.content) {
          blogs = data.content;
        } else if (Array.isArray(data)) {
          blogs = data;
        }

        // Sort theo viewCount giảm dần và lấy top 5
        const topBlogs = blogs
          .filter((blog) => blog.status === "PUBLISHED") // Chỉ lấy blog đã publish
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 5);

        // Transform data để phù hợp với UI
        const transformedArticles = topBlogs.map((blog, index) => ({
          id: blog.id,
          title: blog.title,
          excerpt: blog.content
            ? blog.content.substring(0, 150) + "..."
            : "Không có nội dung",
          image:
            blog.imgUrl || "https://via.placeholder.com/400x300?text=No+Image",
          category: blog.tags?.[0]?.name || "general",
          author: {
            name: blog.author?.fullname || "Tác giả ẩn danh",
            avatar: blog.author?.imageUrl || "/placeholder.svg",
          },
          date: blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
            : "Không có ngày",
          viewCount: blog.viewCount || 0,
          likeCount: blog.likeCount || 0,
          featured: index === 0, // Blog có lượt xem cao nhất làm featured
        }));

        setArticles(transformedArticles);

        // Lưu vào localStorage để dùng ở BlogDetail
        localStorage.setItem(
          "allArticles",
          JSON.stringify(transformedArticles)
        );
      } catch (error) {
        // Fallback to empty array if API fails
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopBlogs();
  }, []);

  const featuredArticle = articles.find((article) => article.featured);
  const sidebarArticles = featuredArticle
    ? articles.filter((a) => a.id !== featuredArticle.id)
    : articles;

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentSidebarArticles = sidebarArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const totalPages = Math.ceil(sidebarArticles.length / articlesPerPage);

  if (loading) {
    return (
      <section className="articles section">
        <div className="container">
          <div
            className="loading-container"
            style={{ textAlign: "center", padding: "50px" }}
          >
            <div> Đang tải top 5 bài viết có lượt xem cao nhất...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="articles section">
      <div className="container">
        <div className="blog-layout">
          {/* Featured Article */}
          {featuredArticle && (
            <Link
              to={`/blog/${featuredArticle.id}`}
              className="featured-article"
            >
              <div className="featured-image">
                <img src={featuredArticle.image} alt={featuredArticle.title} />
              </div>
              <div className="featured-content">
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt}</p>
                <div className="article-meta">
                  <div className="article-author">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                    />
                    <span>{featuredArticle.author.name}</span>
                  </div>
                  <div className="article-date">{featuredArticle.date}</div>
                </div>

                {/* Article Stats */}
                <div className="article-stats">
                  <div className="stat-item">
                    <span className="stat-icon">👁️</span>
                    <span className="stat-count">
                      {featuredArticle.viewCount || 0}
                    </span>
                  </div>
                  <button
                    className={`stat-item like-button ${
                      likingBlogs.has(featuredArticle.id) ? "liking" : ""
                    }`}
                    onClick={(e) => handleLikeBlog(e, featuredArticle.id)}
                    disabled={likingBlogs.has(featuredArticle.id)}
                  >
                    <span className="stat-icon">❤️</span>
                    <span className="stat-count">
                      {featuredArticle.likeCount || 0}
                    </span>
                  </button>
                  <div className="stat-item">
                    <span className="stat-icon">💬</span>
                    <span className="stat-count">0</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Sidebar Articles */}
          <div className="sidebar-articles">
            {currentSidebarArticles.map((article) => (
              <Link
                to={`/blog/${article.id}`}
                key={article.id}
                className="sidebar-article"
              >
                <div className="sidebar-article-image">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="sidebar-article-content">
                  <h3>{article.title}</h3>
                  <div className="article-meta">
                    <div className="article-author">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                      />
                      <span>{article.author.name}</span>
                    </div>
                    <div className="article-date">{article.date}</div>
                  </div>

                  {/* Sidebar Article Stats */}
                  <div className="sidebar-article-stats">
                    <div className="stat-item">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-count">
                        {article.viewCount || 0}
                      </span>
                    </div>
                    <button
                      className={`stat-item like-button ${
                        likingBlogs.has(article.id) ? "liking" : ""
                      }`}
                      onClick={(e) => handleLikeBlog(e, article.id)}
                      disabled={likingBlogs.has(article.id)}
                    >
                      <span className="stat-icon">❤️</span>
                      <span className="stat-count">
                        {article.likeCount || 0}
                      </span>
                    </button>
                    <div className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span className="stat-count">0</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="sidebar-pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-dot ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  ></button>
                ))}
              </div>
            )}

            <div className="see-all-button-blog">
              <Link to="/blog" className="view-all-link-blog">
                Xem tất cả bài viết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;
