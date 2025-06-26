import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sampleArticles } from "../pages/SampleArticles/SampleArticles";

const RelatedArticlesSection = ({ articles }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3; // Display 3 articles per page

  // Calculate the articles to display on the current page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Calculate total pages
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!articles || articles.length === 0) {
    return null; // Don't render if no articles are provided
  }

  return (
    <div className="related-articles-section">
      <div className="related-articles-header">
        <h2 className="related-articles-title">Tin liên quan</h2>
        <div className="related-articles-divider"></div>
      </div>
      <div className="articles-grid">
        {currentArticles.map((article) => (
          <Link to={`/blog/${article.id}`} key={article.id} className="article-card">
            <div className="article-card-image-wrapper">
              <img src={article.image} alt={article.title} className="article-card-image" />
            </div>
            <div className="article-card-content">
              <div className="article-category">Tin y tế</div>
              <h3 className="article-card-title">{article.title}</h3>
              <div className="article-card-meta">
                <img src="/assets/icons/calendar-icon.svg" alt="date" className="inline-block w-4 h-4 mr-1" />
                <span>{article.date}</span>
                <span>-</span>
                <span>{article.author.name}</span>
              </div>
              <span className="read-more-link">
                Xem tiếp →
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination-container">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={currentPage === number + 1 ? "pagination-button active" : "pagination-button"}
          >
            {number + 1}
          </button>
        ))}
      </div>
      <div className="view-all-button-container">
        <Link to="/blog" className="view-all-button">
          Xem tất cả
          »
        </Link>
      </div>
    </div>
  );
};

export default RelatedArticlesSection; 