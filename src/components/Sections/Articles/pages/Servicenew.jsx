"use client";

import { Link } from "react-router-dom";
import { useState } from "react";
import "./Servicenew.css";

const Servicenew = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Featured dịch vụ
  const featuredArticle = {
    id: 0,
    title: "Top 5 dịch vụ y tế chất lượng cao tại TPHCM",
    excerpt:
      "Khám sức khỏe tổng quát, xét nghiệm chuyên sâu, tư vấn dinh dưỡng và nhiều dịch vụ khác giúp bạn chăm sóc sức khỏe toàn diện. Dưới đây là 5 dịch vụ nổi bật tại TPHCM.",
    image:
      "https://i.pinimg.com/736x/f6/f7/a8/f6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg",
    author: "Minh Quân",
    date: "10/06/2025, 09:00",
    hotline: "1900 1234",
  };

  // Sidebar dịch vụ
  const sidebarArticles = [
    {
      id: 1,
      title: "Khám sức khỏe tổng quát cho doanh nghiệp",
      excerpt: "Dịch vụ khám sức khỏe định kỳ cho nhân viên doanh nghiệp...",
      image:
        "https://i.pinimg.com/736x/f6/f7/a8/f6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg",
      category: "Dịch vụ",
      author: { name: "Dr. Nguyễn Văn A", avatar: "/placeholder.svg" },
      date: "01/06/2025",
      featured: true,
    },
    {
      id: 2,
      title: "Xét nghiệm máu tại nhà",
      excerpt: "Nhanh chóng, tiện lợi, đảm bảo kết quả chính xác...",
      image:
        "https://i.pinimg.com/736x/5b/6c/7d/5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k.jpg",
      category: "Dịch vụ",
      author: { name: "Dr. Trần Thị B", avatar: "/placeholder.svg" },
      date: "28/05/2025",
    },
    {
      id: 3,
      title: "Tư vấn dinh dưỡng cá nhân",
      excerpt: "Chuyên gia tư vấn chế độ ăn phù hợp từng đối tượng...",
      image:
        "https://i.pinimg.com/736x/6c/7d/8e/6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l.jpg",
      category: "Dịch vụ",
      author: { name: "Dr. Lê Văn C", avatar: "/placeholder.svg" },
      date: "20/05/2025",
    },
    {
      id: 4,
      title: "Khám chuyên khoa tim mạch",
      excerpt:
        "Phát hiện sớm các bệnh lý về tim mạch với trang thiết bị hiện đại...",
      image:
        "https://i.pinimg.com/736x/7d/8e/9f/7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m.jpg",
      category: "Dịch vụ",
      author: { name: "Dr. Phạm Thị D", avatar: "/placeholder.svg" },
      date: "15/05/2025",
    },
    {
      id: 5,
      title: "Khám nhi tại nhà",
      excerpt: "Dịch vụ bác sĩ nhi khoa đến tận nhà thăm khám cho bé...",
      image:
        "https://i.pinimg.com/736x/8e/9f/0a/8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n.jpg",
      category: "Dịch vụ",
      author: { name: "Dr. Hoàng Văn E", avatar: "/placeholder.svg" },
      date: "10/05/2025",
    },
  ];

  // Dịch vụ nổi bật phía dưới
  const bottomFeaturedCards = [
    {
      id: 9,
      title: "Khám sức khỏe tổng quát",
      subtitle: "Kiểm tra sức khỏe toàn diện, phát hiện sớm bệnh lý",
      image:
        "https://i.pinimg.com/736x/9a/1b/2c/9a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p.jpg",
      category: "Dịch vụ nổi bật",
    },
    {
      id: 10,
      title: "Xét nghiệm tại nhà",
      subtitle: "Tiện lợi, nhanh chóng, an toàn cho mọi gia đình",
      image:
        "https://i.pinimg.com/736x/1b/2c/3d/1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q.jpg",
      category: "Dịch vụ nổi bật",
    },
    {
      id: 11,
      title: "Tư vấn sức khỏe online",
      subtitle: "Kết nối bác sĩ mọi lúc, mọi nơi",
      image:
        "https://i.pinimg.com/736x/2c/3d/4e/2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r.jpg",
      category: "Dịch vụ nổi bật",
    },
  ];

  // Danh sách bài viết dịch vụ (phân trang)
  const serviceArticles = [
    {
      id: 6,
      title: "Khám sức khỏe tổng quát doanh nghiệp",
      category: "Dịch vụ",
      date: "10/06/2025",
      image:
        "https://i.pinimg.com/736x/38/36/d9/3836d9090a259143ece1fca9e9ad1406.jpg",
    },
    {
      id: 7,
      title: "Xét nghiệm máu tận nơi",
      category: "Dịch vụ",
      date: "09/06/2025",
      image:
        "https://i.pinimg.com/736x/05/9b/ac/059bac199052a4c974ef82690d8e4021.jpg",
    },
    {
      id: 8,
      title: "Tư vấn dinh dưỡng cá nhân hóa",
      category: "Dịch vụ",
      date: "08/06/2025",
      image:
        "https://i.pinimg.com/736x/5a/04/28/5a04287a9574b72eff9cf090e85fe714.jpg",
    },
    {
      id: 9,
      title: "Khám chuyên khoa tim mạch",
      category: "Dịch vụ",
      date: "07/06/2025",
      image:
        "https://i.pinimg.com/736x/67/aa/fa/67aafad7e6dab629c1ba438f483cc6db.jpg",
    },
    {
      id: 10,
      title: "Khám nhi tại nhà",
      category: "Dịch vụ",
      date: "06/06/2025",
      image:
        "https://i.pinimg.com/736x/54/d6/76/54d6769b3ce68365503b419457cbb2e3.jpg",
    },
    {
      id: 11,
      title: "Khám phụ khoa chuyên sâu",
      category: "Dịch vụ",
      date: "05/06/2025",
      image:
        "https://i.pinimg.com/736x/ac/d8/d2/acd8d2eb1f0fdb9010691d094d8d440b.jpg",
    },
    {
      id: 12,
      title: "Khám sức khỏe tiền hôn nhân",
      category: "Dịch vụ",
      date: "04/06/2025",
      image:
        "https://i.pinimg.com/736x/d8/45/e7/d845e7e8f96d7c8cae953d7a3821e6a0.jpg",
    },
    {
      id: 13,
      title: "Tư vấn sức khỏe online",
      category: "Dịch vụ",
      date: "03/06/2025",
      image:
        "https://i.pinimg.com/736x/e5/6c/b3/e56cb3e8bd4f7c8e54bb5fd68502cae4.jpg",
    },
    {
      id: 14,
      title: "Khám nội tổng quát",
      category: "Dịch vụ",
      date: "02/06/2025",
      image:
        "https://i.pinimg.com/736x/b2/a1/d6/b2a1d67f1eb5c5a6c05be24936a3130c.jpg",
    },
    {
      id: 15,
      title: "Khám mắt chuyên sâu",
      category: "Dịch vụ",
      date: "01/06/2025",
      image:
        "https://i.pinimg.com/736x/f9/23/a5/f923a5e8b3c715d34b9c16a05a8b8a08.jpg",
    },
    {
      id: 16,
      title: "Khám tai mũi họng",
      category: "Dịch vụ",
      date: "31/05/2025",
      image:
        "https://i.pinimg.com/736x/d3/b7/c4/d3b7c4e0dfd91bc7f851d7a2e23c50b8.jpg",
    },
    {
      id: 17,
      title: "Khám da liễu",
      category: "Dịch vụ",
      date: "30/05/2025",
      image:
        "https://i.pinimg.com/736x/7a/52/fd/7a52fd6c10b86c4aca91b86013220156.jpg",
    },
    {
      id: 18,
      title: "Khám xương khớp",
      category: "Dịch vụ",
      date: "29/05/2025",
      image:
        "https://i.pinimg.com/736x/21/1f/5c/211f5c05e7c93a439fe98126e06bed90.jpg",
    },
    {
      id: 19,
      title: "Khám tiêu hóa",
      category: "Dịch vụ",
      date: "28/05/2025",
      image:
        "https://i.pinimg.com/736x/c8/ef/a2/c8efa2d6e5ba71a1d1b438c4d58e6d9a.jpg",
    },
    {
      id: 20,
      title: "Khám thần kinh",
      category: "Dịch vụ",
      date: "27/05/2025",
      image:
        "https://i.pinimg.com/736x/b6/7d/ce/b67dce7ef889e3f3b98e0bc310e2810a.jpg",
    },
  ];

  const totalPages = Math.ceil(serviceArticles.length / articlesPerPage);

  const paginatedArticles = serviceArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="servicevnew-wrapper">
      {/* Header */}
      <header className="servicevnew-header">
        <div className="servicevnew-container">
          <div className="servicevnew-header-content">
            <Link to="/blog" className="servicevnew-logo">
              <span className="servicevnew-logo-text">TIN TỨC Y KHOA </span>
            </Link>
            <nav className="servicevnew-main-nav">
              <Link to="/tin-y-te">Tin Y tế</Link>
              <Link to="/tin-dich-vu" className="active">
                Tin dịch vụ
              </Link>
              <Link to="/y-hoc-thuong-thuc">Y học thường thức</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="servicevnew-main">
        <div className="servicevnew-container">
          {/* Featured Section with Sidebar */}
          <div className="servicevnew-featured-section">
            <div className="servicevnew-featured-content-wrapper">
              {/* Featured Article */}
              <article className="servicevnew-featured-article">
                <div className="servicevnew-featured-background">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    width={800}
                    height={400}
                    className="servicevnew-featured-bg-image"
                  />
                </div>
                <div className="servicevnew-featured-text-content">
                  <h2 className="servicevnew-featured-subtitle">
                    {featuredArticle.title}
                  </h2>
                  <p className="servicevnew-featured-excerpt">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="servicevnew-featured-meta">
                    <span className="servicevnew-featured-date">
                      {featuredArticle.date} - {featuredArticle.author}
                    </span>
                  </div>
                  <Link to="#" className="servicevnew-read-more-link">
                    Xem tiếp →
                  </Link>
                </div>
              </article>

              {/* Bottom Featured Cards */}
              <div className="servicevnew-bottom-featured-cards">
                {bottomFeaturedCards.map((card) => (
                  <article key={card.id} className="servicevnew-bottom-card">
                    <div className="servicevnew-bottom-card-image">
                      <img
                        src={card.image || "/placeholder.svg"}
                        alt={card.title}
                        width={280}
                        height={180}
                        className="servicevnew-card-image"
                      />
                      <div className="servicevnew-card-overlay">
                        <h3 className="servicevnew-card-title">
                          {card.title}
                        </h3>
                        <h4 className="servicevnew-card-subtitle">
                          {card.subtitle}
                        </h4>
                        <p className="servicevnew-card-description">
                          {card.description}
                        </p>
                        <Link to="#" className="servicevnew-card-link">
                          Xem tiếp →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="servicevnew-sidebar">
              <div className="servicevnew-sidebar-content">
                {sidebarArticles.map((article) => (
                  <article
                    key={article.id}
                    className="servicevnew-sidebar-article"
                  >
                    <div className="servicevnew-sidebar-image">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={80}
                        height={60}
                        className="servicevnew-sidebar-article-image"
                      />
                    </div>
                    <div className="servicevnew-sidebar-text">
                      <span className="servicevnew-sidebar-category">
                        {article.category}
                      </span>
                      <h4 className="servicevnew-sidebar-title">
                        {article.title}
                      </h4>
                      <span className="servicevnew-sidebar-date">
                        {article.date}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>

          <div className="servicevnew-main-sections">
            {/* Service Section */}
            <section className="servicevnew-service-section">
              <div className="servicevnew-service-slider">
                <div className="servicevnew-service-cards">
                  {paginatedArticles.map((article) => (
                    <article
                      key={article.id}
                      className="servicevnew-service-card"
                    >
                      <div className="servicevnew-service-card-image">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          width={250}
                          height={160}
                          className="servicevnew-service-image"
                        />
                      </div>
                      <div className="servicevnew-service-card-content">
                        <span className="servicevnew-service-category">
                          {article.category}
                        </span>
                        <h3 className="servicevnew-service-title">
                          {article.title}
                        </h3>
                        <span className="servicevnew-service-date">
                          {article.date}
                        </span>
                        <Link to="#" className="servicevnew-service-link">
                          Xem tiếp →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div
                className="servicevnew-view-all-section"
                style={{ marginTop: 24 }}
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    margin: "0 4px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    color: "#06b6d4",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1,
                  }}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      margin: "0 2px",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border:
                        i + 1 === currentPage
                          ? "2px solid #06b6d4"
                          : "1px solid #e2e8f0",
                      background: i + 1 === currentPage ? "#06b6d4" : "#fff",
                      color: i + 1 === currentPage ? "#fff" : "#06b6d4",
                      fontWeight: i + 1 === currentPage ? 700 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    margin: "0 4px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    color: "#06b6d4",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                  }}
                >
                  &gt;
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Servicenew;