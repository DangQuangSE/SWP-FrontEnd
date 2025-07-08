import React from "react";
import { Modal, Form, Input, Select } from "antd";

const BlogModal = ({
  visible,
  onOk,
  onCancel,
  form,
  editingArticle,
  tagOptions = [],
}) => {
  return (
    <Modal
      title={editingArticle ? "Chỉnh sửa bài đăng" : "Tạo bài đăng mới"}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={800}
      okText={editingArticle ? "Cập nhật" : "Tạo bài đăng"}
      cancelText="Hủy"
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề!" },
            { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung!" },
            { min: 50, message: "Nội dung phải có ít nhất 50 ký tự!" },
          ]}
        >
          <Input.TextArea rows={8} placeholder="Nhập nội dung bài viết..." />
        </Form.Item>
        <Form.Item name="tags" label="Chủ đề">
          <Select
            mode="multiple"
            placeholder="Chọn chủ đề"
            options={tagOptions}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái bài viết">
            <Select.Option value="DRAFT"> Bản nháp</Select.Option>
            <Select.Option value="PENDING">⏳ Chờ duyệt</Select.Option>
            <Select.Option value="APPROVED">Đã duyệt</Select.Option>
            <Select.Option value="PUBLISHED">🌐 Đã đăng</Select.Option>
            <Select.Option value="REJECTED"> Bị từ chối</Select.Option>
            <Select.Option value="ARCHIVED">📦 Đã lưu trữ</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogModal;
