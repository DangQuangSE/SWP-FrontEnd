"use client";

import { Link } from "react-router-dom";
import { useState } from "react";
import "./Generalnew.css";
import Breadcrumb from "../../../Breadcrumb/Breadcrumb";

const Generalnew = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Featured bài viết Y học thường thức
  const featuredArticle = {
    id: 0,
    title: "5 thói quen giúp nâng cao sức khỏe mỗi ngày",
    excerpt:
      "Duy trì thói quen tốt như uống đủ nước, ngủ đủ giấc, vận động hợp lý, ăn nhiều rau xanh và kiểm soát stress giúp bạn sống khỏe mạnh hơn. Cùng khám phá chi tiết từng thói quen!",
    image:
      "https://i.pinimg.com/736x/3a/4b/5c/3a4b5c6d7e8f9a0b1c2d3e4f5g6h7i8j.jpg",
    author: "Bác sĩ Hồng Minh",
    date: "12/06/2025, 08:00",
    hotline: "1900 5678",
  };

  // Sidebar bài viết Y học thường thức
  const sidebarArticles = [
    {
      id: 1,
      title: "Cách nhận biết dấu hiệu thiếu nước ở cơ thể",
      excerpt: "Thiếu nước ảnh hưởng đến sức khỏe như thế nào?",
      image:
        "https://i.pinimg.com/736x/11/22/33/112233445566778899aabbccddeeff00.jpg",
      category: "Y học thường thức",
      author: { name: "Dr. Lê Thảo", avatar: "/placeholder.svg" },
      date: "10/06/2025",
      featured: true,
    },
    {
      id: 2,
      title: "Ăn sáng đúng cách để khởi đầu ngày mới",
      excerpt: "Bữa sáng quan trọng ra sao với sức khỏe?",
      image:
        "https://i.pinimg.com/736x/22/33/44/2233445566778899aabbccddeeff0011.jpg",
      category: "Y học thường thức",
      author: { name: "Dr. Nguyễn An", avatar: "/placeholder.svg" },
      date: "08/06/2025",
    },
    {
      id: 3,
      title: "Tác dụng của việc đi bộ mỗi ngày",
      excerpt: "Đi bộ giúp cải thiện tim mạch, giảm stress...",
      image:
        "https://i.pinimg.com/736x/33/44/55/33445566778899aabbccddeeff001122.jpg",
      category: "Y học thường thức",
      author: { name: "Dr. Phạm Bình", avatar: "/placeholder.svg" },
      date: "05/06/2025",
    },
    {
      id: 4,
      title: "Ngủ đủ giấc và lợi ích cho sức khỏe",
      excerpt: "Thiếu ngủ gây ra những hậu quả gì?",
      image:
        "https://i.pinimg.com/736x/44/55/66/445566778899aabbccddeeff00112233.jpg",
      category: "Y học thường thức",
      author: { name: "Dr. Trần Hạnh", avatar: "/placeholder.svg" },
      date: "02/06/2025",
    },
    {
      id: 5,
      title: "Cách kiểm soát căng thẳng hiệu quả",
      excerpt: "Stress kéo dài ảnh hưởng thế nào đến cơ thể?",
      image:
        "https://i.pinimg.com/736x/55/66/77/5566778899aabbccddeeff0011223344.jpg",
      category: "Y học thường thức",
      author: { name: "Dr. Đỗ Quang", avatar: "/placeholder.svg" },
      date: "30/05/2025",
    },
  ];

  // Bài viết nổi bật phía dưới
  const bottomFeaturedCards = [
    {
      id: 9,
      title: "Uống nước đúng cách",
      subtitle: "Lợi ích và thời điểm tốt nhất để uống nước",
      image:
        "https://i.pinimg.com/736x/66/77/88/66778899aabbccddeeff001122334455.jpg",
      category: "Thói quen tốt",
    },
    {
      id: 10,
      title: "Tập thể dục tại nhà",
      subtitle: "Các bài tập đơn giản giúp nâng cao sức khỏe",
      image:
        "https://i.pinimg.com/736x/77/88/99/778899aabbccddeeff00112233445566.jpg",
      category: "Thói quen tốt",
    },
    {
      id: 11,
      title: "Ăn nhiều rau xanh",
      subtitle: "Tại sao nên bổ sung rau xanh mỗi ngày?",
      image:
        "https://i.pinimg.com/736x/88/99/aa/8899aabbccddeeff0011223344556677.jpg",
      category: "Thói quen tốt",
    },
  ];

  // Danh sách bài viết (phân trang)
  const serviceArticles = [
    {
      id: 6,
      title: "Tác hại của việc lười vận động",
      category: "Y học thường thức",
      date: "11/06/2025",
      image:
        "https://i.pinimg.com/736x/99/aa/bb/99aabbccddeeff001122334455667788.jpg",
    },
    {
      id: 7,
      title: "Cách phòng tránh cảm cúm mùa hè",
      category: "Y học thường thức",
      date: "10/06/2025",
      image:
        "https://i.pinimg.com/736x/aa/bb/cc/aabbccddeeff00112233445566778899.jpg",
    },
    {
      id: 8,
      title: "Vai trò của vitamin D với sức khỏe",
      category: "Y học thường thức",
      date: "09/06/2025",
      image:
        "https://i.pinimg.com/736x/bb/cc/dd/bbccddeeff00112233445566778899aa.jpg",
    },
    {
      id: 9,
      title: "Bí quyết giữ tinh thần lạc quan",
      category: "Y học thường thức",
      date: "08/06/2025",
      image:
        "https://i.pinimg.com/736x/cc/dd/ee/ccddeeff00112233445566778899aabb.jpg",
    },
    {
      id: 10,
      title: "Ăn uống lành mạnh cho người bận rộn",
      category: "Y học thường thức",
      date: "07/06/2025",
      image:
        "https://i.pinimg.com/736x/dd/ee/ff/ddeeff00112233445566778899aabbcc.jpg",
    },
    {
      id: 11,
      title: "Cách bảo vệ mắt khi dùng thiết bị điện tử",
      category: "Y học thường thức",
      date: "06/06/2025",
      image:
        "https://i.pinimg.com/736x/ee/ff/00/eeff00112233445566778899aabbccdd.jpg",
    },
    {
      id: 12,
      title: "Tại sao cần kiểm tra sức khỏe định kỳ?",
      category: "Y học thường thức",
      date: "05/06/2025",
      image:
        "https://i.pinimg.com/736x/ff/00/11/ff00112233445566778899aabbccddeeff.jpg",
    },
    {
      id: 13,
      title: "Cách phòng tránh bệnh truyền nhiễm",
      category: "Y học thường thức",
      date: "04/06/2025",
      image:
        "https://i.pinimg.com/736x/00/11/22/00112233445566778899aabbccddeeff.jpg",
    },
    {
      id: 14,
      title: "Tác dụng của việc thiền mỗi ngày",
      category: "Y học thường thức",
      date: "03/06/2025",
      image:
        "https://i.pinimg.com/736x/11/22/33/112233445566778899aabbccddeeff00.jpg",
    },
    {
      id: 15,
      title: "Cách phòng tránh bệnh về đường tiêu hóa",
      category: "Y học thường thức",
      date: "02/06/2025",
      image:
        "https://i.pinimg.com/736x/22/33/44/2233445566778899aabbccddeeff0011.jpg",
    },
    {
      id: 16,
      title: "Tầm quan trọng của việc rửa tay đúng cách",
      category: "Y học thường thức",
      date: "01/06/2025",
      image:
        "https://i.pinimg.com/736x/33/44/55/33445566778899aabbccddeeff001122.jpg",
    },
    {
      id: 17,
      title: "Cách phòng tránh bệnh sốt xuất huyết",
      category: "Y học thường thức",
      date: "31/05/2025",
      image:
        "https://i.pinimg.com/736x/44/55/66/445566778899aabbccddeeff00112233.jpg",
    },
    {
      id: 18,
      title: "Làm thế nào để ngủ ngon hơn?",
      category: "Y học thường thức",
      date: "30/05/2025",
      image:
        "https://i.pinimg.com/736x/55/66/77/5566778899aabbccddeeff0011223344.jpg",
    },
    {
      id: 19,
      title: "Cách phòng tránh bệnh về da mùa hè",
      category: "Y học thường thức",
      date: "29/05/2025",
      image:
        "https://i.pinimg.com/736x/66/77/88/66778899aabbccddeeff001122334455.jpg",
    },
    {
      id: 20,
      title: "Tác hại của việc ăn mặn quá nhiều",
      category: "Y học thường thức",
      date: "28/05/2025",
      image:
        "https://i.pinimg.com/736x/77/88/99/778899aabbccddeeff00112233445566.jpg",
    },
  ];

  const totalPages = Math.ceil(serviceArticles.length / articlesPerPage);

  const paginatedArticles = serviceArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="generalnew-wrapper">
      {/* Header */}
      <header className="generalnew-header">
        <div className="generalnew-container">
          <div className="generalnew-header-content">
            <Link to="/blog" className="generalnew-logo">
              <span className="generalnew-logo-text">Y HỌC THƯỜNG THỨC</span>
            </Link>
            <nav className="generalnew-main-nav">
              <Link to="/tin-y-te">Tin Y tế</Link>
              <Link to="/tin-dich-vu">Tin dịch vụ</Link>
              <Link to="/y-hoc-thuong-thuc" className="active">
                Y học thường thức
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <Breadcrumb
        items={[
          { label: "Trang chủ", to: "/" },
          { label: "Tin tức", to: "/blog" },
          { label: "Y học thường thức", to: "/y-hoc-thuong-thuc" },
        ]}
      />

      <main className="generalnew-main">
        <div className="generalnew-container">
          {/* Featured Section with Sidebar */}
          <div className="generalnew-featured-section">
            <div className="generalnew-featured-content-wrapper">
              {/* Featured Article */}
              <article className="generalnew-featured-article">
                <div className="generalnew-featured-background">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    width={800}
                    height={400}
                    className="generalnew-featured-bg-image"
                  />
                </div>
                <div className="generalnew-featured-text-content">
                  <h2 className="generalnew-featured-subtitle">
                    {featuredArticle.title}
                  </h2>
                  <p className="generalnew-featured-excerpt">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="generalnew-featured-meta">
                    <span className="generalnew-featured-date">
                      {featuredArticle.date} - {featuredArticle.author}
                    </span>
                  </div>
                  <Link to="#" className="generalnew-read-more-link">
                    Xem tiếp →
                  </Link>
                </div>
              </article>

              {/* Bottom Featured Cards */}
              <div className="generalnew-bottom-featured-cards">
                {bottomFeaturedCards.map((card) => (
                  <article key={card.id} className="generalnew-bottom-card">
                    <div className="generalnew-bottom-card-image">
                      <img
                        src={card.image || "/placeholder.svg"}
                        alt={card.title}
                        width={280}
                        height={180}
                        className="generalnew-card-image"
                      />
                      <div className="generalnew-card-overlay">
                        <h3 className="generalnew-card-title">
                          {card.title}
                        </h3>
                        <h4 className="generalnew-card-subtitle">
                          {card.subtitle}
                        </h4>
                        <p className="generalnew-card-description">
                          {card.description}
                        </p>
                        <Link to="#" className="generalnew-card-link">
                          Xem tiếp →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="generalnew-sidebar">
              <div className="generalnew-sidebar-content">
                {sidebarArticles.map((article) => (
                  <article
                    key={article.id}
                    className="generalnew-sidebar-article"
                  >
                    <div className="generalnew-sidebar-image">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={80}
                        height={60}
                        className="generalnew-sidebar-article-image"
                      />
                    </div>
                    <div className="generalnew-sidebar-text">
                      <span className="generalnew-sidebar-category">
                        {article.category}
                      </span>
                      <h4 className="generalnew-sidebar-title">
                        {article.title}
                      </h4>
                      <span className="generalnew-sidebar-date">
                        {article.date}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>

          <div className="generalnew-main-sections">
            {/* Service Section */}
            <section className="generalnew-service-section">
              <div className="generalnew-service-slider">
                <div className="generalnew-service-cards">
                  {paginatedArticles.map((article) => (
                    <article
                      key={article.id}
                      className="generalnew-service-card"
                    >
                      <div className="generalnew-service-card-image">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          width={250}
                          height={160}
                          className="generalnew-service-image"
                        />
                      </div>
                      <div className="generalnew-service-card-content">
                        <span className="generalnew-service-category">
                          {article.category}
                        </span>
                        <h3 className="generalnew-service-title">
                          {article.title}
                        </h3>
                        <span className="generalnew-service-date">
                          {article.date}
                        </span>
                        <Link to={`/blog/${article.id}`} className="generalnew-service-link">
                          Xem tiếp →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div
                className="generalnew-view-all-section"
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

export default Generalnew;