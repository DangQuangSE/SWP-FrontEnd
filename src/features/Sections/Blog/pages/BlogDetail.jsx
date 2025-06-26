import React from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { sampleArticles } from "./SampleArticles/SampleArticles";
import RelatedArticlesSection from "../components/RelatedArticlesSection";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const article = sampleArticles.find((item) => item.id.toString() === id);

  // Filter out the current article from related articles
  const relatedArticles = sampleArticles.filter(
    (item) => item.id.toString() !== id
  );

  if (!article) {
    return (
      <div className="blog-detail-page-wrapper">
        <div className="top-header-container">
          <div className="breadcrumbs">  
          </div>
        </div>
        <div className="slogan-section">
          <h1 className="slogan-title">TRUNG TÂM NỘI SOI TIÊU HÓA DOCTOR CHECK</h1>
          <p className="slogan-text">
            "Vì một Việt Nam nói không với ung thư dạ dày & đại tràng"
          </p>
        </div>
        <div className="blog-detail-container">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-500 mb-4">Bài viết không tồn tại.</h2>
            <Link to="/blog" className="back-button">
              Quay lại danh sách bài viết
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page-wrapper">
      <div className="slogan-section">
        <h1 className="slogan-title">CHĂM SÓC SỨC KHỎE GIỚI TÍNH SHEALTHCARE</h1>
        <p className="slogan-text">
          "Vì sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi"
        </p>
      </div>
      <div className="blog-detail-container">
        <article>
          <header className="blog-header">
            <img
              src={article.image}
              alt={article.title}
              className="blog-image"
            />
            <h1 className="blog-title">{article.title}</h1>
            <div className="blog-meta">
              {article.author.avatar && (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="author-avatar"
                />
              )}
              <span className="font-medium">{article.author.name}</span>
              <span className="mx-2">•</span>
              <span>
                {article.date}
              </span>
            </div>
          </header>

          <div className="blog-content">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </div>
      <RelatedArticlesSection articles={relatedArticles} />
    </div>
  );
};

export default BlogDetail;
