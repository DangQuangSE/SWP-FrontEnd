import React, { useState, useEffect } from 'react';
import './Articles.css';
import { Link } from 'react-router-dom'; // 👈 để điều hướng tới chi tiết blog

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;

  useEffect(() => {
    const sampleArticles = [
      {
        id: 1,
        title: 'Điều gì xảy ra khi bạn quên hạ trinh sau khi sinh và tháng hậu sản chấp dứt',
        excerpt: 'Nhiều phụ nữ lo lắng về việc quên hạ trinh sau khi sinh...',
        image: 'https://i.pinimg.com/736x/41/37/30/413730c203226a65b5a72ec505b2399d.jpg',
        category: 'health',
        author: { name: 'Dr. Trần Thanh', avatar: '/placeholder.svg' },
        date: '15/05/2023',
        featured: true
      },
      {
        id: 2,
        title: 'Bệnh viêm nhiễm phụ khoa: nguyên nhân và cách phòng tránh',
        excerpt: 'Viêm nhiễm phụ khoa là một trong những vấn đề phổ biến...',
        image: 'https://i.pinimg.com/736x/4b/5b/6f/4b5b6f26df0b61b28266ebf2605eae93.jpg',
        category: 'prevention',
        author: { name: 'Dr. Nguyễn Minh', avatar: '/placeholder.svg' },
        date: '20/04/2023'
      },
      {
        id: 3,
        title: 'Những điều cần biết về sức khỏe sinh sản nam giới',
        excerpt: 'Sức khỏe sinh sản nam giới là vấn đề quan trọng...',
        image: 'https://i.pinimg.com/736x/08/89/51/088951e1a9cbf9ab9b12ebd7be30f0f9.jpg',
        category: 'men',
        author: { name: 'Dr. Lê Hùng', avatar: '/placeholder.svg' },
        date: '05/03/2023'
      },
      {
        id: 4,
        title: 'Phương pháp mang thai an toàn và khỏe mạnh',
        excerpt: 'Mang thai là giai đoạn quan trọng trong cuộc đời...',
        image: 'https://i.pinimg.com/736x/b9/6a/9e/b96a9ec59995fbc5d0967ac34861d383.jpg',
        category: 'pregnancy',
        author: { name: 'Dr. Phạm Thảo', avatar: '/placeholder.svg' },
        date: '10/02/2023'
      },
      {
        id: 5,
        title: 'Các biện pháp tránh thai hiện đại và hiệu quả',
        excerpt: 'Tránh thai là một phần quan trọng trong kế hoạch...',
        image: 'https://i.pinimg.com/736x/ca/9b/04/ca9b048a774ec168de6a4ff488c5ac2f.jpg',
        category: 'prevention',
        author: { name: 'Dr. Hoàng Anh', avatar: '/placeholder.svg' },
        date: '25/01/2023'
      }
    ];
    setArticles(sampleArticles);
  localStorage.setItem('allArticles', JSON.stringify(sampleArticles)); // 👈 Lưu vào localStorage để dùng ở BlogDetail
  }, []);

  const featuredArticle = articles.find(article => article.featured);
  const sidebarArticles = featuredArticle ? articles.filter(a => a.id !== featuredArticle.id) : articles;

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentSidebarArticles = sidebarArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const totalPages = Math.ceil(sidebarArticles.length / articlesPerPage);

  return (
    <section className="articles section">
      <div className="container">
        <div className="blog-layout">
          {/* Featured Article */}
          {featuredArticle && (
            <Link to={`/blog/${featuredArticle.id}`} className="featured-article">
              <div className="featured-image">
                <img src={featuredArticle.image} alt={featuredArticle.title} />
              </div>
              <div className="featured-content">
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt}</p>
                <div className="article-meta">
                  <div className="article-author">
                    <img src={featuredArticle.author.avatar} alt={featuredArticle.author.name} />
                    <span>{featuredArticle.author.name}</span>
                  </div>
                  <div className="article-date">{featuredArticle.date}</div>
                </div>
              </div>
            </Link>
          )}

          {/* Sidebar Articles */}
          <div className="sidebar-articles">
            {currentSidebarArticles.map(article => (
              <Link to={`/blog/${article.id}`} key={article.id} className="sidebar-article">
                <div className="sidebar-article-image">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="sidebar-article-content">
                  <h3>{article.title}</h3>
                  <div className="article-meta">
                    <div className="article-author">
                      <img src={article.author.avatar} alt={article.author.name} />
                      <span>{article.author.name}</span>
                    </div>
                    <div className="article-date">{article.date}</div>
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
                    className={`pagination-dot ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  ></button>
                ))}
              </div>
            )}

            <div className="see-all-button-blog">
              <Link to="/blog" className="view-all-link-blog">Xem tất cả bài viết</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;
