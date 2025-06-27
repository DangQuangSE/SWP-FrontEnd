"use client";

import { Link } from "react-router-dom";
import { useState } from "react";
import "./Medicalnew.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

const MedicalNew = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const featuredArticle = {
    id: 0,
    title: "Top 5 cơ sở chăm sóc sức khỏe giới tính uy tín tại TPHCM",
    excerpt:
      "Khám sức khỏe giới tính định kỳ là yếu tố quan trọng giúp phòng ngừa bệnh lây truyền qua đường tình dục và bảo vệ khả năng sinh sản. Dưới đây là 5 địa chỉ uy tín tại TPHCM.",
    image:
      "https://i.pinimg.com/736x/f6/f7/a8/f6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1.jpg",
    author: "Tú Nguyên",
    date: "09/06/2025, 10:22",
    hotline: "1900 2115",
  };

  const sidebarArticles = [
    {
      id: 1,
      title:
        "Điều gì xảy ra khi bạn quên hạ trinh sau khi sinh và tháng hậu sản chấp dứt",
      excerpt: "Nhiều phụ nữ lo lắng về việc quên hạ trinh sau khi sinh...",
      image:
        "https://i.pinimg.com/736x/41/37/30/413730c203226a65b5a72ec505b2399d.jpg",
      category: "Tin Y tế",
      author: { name: "Dr. Trần Thanh", avatar: "/placeholder.svg" },
      date: "15/05/2023",
      featured: true,
    },
    {
      id: 2,
      title: "Bệnh viêm nhiễm phụ khoa: nguyên nhân và cách phòng tránh",
      excerpt: "Viêm nhiễm phụ khoa là một trong những vấn đề phổ biến...",
      image:
        "https://i.pinimg.com/736x/4b/5b/6f/4b5b6f26df0b61b28266ebf2605eae93.jpg",
      category: "Tin Y tế",
      author: { name: "Dr. Nguyễn Minh", avatar: "/placeholder.svg" },
      date: "20/04/2023",
    },
    {
      id: 3,
      title: "Những điều cần biết về sức khỏe sinh sản nam giới",
      excerpt: "Sức khỏe sinh sản nam giới là vấn đề quan trọng...",
      image:
        "https://i.pinimg.com/736x/08/89/51/088951e1a9cbf9ab9b12ebd7be30f0f9.jpg",
      category: "Tin Y tế",
      author: { name: "Dr. Lê Hùng", avatar: "/placeholder.svg" },
      date: "05/03/2023",
    },
    {
      id: 4,
      title: "Phương pháp mang thai an toàn và khỏe mạnh",
      excerpt: "Mang thai là giai đoạn quan trọng trong cuộc đời...",
      image:
        "https://i.pinimg.com/736x/b9/6a/9e/b96a9ec59995fbc5d0967ac34861d383.jpg",
      category: "Tin Y tế",
      author: { name: "Dr. Phạm Thảo", avatar: "/placeholder.svg" },
      date: "10/02/2023",
    },
    {
      id: 5,
      title: "Các biện pháp tránh thai hiện đại và hiệu quả",
      excerpt: "Tránh thai là một phần quan trọng trong kế hoạch...",
      image:
        "https://i.pinimg.com/736x/ca/9b/04/ca9b048a774ec168de6a4ff488c5ac2f.jpg",
      category: "Tin Y tế",
      author: { name: "Dr. Hoàng Anh", avatar: "/placeholder.svg" },
      date: "25/01/2023",
    },
  ];

  const bottomFeaturedCards = [
    {
      id: 6,
      title: "Sức khỏe tình dục",
      subtitle: "Khám sức khỏe tình dục ở đâu uy tín tại TPHCM?",
      image:
        "https://i.pinimg.com/736x/4e/d9/bf/4ed9bf9cd6f34e1ca721e90971a6eb70.jpg",
      category: "Tin thường thức ",
    },
    {
      id: 7,
      title: "Bệnh lây đường tình dục",
      subtitle: "Xét nghiệm và điều trị các bệnh xã hội an toàn, hiệu quả",
      image:
        "https://i.pinimg.com/736x/3b/ba/bd/3bbabda8a4b38bd72a9b4d4e590ca81a.jpg",
      category: "Tin thường thức ",
    },
    {
      id: 8,
      title: "Khám phụ khoa",
      subtitle: "Khám phụ khoa định kỳ có quan trọng không?",
      image:
        "https://i.pinimg.com/736x/eb/6d/42/eb6d4253eb5d58568572a15a8d79649f.jpg",
      category: "Tin thường thức ",
    },
  ];

  const serviceArticles = [
    {
      id: 9,
      title: "Tầm soát ung thư sinh dục - Phát hiện sớm để điều trị kịp thời",
      category: "Tin y tế",
      date: "08/06/2024",
      image:
        "https://i.pinimg.com/736x/38/36/d9/3836d9090a259143ece1fca9e9ad1406.jpg",
    },
    {
      id: 10,
      title: "Sức khỏe tình dục an toàn - Tư vấn và khám định kỳ",
      category: "Tin y tế",
      date: "06/06/2024",
      image:
        "https://i.pinimg.com/736x/05/9b/ac/059bac199052a4c974ef82690d8e4021.jpg",
    },
    {
      id: 11,
      title: "Phòng ngừa các bệnh lây truyền qua đường tình dục",
      category: "Tin y tế",
      date: "05/06/2024",
      image:
        "https://i.pinimg.com/736x/5a/04/28/5a04287a9574b72eff9cf090e85fe714.jpg",
    },
    {
      id: 12,
      title: "Sức khỏe sinh sản và mãn kinh - Những điều cần biết",
      category: "Tin y tế",
      date: "04/06/2024",
      image:
        "https://i.pinimg.com/736x/67/aa/fa/67aafad7e6dab629c1ba438f483cc6db.jpg",
    },
    {
      id: 13,
      title: "Tư vấn sức khỏe giới tính cho thanh thiếu niên",
      category: "Tin y tế",
      date: "03/06/2024",
      image:
        "https://i.pinimg.com/736x/54/d6/76/54d6769b3ce68365503b419457cbb2e3.jpg",
    },
    {
      id: 14,
      title: "Kế hoạch hóa gia đình - Các phương pháp tránh thai hiện đại",
      category: "Tin y tế",
      date: "02/06/2024",
      image:
        "https://i.pinimg.com/736x/ac/d8/d2/acd8d2eb1f0fdb9010691d094d8d440b.jpg",
    },
    {
      id: 15,
      title: "Chăm sóc sức khỏe sau sinh - Phục hồi toàn diện",
      category: "Tin y tế",
      date: "01/06/2024",
      image:
        "https://i.pinimg.com/736x/d8/45/e7/d845e7e8f96d7c8cae953d7a3821e6a0.jpg",
    },
    {
      id: 16,
      title: "Vô sinh hiếm muộn - Nguyên nhân và giải pháp điều trị",
      category: "Tin y tế",
      date: "31/05/2024",
      image:
        "https://i.pinimg.com/736x/e5/6c/b3/e56cb3e8bd4f7c8e54bb5fd68502cae4.jpg",
    },
    {
      id: 17,
      title: "Viêm nhiễm phụ khoa - Cách phòng ngừa hiệu quả",
      category: "Tin y tế",
      date: "30/05/2024",
      image:
        "https://i.pinimg.com/736x/b2/a1/d6/b2a1d67f1eb5c5a6c05be24936a3130c.jpg",
    },
    {
      id: 18,
      title: "Rối loạn nội tiết tố - Dấu hiệu và cách khắc phục",
      category: "Tin y tế",
      date: "29/05/2024",
      image:
        "https://i.pinimg.com/736x/f9/23/a5/f923a5e8b3c715d34b9c16a05a8b8a08.jpg",
    },
    {
      id: 19,
      title: "U xơ tử cung - Chẩn đoán sớm và điều trị hiệu quả",
      category: "Tin y tế",
      date: "28/05/2024",
      image:
        "https://i.pinimg.com/736x/d3/b7/c4/d3b7c4e0dfd91bc7f851d7a2e23c50b8.jpg",
    },
    {
      id: 20,
      title: "Rối loạn cương dương - Phá vỡ rào cản tâm lý",
      category: "Tin y tế",
      date: "27/05/2024",
      image:
        "https://i.pinimg.com/736x/7a/52/fd/7a52fd6c10b86c4aca91b86013220156.jpg",
    },
    {
      id: 21,
      title: "Sức khỏe sinh sản nam giới - Những vấn đề thường gặp",
      category: "Tin y tế",
      date: "26/05/2024",
      image:
        "https://i.pinimg.com/736x/21/1f/5c/211f5c05e7c93a439fe98126e06bed90.jpg",
    },
    {
      id: 22,
      title: "Lão hóa sinh dục - Giải pháp duy trì chất lượng sống",
      category: "Tin y tế",
      date: "25/05/2024",
      image:
        "https://i.pinimg.com/736x/c8/ef/a2/c8efa2d6e5ba71a1d1b438c4d58e6d9a.jpg",
    },
    {
      id: 23,
      title: "Hội chứng tiền kinh nguyệt - Cách nhận biết và điều trị",
      category: "Tin y tế",
      date: "24/05/2024",
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
    <div className="medicalnew-wrapper">
      {/* Header */}
      <header className="medicalnew-header">
        <div className="medicalnew-container">
          <div className="medicalnew-header-content">
            <Link to="/blog" className="medpro-all-blog-logo">
              <span className="medicalnew-logo-text">TIN TỨC Y KHOA</span>
            </Link>
            <nav className="medicalnew-main-nav">
              <Link to="/tin-y-te" className="active">
                Tin Y tế
              </Link>
              <Link to="/tin-dich-vu">Tin dịch vụ</Link>
              <Link to="/y-hoc-thuong-thuc">Y học thường thức</Link>
            </nav>
          </div>
        </div>
      </header>
      <Breadcrumb
        items={[
          { label: "Trang chủ", to: "/" },
          { label: "Tin tức", to: "/blog" },
          { label: "Tin Y tế", to: "/tin-y-te" },
        ]}
      />

      <main className="medicalnew-main">
        <div className="medicalnew-container">
          {/* Featured Section with Sidebar */}
          <div className="medicalnew-featured-section">
            <div className="medicalnew-featured-content-wrapper">
              {/* Featured Article */}
              <article className="medicalnew-featured-article">
                <div className="medicalnew-featured-background">
                  <img
                    src="https://i.pinimg.com/736x/eb/c0/cd/ebc0cd83863f421e49e17f30bc778065.jpg"
                    alt={featuredArticle.title}
                    width={800}
                    height={400}
                    className="medicalnew-featured-bg-image"
                  />
                </div>
                <div className="medicalnew-featured-text-content">
                  <h2 className="medicalnew-featured-subtitle">
                    {featuredArticle.title}
                  </h2>
                  <p className="medicalnew-featured-excerpt">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="medicalnew-featured-meta">
                    <span className="medicalnew-featured-date">
                      {featuredArticle.date} - {featuredArticle.author}
                    </span>
                  </div>
                  <Link
                    to={`/blog/${featuredArticle.id}`}
                    className="medicalnew-read-more-link"
                  >
                    Xem tiếp →
                  </Link>
                </div>
              </article>

              {/* Bottom Featured Cards */}
              <div className="medicalnew-bottom-featured-cards">
                {bottomFeaturedCards.map((card) => (
                  <article key={card.id} className="medicalnew-bottom-card">
                    <div className="medicalnew-bottom-card-image">
                      <img
                        src={card.image || "/placeholder.svg"}
                        alt={card.title}
                        width={280}
                        height={180}
                        className="medicalnew-card-image"
                      />
                      <div className="medicalnew-card-overlay">
                        <h3 className="medicalnew-card-title">{card.title}</h3>
                        <h4 className="medicalnew-card-subtitle">
                          {card.subtitle}
                        </h4>
                        <p className="medicalnew-card-description">
                          {card.description}
                        </p>
                        <Link
                          to={`/blog/${card.id}`}
                          className="medicalnew-card-link"
                        >
                          Xem tiếp →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="medicalnew-sidebar">
              <div className="medicalnew-sidebar-content">
                {sidebarArticles.map((article) => (
                  <Link
                    to={`/blog/${article.id}`}
                    key={article.id}
                    className="medicalnew-sidebar-article"
                  >
                    <div className="medicalnew-sidebar-image">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={80}
                        height={60}
                        className="medicalnew-sidebar-article-image"
                      />
                    </div>
                    <div className="medicalnew-sidebar-text">
                      <span className="medicalnew-sidebar-category">
                        {article.category}
                      </span>
                      <h4 className="medicalnew-sidebar-title">
                        {article.title}
                      </h4>
                      <span className="medicalnew-sidebar-date">
                        {article.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>

          <div className="medicalnew-main-sections">
            {/* Service Section */}
            <section className="medicalnew-service-section">
              <div className="medicalnew-service-slider">
                <div className="medicalnew-service-cards">
                  {paginatedArticles.map((article) => (
                    <article
                      key={article.id}
                      className="medicalnew-service-card"
                    >
                      <div className="medicalnew-service-card-image">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          width={250}
                          height={160}
                          className="medicalnew-service-image"
                        />
                      </div>
                      <div className="medicalnew-service-card-content">
                        <span className="medicalnew-service-category">
                          {article.category}
                        </span>
                        <h3 className="medicalnew-service-title">
                          {article.title}
                        </h3>
                        <span className="medicalnew-service-date">
                          {article.date}
                        </span>
                        <Link
                          to={`/blog/${article.id}`}
                          className="generalnew-service-link"
                        >
                          Xem tiếp →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div
                className="medicalnew-view-all-section"
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

export default MedicalNew;
