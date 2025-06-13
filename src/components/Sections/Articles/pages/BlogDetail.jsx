import React from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();

  // ❗ Tạm thời dùng dữ liệu mẫu giống bên Articles.jsx
  const sampleArticles = [
    {
      id: 1,
      title: 'Điều gì xảy ra khi bạn quên hạ trinh sau khi sinh và tháng hậu sản chấp dứt',
      content: 'Đây là nội dung chi tiết của bài viết về hạ trinh...',
      image: 'https://i.pinimg.com/736x/41/37/30/413730c203226a65b5a72ec505b2399d.jpg',
      author: { name: 'Dr. Trần Thanh', avatar: '/placeholder.svg' },
      date: '15/05/2023',
    },
    {
      id: 2,
      title: 'Bệnh viêm nhiễm phụ khoa: nguyên nhân và cách phòng tránh',
      content: 'Nội dung chi tiết bài viết viêm nhiễm phụ khoa...',
      image: 'https://i.pinimg.com/736x/4b/5b/6f/4b5b6f26df0b61b28266ebf2605eae93.jpg',
      author: { name: 'Dr. Nguyễn Minh', avatar: '/placeholder.svg' },
      date: '20/04/2023',
    },
    // thêm các bài khác nếu cần
  ];

  const article = sampleArticles.find((item) => item.id.toString() === id);

  if (!article) {
    return <p>Bài viết không tồn tại.</p>;
  }

  return (
    <div className="blog-detail">
      <img src={article.image} alt={article.title} />
      <h1>{article.title}</h1>
      <div className="article-meta">
        <img src={article.author.avatar} alt={article.author.name} />
        <span>{article.author.name}</span> | <span>{article.date}</span>
      </div>
      <p>{article.content}</p>
    </div>
  );
};

export default BlogDetail;
