import React from 'react';
import { Card, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './WriteBlogs.css';

const WriteBlogs = ({ setIsCreateBlogModalVisible, blogColumns, blogs, loadingBlogs }) => {
  return (
    <Card
      title="Viết bài đăng"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateBlogModalVisible(true)}
        >
          Tạo bài đăng mới
        </Button>
      }
    >
      <Table
        columns={blogColumns}
        dataSource={blogs}
        rowKey="id"
        loading={loadingBlogs}
      />
    </Card>
  );
};

export default WriteBlogs; 