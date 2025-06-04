import React, { useState, useEffect } from 'react';
import './Articles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4; // For sidebar articles

  // Sample article data
  useEffect(() => {
    const sampleArticles = [
      {
        id: 1,
        title: 'Điều gì xảy ra khi bạn quên hạ trinh sau khi sinh và tháng hậu sản chấp dứt',
        excerpt: 'Nhiều phụ nữ lo lắng về việc quên hạ trinh sau khi sinh và những ảnh hưởng có thể xảy ra. Đây là một vấn đề quan trọng cần được tư vấn kỹ lưỡng...',
        image: '/placeholder.svg?height=400&width=600',
        category: 'health',
        author: {
          name: 'Dr. Trần Thanh',
          avatar: '/placeholder.svg?height=50&width=50'
        },
        date: '15/05/2023',
        featured: true
      },
      {
        id: 2,
        title: 'Bệnh viêm nhiễm phụ khoa: nguyên nhân và cách phòng tránh',
        excerpt: 'Viêm nhiễm phụ khoa là một trong những vấn đề phổ biến...',
        image: '/placeholder.svg?height=200&width=300',
        category: 'prevention',
        author: {
          name: 'Dr. Nguyễn Minh',
          avatar: '/placeholder.svg?height=50&width=50'
        },
        date: '20/04/2023'
      },
      {
        id: 3,
        title: 'Những điều cần biết về sức khỏe sinh sản nam giới',
        excerpt: 'Sức khỏe sinh sản nam giới là vấn đề quan trọng...',
        image: '/placeholder.svg?height=200&width=300',
        category: 'men',
        author: {
          name: 'Dr. Lê Hùng',
          avatar: '/placeholder.svg?height=50&width=50'
        },
        date: '05/03/2023'
      },
      {
        id: 4,
        title: 'Phương pháp mang thai an toàn và khỏe mạnh',
        excerpt: 'Mang thai là giai đoạn quan trọng trong cuộc đời...',
        image: '/placeholder.svg?height=200&width=300',
        category: 'pregnancy',
        author: {
          name: 'Dr. Phạm Thảo',
          avatar: '/placeholder.svg?height=50&width=50'
        },
        date: '10/02/2023'
      },
      {
        id: 5,
        title: 'Các biện pháp tránh thai hiện đại và hiệu quả',
        excerpt: 'Tránh thai là một phần quan trọng trong kế hoạch...',
        image: '/placeholder.svg?height=200&width=300',
        category: 'prevention',
        author: {
          name: 'Dr. Hoàng Anh',
          avatar: '/placeholder.svg?height=50&width=50'
        },
        date: '25/01/2023'
      }
    ];
    
    setArticles(sampleArticles);
  }, []);

  // Filter articles by category
  const filteredArticles = activeFilter === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeFilter);

  // Get featured article
  const featuredArticle = filteredArticles.find(article => article.featured);
  
  // Get sidebar articles (excluding featured)
  const sidebarArticles = featuredArticle 
    ? filteredArticles.filter(article => article.id !== featuredArticle.id)
    : filteredArticles;
  
  // Get current sidebar articles for pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentSidebarArticles = sidebarArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  
  // Calculate total pages for sidebar
  const totalPages = Math.ceil(sidebarArticles.length / articlesPerPage);

  return (
    <section className="articles section">
      <div className="container">
        {/* Filter Tabs */}
        <div className="article-filters">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Tất cả bài viết
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'health' ? 'active' : ''}`}
            onClick={() => setActiveFilter('health')}
          >
            Sức khỏe chung
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'prevention' ? 'active' : ''}`}
            onClick={() => setActiveFilter('prevention')}
          >
            Phòng ngừa
          </button>
        </div>

        {/* Blog Layout */}
        <div className="blog-layout">
          {/* Featured Article */}
          {featuredArticle && (
            <div className="featured-article">
              <div className="featured-image">
                <img src={featuredArticle.image || "/placeholder.svg"} alt={featuredArticle.title} />
              </div>
              <div className="featured-content">
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt}</p>
                <div className="article-meta">
                  <div className="article-author">
                    <img src={featuredArticle.author.avatar || "/placeholder.svg"} alt={featuredArticle.author.name} />
                    <span>{featuredArticle.author.name}</span>
                  </div>
                  <div className="article-date">{featuredArticle.date}</div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Articles */}
          <div className="sidebar-articles">
            {currentSidebarArticles.map(article => (
              <div key={article.id} className="sidebar-article">
                <div className="sidebar-article-image">
                  <img src={article.image || "/placeholder.svg"} alt={article.title} />
                </div>
                <div className="sidebar-article-content">
                  <h3>{article.title}</h3>
                  <div className="article-meta">
                    <div className="article-author">
                      <img src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                      <span>{article.author.name}</span>
                    </div>
                    <div className="article-date">{article.date}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination for sidebar */}
            {totalPages > 1 && (
              <div className="sidebar-pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-dot ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                    aria-label={`Page ${index + 1}`}
                  >
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;
