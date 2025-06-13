"use client";

import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./allBlog.css";
import Breadcrumb from "../../../Breadcrumb/Breadcrumb";


const AllBlog = () => {
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);

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
        title: 'Điều gì xảy ra khi bạn quên hạ trinh sau khi sinh và tháng hậu sản chấp dứt',
        excerpt: 'Nhiều phụ nữ lo lắng về việc quên hạ trinh sau khi sinh...',
        image: 'https://i.pinimg.com/736x/41/37/30/413730c203226a65b5a72ec505b2399d.jpg',
        category: 'Tin Y tế',
        author: { name: 'Dr. Trần Thanh', avatar: '/placeholder.svg' },
        date: '15/05/2023',
        featured: true
      },
      {
        id: 2,
        title: 'Bệnh viêm nhiễm phụ khoa: nguyên nhân và cách phòng tránh',
        excerpt: 'Viêm nhiễm phụ khoa là một trong những vấn đề phổ biến...',
        image: 'https://i.pinimg.com/736x/4b/5b/6f/4b5b6f26df0b61b28266ebf2605eae93.jpg',
        category: 'Tin Y tế',
        author: { name: 'Dr. Nguyễn Minh', avatar: '/placeholder.svg' },
        date: '20/04/2023'
      },
      {
        id: 3,
        title: 'Những điều cần biết về sức khỏe sinh sản nam giới',
        excerpt: 'Sức khỏe sinh sản nam giới là vấn đề quan trọng...',
        image: 'https://i.pinimg.com/736x/08/89/51/088951e1a9cbf9ab9b12ebd7be30f0f9.jpg',
        category: 'Tin Y tế',
        author: { name: 'Dr. Lê Hùng', avatar: '/placeholder.svg' },
        date: '05/03/2023'
      },
      {
        id: 4,
        title: 'Phương pháp mang thai an toàn và khỏe mạnh',
        excerpt: 'Mang thai là giai đoạn quan trọng trong cuộc đời...',
        image: 'https://i.pinimg.com/736x/b9/6a/9e/b96a9ec59995fbc5d0967ac34861d383.jpg',
        category: 'Tin Y tế',
        author: { name: 'Dr. Phạm Thảo', avatar: '/placeholder.svg' },
        date: '10/02/2023'
      },
      {
        id: 5,
        title: 'Các biện pháp tránh thai hiện đại và hiệu quả',
        excerpt: 'Tránh thai là một phần quan trọng trong kế hoạch...',
        image: 'https://i.pinimg.com/736x/ca/9b/04/ca9b048a774ec168de6a4ff488c5ac2f.jpg',
        category: 'Tin Y tế',
        author: { name: 'Dr. Hoàng Anh', avatar: '/placeholder.svg' },
        date: '25/01/2023'
      }
  ];

  const bottomFeaturedCards = [
    {
      id: 9,
      title: "Sức khỏe tình dục",
      subtitle: "Khám sức khỏe tình dục ở đâu uy tín tại TPHCM?",
      image:
        "https://i.pinimg.com/736x/4e/d9/bf/4ed9bf9cd6f34e1ca721e90971a6eb70.jpg",
      category: "Tin thường thức ",
    },
    {
      id: 10,
      title: "Bệnh lây đường tình dục",
      subtitle: "Xét nghiệm và điều trị các bệnh xã hội an toàn, hiệu quả",
      image:
        "https://i.pinimg.com/736x/3b/ba/bd/3bbabda8a4b38bd72a9b4d4e590ca81a.jpg",
      category: "Tin thường thức ",
    },
    {
      id: 11,
      title: "Khám phụ khoa",
      subtitle: "Khám phụ khoa định kỳ có quan trọng không?",
      image:
        "https://i.pinimg.com/736x/eb/6d/42/eb6d4253eb5d58568572a15a8d79649f.jpg",
      category: "Tin thường thức ",
    },
  ];

  const serviceArticles = [
    {
      id: 12,
      title: "Phòng khám sức khỏe sinh sản - Hồng Phúc",
      category: "Tin dịch vụ",
      date: "08/06/2024",
      image:
        "https://i.pinimg.com/736x/38/36/d9/3836d9090a259143ece1fca9e9ad1406.jpg",
    },
    {
      id: 13,
      title: "Trung tâm hỗ trợ sinh sản IVF TPHCM",
      category: "Tin dịch vụ",
      date: "06/06/2024",
      image:
        "https://i.pinimg.com/736x/05/9b/ac/059bac199052a4c974ef82690d8e4021.jpg",
    },
    {
      id: 14,
      title: "Xét nghiệm HPV và tầm soát ung thư cổ tử cung",
      category: "Tin dịch vụ",
      date: "05/06/2024",
      image:
        "https://i.pinimg.com/736x/5a/04/28/5a04287a9574b72eff9cf090e85fe714.jpg",
    },
    {
      id: 15,
      title: "Tư vấn sức khỏe tiền hôn nhân ",
      category: "Tin dịch vụ",
      date: "04/06/2024",
      image:
        "https://i.pinimg.com/736x/67/aa/fa/67aafad7e6dab629c1ba438f483cc6db.jpg",
    },
    {
      id: 16,
      title: "Địa chỉ phá thai an toàn & tư vấn tâm lý",
      category: "Tin dịch vụ",
      date: "03/06/2024",
      image:
        "https://i.pinimg.com/736x/54/d6/76/54d6769b3ce68365503b419457cbb2e3.jpg",
    },
    {
      id: 17,
      title: "Khám nam khoa – Phòng khám quốc tế Sài Gòn",
      category: "Tin dịch vụ",
      date: "02/06/2024",
      image:
        "https://i.pinimg.com/736x/ac/d8/d2/acd8d2eb1f0fdb9010691d094d8d440b.jpg",
    },
  ];

  const medicalKnowledgeArticles = [
    
    {
      id: 18,
      title: "Bao cao su: cách sử dụng đúng và hiệu quả",
      excerpt:
        "Sử dụng bao cao su đúng cách để tránh mang thai ngoài ý muốn và phòng ngừa bệnh lây truyền qua đường tình dục.",
      category: "Tin thường thức",
      image:
        "https://i.pinimg.com/736x/bc/de/f1/bcdef1234567890abcdef1234567890a.jpg",
      featured: true,
    },
    {
      id: 19,
      title: "Chu kỳ kinh nguyệt và dấu hiệu bất thường",
      excerpt:
        "Hiểu đúng về chu kỳ kinh nguyệt giúp phụ nữ chủ động chăm sóc sức khỏe sinh sản.",
      category: "Tin thường thức",
      image:
        "https://i.pinimg.com/736x/aa/bb/cc/aabbccddeeff00112233445566778899.jpg",
    },
    {
      id: 20,
      title: "Ung thư cổ tử cung: cách phòng và tầm soát sớm",
      excerpt:
        "Phụ nữ nên tầm soát ung thư cổ tử cung định kỳ, đặc biệt từ sau 25 tuổi.",
      category: "Tin thường thức",
      image:
        "https://i.pinimg.com/736x/cc/dd/ee/ccddeeff00112233445566778899aabb.jpg",
    },
    {
      id: 21,
      title: "Xuất tinh sớm ở nam giới: nguyên nhân và điều trị",
      excerpt:
        "Tình trạng xuất tinh sớm ảnh hưởng đến tâm lý và chất lượng tình dục. Điều trị sớm giúp cải thiện đời sống hôn nhân.",
      category: "Tin thường thức",
      image:
        "https://i.pinimg.com/736x/dd/ee/ff/ddeeff11223344556677889900aabbcc.jpg",
    },
  ];

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
      {/* Header */}
      <header className="medpro-all-blog-header">
        <div className="medpro-all-blog-container">
          <div className="medpro-all-blog-header-content">
            <Link to="/blog" className="medpro-all-blog-logo">
              <span className="medpro-all-blog-logo-text">TIN TỨC Y KHOA</span>
            </Link>
            <nav className="medpro-all-blog-main-nav">
              <Link to="/tin-y-te">Tin Y tế </Link>
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
        ]}
      />

      <main className="medpro-all-blog-main">
        <div className="medpro-all-blog-container">
          {/* Featured Section with Sidebar */}
          <div className="medpro-all-blog-featured-section">
            <div className="medpro-all-blog-featured-content-wrapper">
              {/* Featured Article */}
              <article className="medpro-all-blog-featured-article">
                <div className="medpro-all-blog-featured-background">
                  <img
                    src="https://i.pinimg.com/736x/eb/c0/cd/ebc0cd83863f421e49e17f30bc778065.jpg"
                    alt={featuredArticle.title}
                    width={800}
                    height={400}
                    className="medpro-all-blog-featured-bg-image"
                  />
                </div>
                <div className="medpro-all-blog-featured-text-content">
                  <h2 className="medpro-all-blog-featured-subtitle">
                    {featuredArticle.title}
                  </h2>
                  <p className="medpro-all-blog-featured-excerpt">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="medpro-all-blog-featured-meta">
                    <span className="medpro-all-blog-featured-date">
                      {featuredArticle.date} - {featuredArticle.author}
                    </span>
                  </div>
                  <Link to="#" className="medpro-all-blog-read-more-link">
                    Xem tiếp →
                  </Link>
                </div>
              </article>

              {/* Bottom Featured Cards */}
              <div className="medpro-all-blog-bottom-featured-cards">
                {bottomFeaturedCards.map((card) => (
                  <article
                    key={card.id}
                    className="medpro-all-blog-bottom-card"
                  >
                    <div className="medpro-all-blog-bottom-card-image">
                      <img
                        src={card.image || "/placeholder.svg"}
                        alt={card.title}
                        width={280}
                        height={180}
                        className="medpro-all-blog-card-image"
                      />
                      <div className="medpro-all-blog-card-overlay">
                        <h3 className="medpro-all-blog-card-title">
                          {card.title}
                        </h3>
                        <h4 className="medpro-all-blog-card-subtitle">
                          {card.subtitle}
                        </h4>
                        <p className="medpro-all-blog-card-description">
                          {card.description}
                        </p>
                        <Link to="#" className="medpro-all-blog-card-link">
                          Xem tiếp →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="medpro-all-blog-sidebar">
              <div className="medpro-all-blog-sidebar-content">
                {sidebarArticles.map((article) => (
                  <article
                    key={article.id}
                    className="medpro-all-blog-sidebar-article"
                  >
                    <div className="medpro-all-blog-sidebar-image">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={80}
                        height={60}
                        className="medpro-all-blog-sidebar-article-image"
                      />
                    </div>
                    <div className="medpro-all-blog-sidebar-text">
                      <span className="medpro-all-blog-sidebar-category">
                        {article.category}
                      </span>
                      <h4 className="medpro-all-blog-sidebar-title">
                        {article.title}
                      </h4>
                      <span className="medpro-all-blog-sidebar-date">
                        {article.date}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>

          {/* Main Content Sections */}
          <div className="medpro-all-blog-main-sections">
            {/* Service Section */}
            <section className="medpro-all-blog-service-section">
              <h2 className="medpro-all-blog-section-title">Tin dịch vụ</h2>
              <div className="medpro-all-blog-service-slider">
                <button
                  className="medpro-all-blog-slider-btn medpro-all-blog-prev"
                  onClick={prevServiceSlide}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="medpro-all-blog-service-cards">
                  {serviceArticles
                    .slice(
                      currentServiceSlide * 3,
                      (currentServiceSlide + 1) * 3
                    )
                    .map((article) => (
                      <article
                        key={article.id}
                        className="medpro-all-blog-service-card"
                      >
                        <div className="medpro-all-blog-service-card-image">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            width={250}
                            height={160}
                            className="medpro-all-blog-service-image"
                          />
                        </div>
                        <div className="medpro-all-blog-service-card-content">
                          <span className="medpro-all-blog-service-category">
                            {article.category}
                          </span>
                          <h3 className="medpro-all-blog-service-title">
                            {article.title}
                          </h3>
                          <span className="medpro-all-blog-service-date">
                            {article.date}
                          </span>
                          <Link to="#" className="medpro-all-blog-service-link">
                            Xem tiếp →
                          </Link>
                        </div>
                      </article>
                    ))}
                </div>
                <button
                  className="medpro-all-blog-slider-btn medpro-all-blog-next"
                  onClick={nextServiceSlide}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="medpro-all-blog-view-all-section">
                <Link to="#" className="medpro-all-blog-view-all-btn">
                  Xem tất cả →
                </Link>
              </div>
            </section>

            {/* Medical Knowledge Section */}
            <section className="medpro-all-blog-medical-knowledge-section">
              <h2 className="medpro-all-blog-section-title">
                Y học thường thức
              </h2>
              <div className="medpro-all-blog-knowledge-layout">
                {/* Featured Medical Knowledge Article */}
                <article className="medpro-all-blog-knowledge-featured">
                  <div className="medpro-all-blog-knowledge-featured-image">
                    <img
                      src="https://i.pinimg.com/736x/01/d2/d9/01d2d9871c0218efff371def8f020418.jpg"
                      alt="Các biện pháp tránh thai hiện đại"
                      width={400}
                      height={300}
                      className="medpro-all-blog-knowledge-bg-image"
                    />
                    <div className="medpro-all-blog-knowledge-overlay">
                      <span className="medpro-all-blog-knowledge-category">
                        Tin thường thức
                      </span>
                      <h3 className="medpro-all-blog-knowledge-featured-title">
                        Các biện pháp tránh thai hiện đại và hiệu quả
                      </h3>
                      <p className="medpro-all-blog-knowledge-featured-excerpt">
                        Bạn đang phân vân lựa chọn biện pháp tránh thai phù hợp?
                        Bài viết sẽ giúp bạn hiểu rõ ưu và nhược điểm của từng
                        phương pháp để bảo vệ sức khỏe sinh sản.
                      </p>
                      <Link to="#" className="medpro-all-blog-knowledge-link">
                        Xem tiếp →
                      </Link>
                    </div>
                  </div>
                </article>

                {/* Medical Knowledge Cards */}
                <div className="medpro-all-blog-knowledge-cards">
                  {medicalKnowledgeArticles
                    .filter((article) => !article.featured)
                    .slice(0, 3)
                    .map((article) => (
                      <article
                        key={article.id}
                        className="medpro-all-blog-knowledge-card"
                      >
                        <div className="medpro-all-blog-knowledge-card-content">
                          <span className="medpro-all-blog-knowledge-card-category">
                            {article.category}
                          </span>
                          <h4 className="medpro-all-blog-knowledge-card-title">
                            {article.title}
                          </h4>
                          <p className="medpro-all-blog-knowledge-card-excerpt">
                            {article.excerpt}
                          </p>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
              <div className="medpro-all-blog-view-all-section">
                <Link to="#" className="medpro-all-blog-view-all-btn">
                  Xem tất cả →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllBlog;
