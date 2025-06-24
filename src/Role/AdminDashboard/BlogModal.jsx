import React from "react";
import { Modal, Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const BlogModal = ({
  visible,
  onOk,
  onCancel,
  form,
  editingArticle,
  imageUrl,
  handleUpload,
}) => {
  return (
    <Modal
      title={editingArticle ? "Edit Blog Article" : "Create Blog Article"}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Article Title"
          rules={[{ required: true, message: "Please input article title!" }]}
        >
          <Input placeholder="Enter article title" />
        </Form.Item>
        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please input author name!" }]}
        >
          <Input placeholder="Enter author name" />
        </Form.Item>
        <Form.Item name="content" label="Content">
          <Input.TextArea rows={8} placeholder="Enter article content" />
        </Form.Item>
        <Form.Item label="Featured Image" name="image_url">
          <Upload
            customRequest={({ file, onSuccess }) => {
              handleUpload(file).then(() => onSuccess("ok"));
            }}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              style={{ width: 120, marginTop: 8 }}
            />
          )}
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select placeholder="Select status">
            <Option value="Published">Published</Option>
            <Option value="Draft">Draft</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogModal;
