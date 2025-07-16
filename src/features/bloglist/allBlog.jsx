"use client";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./allBlog.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { SERVER_CONFIG } from "../../configs/api";

const AllBlog = () => {
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState([]);
  const [serviceArticles, setServiceArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");

  // Lấy tất cả tag
  useEffect(() => {
    fetch(`${SERVER_CONFIG.API_URL}/tags`)
      .then((res) => res.json())
      .then((data) => setTags(data || []))
      .catch(() => setTags([]));
  }, []);

  // Lấy blog theo tag hoặc tất cả
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        let blogs = [];
        if (selectedTag === "all") {
          const response = await fetch(
            `${SERVER_CONFIG.API_URL}/blog?page=0&size=50`
          );
          const data = await response.json();
          blogs = (data?.content || []).filter(
            (blog) => blog.status === "PUBLISHED"
          );
        } else {
          const response = await fetch(
            `${SERVER_CONFIG.API_URL}/blog/by-tag/${selectedTag}?page=0&size=50`
          );
          const data = await response.json();
          blogs = (data?.content || []).filter(
            (blog) => blog.status === "PUBLISHED"
          );
        }
        setAllBlogs(blogs);

        // Lọc các blog có tag "tin dịch vụ" (id = 2)
        const serviceBlogs = blogs.filter(
          (blog) =>
            blog.tags &&
            blog.tags.some((tag) => tag.id === 2 || tag.name === "tin dịch vụ")
        );
        setServiceArticles(serviceBlogs);
      } catch (error) {
        setAllBlogs([]);
        setServiceArticles([]);
      }
      setLoading(false);
    };
    fetchBlogs();
  }, [selectedTag]);

  // Xử lý chọn tag filter
  const handleFilterTag = (tagId) => {
    setSelectedTag(tagId);
  };

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
            Đang tải dữ liệu blog...
          </div>
          <div style={{ color: "#666" }}>Vui lòng chờ trong giây lát</div>
        </div>
      </div>
    );
  }

  return (
    <div className="medpro-all-blog-wrapper">
      <header className="medpro-all-blog-header">
        <div className="medpro-all-blog-container">
          <div className="medpro-all-blog-header-content">
            <Link to="/blog" className="medpro-all-blog-logo">
              <span className="medpro-all-blog-logo-text">TIN TỨC Y KHOA</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Filter tag group - căn giữa, đặt ngay dưới header */}
      <div
        className="medpro-all-blog-container"
        style={{ marginTop: 32, marginBottom: 18 }}
      >
        <div
          className="blog-tag-filter-group"
          style={{ justifyContent: "center" }}
        >
          <button
            className={`blog-tag-filter-btn${
              selectedTag === "all" ? " active" : ""
            }`}
            onClick={() => handleFilterTag("all")}
          >
            Tất cả
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`blog-tag-filter-btn${
                selectedTag === tag.id ? " active" : ""
              }`}
              onClick={() => handleFilterTag(tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <Breadcrumb
        items={[
          { label: "Trang chủ", to: "/" },
          { label: "Tin tức", to: "/blog" },
        ]}
      />

      <main className="medpro-all-blog-main">
        <div className="medpro-all-blog-container">
          {/* All Blogs Section */}
          <section className="medpro-all-blog-all-section">
            <div
              className="medpro-all-blog-section-header"
              style={{ marginTop: 8 }}
            >
              <h2 className="medpro-all-blog-section-title">Tất cả tin tức</h2>
              <p className="medpro-all-blog-section-description">
                Khám phá các bài viết, tin tức và kiến thức y khoa nổi bật mỗi
                ngày!
              </p>
            </div>
            {allBlogs.length > 0 ? (
              <div className="medpro-all-blog-service-grid">
                {allBlogs.map((blog) => (
                  <div className="service-blog-card" key={blog.id}>
                    <img
                      src={
                        blog.imgUrl ||
                        "https://via.placeholder.com/400x250?text=Blog+Image"
                      }
                      alt={blog.title}
                      className="service-blog-image"
                    />
                    <div className="service-blog-content">
                      <span className="service-blog-tag">
                        • {blog.tags?.[0]?.name || "Tin tức"}
                      </span>
                      <h3 className="service-blog-title">{blog.title}</h3>
                      <p className="service-blog-desc">
                        {blog.content?.substring(0, 150) + "..." ||
                          "Nội dung bài viết..."}
                      </p>
                      <div className="service-blog-meta">
                        <span>
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : ""}{" "}
                          - {blog.author?.fullname || "Tác giả ẩn danh"}
                        </span>
                      </div>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="service-blog-link"
                      >
                        Xem tiếp <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="medpro-all-blog-no-content">
                <h3> Chưa có bài viết nào</h3>
                <p>Hiện tại chưa có bài viết nào được đăng tải.</p>
              </div>
            )}
          </section>
          {/* Service Blogs Section */}
          <section className="medpro-all-blog-service-section">
            <div className="medpro-all-blog-service-grid">
              {serviceArticles.slice(0, 3).map((blog) => (
                <div className="service-blog-card" key={blog.id}>
                  <img
                    src={blog.imgUrl}
                    alt={blog.title}
                    className="service-blog-image"
                  />
                  <div className="service-blog-content">
                    <span className="service-blog-tag">• Tin dịch vụ</span>
                    <h3 className="service-blog-title">{blog.title}</h3>
                    <p className="service-blog-desc">
                      {blog.content?.substring(0, 150) + "..." ||
                        "Nội dung bài viết..."}
                    </p>
                    <div className="service-blog-meta">
                      <span>
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
                          : ""}{" "}
                        - {blog.author?.fullname || "Tác giả ẩn danh"}
                      </span>
                    </div>
                    <Link to={`/blog/${blog.id}`} className="service-blog-link">
                      Xem tiếp <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AllBlog;
