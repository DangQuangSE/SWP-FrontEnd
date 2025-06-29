"use client";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./allBlog.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import {
  fetchBlogsByTag,
  fetchTagById,
  likeBlog,
} from "../../api/consultantAPI";

const AllBlog = () => {
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [sidebarArticles, setSidebarArticles] = useState([]);
  const [bottomFeaturedCards, setBottomFeaturedCards] = useState([]);
  const [serviceArticles, setServiceArticles] = useState([]);
  const [medicalArticles, setMedicalArticles] = useState([]);
  const [medicalKnowledgeArticles, setMedicalKnowledgeArticles] = useState([]);
  const [tagNames, setTagNames] = useState({});
  const [likingBlogs, setLikingBlogs] = useState(new Set());

  // Handle like blog
  const handleLikeBlog = async (e, blogId) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (likingBlogs.has(blogId)) return; // Prevent double clicking

    try {
      setLikingBlogs((prev) => new Set([...prev, blogId]));

      await likeBlog(blogId);

      // Update local state for all article arrays
      const updateArticleArray = (articles) =>
        articles.map((article) =>
          article.id === blogId
            ? { ...article, likeCount: (article.likeCount || 0) + 1 }
            : article
        );

      setMedicalArticles(updateArticleArray);
      setServiceArticles(updateArticleArray);
      setMedicalKnowledgeArticles(updateArticleArray);

      console.log(`✅ Liked blog ${blogId}`);
    } catch (error) {
      console.error(`❌ Error liking blog ${blogId}:`, error);
    } finally {
      setLikingBlogs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(blogId);
        return newSet;
      });
    }
  };

  // Helper function to load blogs by tag with tag info
  const loadBlogsByTag = async (tagId, size = 2) => {
    try {
      console.log(`🔄 Loading blogs for tag ${tagId}...`);

      // Load tag info and blogs in parallel
      const [tagResponse, blogsResponse] = await Promise.all([
        fetchTagById(tagId),
        fetchBlogsByTag(tagId, 0, size),
      ]);

      const tagInfo = tagResponse.data;
      const blogs = blogsResponse.data?.content || [];

      console.log(`🏷️ Tag ${tagId} info:`, tagInfo);
      console.log(`📋 Tag ${tagId} blogs:`, blogs);

      // Store tag name for later use
      setTagNames((prev) => ({
        ...prev,
        [tagId]: tagInfo.name,
      }));

      return {
        tagInfo,
        blogs: blogs.filter((blog) => blog.status === "PUBLISHED"),
      };
    } catch (error) {
      console.error(`❌ Error loading blogs for tag ${tagId}:`, error);
      return {
        tagInfo: { name: `Tag ${tagId}`, description: "" },
        blogs: [],
      };
    }
  };

  useEffect(() => {
    const loadBlogsData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Loading all blogs data for /blog page...");

        // Gọi API trực tiếp để tránh CORS
        const response = await fetch(
          "http://localhost:8080/api/blog?page=0&size=50",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📋 All blogs API response:", data);

        let blogs = [];
        if (data?.content) {
          blogs = data.content;
        } else if (Array.isArray(data)) {
          blogs = data;
        }

        // Chỉ lấy blogs đã publish
        const publishedBlogs = blogs.filter(
          (blog) => blog.status === "PUBLISHED"
        );
        console.log("📊 Published blogs:", publishedBlogs.length);

        setAllBlogs(publishedBlogs);

        // Transform data cho từng section
        const transformedBlogs = publishedBlogs.map((blog, index) => ({
          id: blog.id,
          title: blog.title,
          excerpt: blog.content
            ? blog.content.substring(0, 150) + "..."
            : "Không có nội dung",
          image:
            blog.imgUrl ||
            "https://i.pinimg.com/736x/f6/f7/a8/f6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg",
          category: blog.tags?.[0]?.name || "Tin Y tế",
          author: {
            name: blog.author?.fullname || "Tác giả ẩn danh",
            avatar: blog.author?.imageUrl || "/placeholder.svg",
          },
          date: blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
            : "Không có ngày",
          viewCount: blog.viewCount || 0,
          likeCount: blog.likeCount || 0,
        }));

        // Featured article - blog có lượt xem cao nhất
        const sortedByViews = [...transformedBlogs].sort(
          (a, b) => b.viewCount - a.viewCount
        );
        if (sortedByViews.length > 0) {
          setFeaturedArticle({
            ...sortedByViews[0],
            subtitle: "Bài viết được xem nhiều nhất",
            description: sortedByViews[0].excerpt,
            hotline: "1900 2115",
          });
        }

        // Sidebar articles - 3 bài mới nhất (trừ featured)
        const recentBlogs = transformedBlogs
          .filter((blog) => blog.id !== sortedByViews[0]?.id)
          .slice(0, 3);
        setSidebarArticles(recentBlogs);

        // Phân loại theo tags chính xác
        console.log("🏷️ Phân loại blogs theo tags...");

        // 1. Load by tag ID 1 (Tin Y Tế from API) - chỉ lấy 2 blogs đại diện
        const medicalTagData = await loadBlogsByTag(1, 2);
        const medicalBlogs = medicalTagData.blogs.map((blog) => ({
          id: blog.id,
          title: blog.title,
          excerpt: blog.content
            ? blog.content.substring(0, 150) + "..."
            : "Không có nội dung",
          image:
            blog.imgUrl ||
            "https://i.pinimg.com/736x/f6/f7/a8/f6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg",
          category: medicalTagData.tagInfo.name || "Tin Y tế",
          author: {
            name: blog.author?.fullname || "Tác giả ẩn danh",
            avatar: blog.author?.imageUrl || "/placeholder.svg",
          },
          date: blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
            : "Không có ngày",
          viewCount: blog.viewCount || 0,
          likeCount: blog.likeCount || 0,
        }));
        console.log(
          `🏥 ${medicalTagData.tagInfo.name} blogs:`,
          medicalBlogs.length
        );
        setMedicalArticles(medicalBlogs);

        // 2. Load by tag ID 2 (Tin dịch vụ) - chỉ lấy 2 blogs đại diện
        const serviceTagData = await loadBlogsByTag(2, 2);
        const serviceBlogs = serviceTagData.blogs.map((blog) => ({
          id: blog.id,
          title: blog.title,
          excerpt: blog.content
            ? blog.content.substring(0, 150) + "..."
            : "Không có nội dung",
          image:
            blog.imgUrl ||
            "https://i.pinimg.com/736x/f6/f7/a8/f6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg",
          category: serviceTagData.tagInfo.name || "Tin dịch vụ",
          author: {
            name: blog.author?.fullname || "Tác giả ẩn danh",
            avatar: blog.author?.imageUrl || "/placeholder.svg",
          },
          date: blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
            : "Không có ngày",
          viewCount: blog.viewCount || 0,
          likeCount: blog.likeCount || 0,
        }));
        console.log(
          `🏢 ${serviceTagData.tagInfo.name} blogs:`,
          serviceBlogs.length
        );
        setServiceArticles(serviceBlogs);

        // 3. Load by tag ID 3 (Y học thường thức) - chỉ lấy 2 blogs đại diện
        const knowledgeTagData = await loadBlogsByTag(3, 2);
        const knowledgeBlogs = knowledgeTagData.blogs.map((blog) => ({
          id: blog.id,
          title: blog.title,
          excerpt: blog.content
            ? blog.content.substring(0, 150) + "..."
            : "Không có nội dung",
          image:
            blog.imgUrl ||
            "https://i.pinimg.com/736x/f6/f7/a8/f6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg",
          category: knowledgeTagData.tagInfo.name || "Y học thường thức",
          author: {
            name: blog.author?.fullname || "Tác giả ẩn danh",
            avatar: blog.author?.imageUrl || "/placeholder.svg",
          },
          date: blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
            : "Không có ngày",
          viewCount: blog.viewCount || 0,
          likeCount: blog.likeCount || 0,
        }));
        console.log(
          `📚 ${knowledgeTagData.tagInfo.name} blogs:`,
          knowledgeBlogs.length
        );
        setMedicalKnowledgeArticles(knowledgeBlogs);

        // All sections now use API by-tag, no fallback needed

        // Bottom featured cards - 3 bài có lượt thích cao nhất
        const sortedByLikes = [...transformedBlogs]
          .sort((a, b) => b.likeCount - a.likeCount)
          .slice(0, 3)
          .map((blog) => ({
            ...blog,
            subtitle: `${blog.likeCount} lượt thích`,
            description: blog.excerpt,
          }));
        setBottomFeaturedCards(sortedByLikes);

        console.log("✅ All blog sections loaded successfully");
        console.log("🎯 Featured article will be:", sortedByViews[0]);
        console.log("📋 Sidebar articles will be:", recentBlogs);
        console.log("🏥 Medical articles will be:", medicalBlogs.slice(0, 6));
        console.log("🏢 Service articles will be:", serviceBlogs.slice(0, 6));
      } catch (error) {
        console.error("❌ Error loading blogs:", error);
        // Fallback to empty arrays
        setAllBlogs([]);
        setFeaturedArticle(null);
        setSidebarArticles([]);
        setServiceArticles([]);
        setMedicalKnowledgeArticles([]);
        setBottomFeaturedCards([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogsData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="medpro-all-blog-wrapper">
        <header className="medpro-all-blog-header">
          <div className="medpro-all-blog-container">
            <div className="medpro-all-blog-header-content">
              <Link to="/blog" className="medpro-all-blog-logo">
                <span className="medpro-all-blog-logo-text">
                  TIN TỨC Y KHOA
                </span>
              </Link>
            </div>
          </div>
        </header>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div style={{ fontSize: "18px", marginBottom: "10px" }}>
            🔄 Đang tải dữ liệu blog...
          </div>
          <div style={{ color: "#666" }}>Vui lòng chờ trong giây lát</div>
        </div>
      </div>
    );
  }

  // Slider navigation functions
  const nextServiceSlide = () => {
    setCurrentServiceSlide(
      (prev) => (prev + 1) % Math.ceil(serviceArticles.length / 3)
    );
  };

  const prevServiceSlide = () => {
    setCurrentServiceSlide(
      (prev) =>
        (prev - 1 + Math.ceil(serviceArticles.length / 3)) %
        Math.ceil(serviceArticles.length / 3)
    );
  };

  return (
    <div className="medpro-all-blog-wrapper">
      {/* Header - chỉ có logo, không có navigation */}
      <header className="medpro-all-blog-header">
        <div className="medpro-all-blog-container">
          <div className="medpro-all-blog-header-content">
            <Link to="/blog" className="medpro-all-blog-logo">
              <span className="medpro-all-blog-logo-text">TIN TỨC Y KHOA</span>
            </Link>
          </div>
        </div>
      </header>
      <Breadcrumb
        items={[
          { label: "Trang chủ", to: "/" },
          { label: "Tin tức", to: "/blog" },
        ]}
      />

      <main className="medpro-all-blog-main">
        <div className="medpro-all-blog-container">
          {/* Main Content Sections */}
          <div className="medpro-all-blog-main-sections">
            {/* Medical News Section */}
            <section className="medpro-all-blog-medical-section">
              <div className="medpro-all-blog-section-header">
                <h2 className="medpro-all-blog-section-title">
                  {tagNames[1] || "Tin Y Tế"}
                </h2>
                <Link
                  to={`/blog/tag/1`}
                  className="medpro-all-blog-view-more-link"
                >
                  Xem thêm →
                </Link>
              </div>
              <div className="medpro-all-blog-two-column-grid">
                {medicalArticles.slice(0, 2).map((article) => (
                  <article
                    key={article.id}
                    className="medpro-all-blog-preview-card"
                  >
                    <div className="medpro-all-blog-preview-card-image">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="medpro-all-blog-preview-image"
                      />
                    </div>
                    <div className="medpro-all-blog-preview-card-content">
                      <span className="medpro-all-blog-preview-category">
                        {article.category}
                      </span>
                      <h3 className="medpro-all-blog-preview-title">
                        {article.title}
                      </h3>
                      <p className="medpro-all-blog-preview-excerpt">
                        {article.excerpt}
                      </p>
                      <div className="medpro-all-blog-preview-meta">
                        <span className="medpro-all-blog-preview-date">
                          {article.date}
                        </span>
                        <div className="medpro-all-blog-preview-stats">
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
                      <Link
                        to={`/blog/${article.id}`}
                        className="medpro-all-blog-preview-link"
                      >
                        Xem tiếp →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Service Section */}
            <section className="medpro-all-blog-service-section">
              <div className="medpro-all-blog-section-header">
                <h2 className="medpro-all-blog-section-title">
                  {tagNames[2] || "Tin dịch vụ"}
                </h2>
                <Link
                  to={`/blog/tag/2`}
                  className="medpro-all-blog-view-more-link"
                >
                  Xem thêm →
                </Link>
              </div>
              <div className="medpro-all-blog-two-column-grid">
                {serviceArticles.slice(0, 2).map((article) => (
                  <article
                    key={article.id}
                    className="medpro-all-blog-preview-card"
                  >
                    <div className="medpro-all-blog-preview-card-image">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="medpro-all-blog-preview-image"
                      />
                    </div>
                    <div className="medpro-all-blog-preview-card-content">
                      <span className="medpro-all-blog-preview-category">
                        {article.category}
                      </span>
                      <h3 className="medpro-all-blog-preview-title">
                        {article.title}
                      </h3>
                      <p className="medpro-all-blog-preview-excerpt">
                        {article.excerpt}
                      </p>
                      <div className="medpro-all-blog-preview-meta">
                        <span className="medpro-all-blog-preview-date">
                          {article.date}
                        </span>
                        <div className="medpro-all-blog-preview-stats">
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
                      <Link
                        to={`/blog/${article.id}`}
                        className="medpro-all-blog-preview-link"
                      >
                        Xem tiếp →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Medical Knowledge Section */}
            <section className="medpro-all-blog-medical-knowledge-section">
              <div className="medpro-all-blog-section-header">
                <h2 className="medpro-all-blog-section-title">
                  {tagNames[3] || "Y học thường thức"}
                </h2>
                <Link
                  to={`/blog/tag/3`}
                  className="medpro-all-blog-view-more-link"
                >
                  Xem thêm →
                </Link>
              </div>
              <div className="medpro-all-blog-two-column-grid">
                {medicalKnowledgeArticles.slice(0, 2).map((article) => (
                  <article
                    key={article.id}
                    className="medpro-all-blog-preview-card"
                  >
                    <div className="medpro-all-blog-preview-card-image">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="medpro-all-blog-preview-image"
                      />
                    </div>
                    <div className="medpro-all-blog-preview-card-content">
                      <span className="medpro-all-blog-preview-category">
                        {article.category}
                      </span>
                      <h3 className="medpro-all-blog-preview-title">
                        {article.title}
                      </h3>
                      <p className="medpro-all-blog-preview-excerpt">
                        {article.excerpt}
                      </p>
                      <div className="medpro-all-blog-preview-meta">
                        <span className="medpro-all-blog-preview-date">
                          {article.date}
                        </span>
                        <div className="medpro-all-blog-preview-stats">
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
                      <Link
                        to={`/blog/${article.id}`}
                        className="medpro-all-blog-preview-link"
                      >
                        Xem tiếp →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllBlog;
