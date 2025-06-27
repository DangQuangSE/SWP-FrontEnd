import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
  Space,
  Popconfirm,
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import {
  fetchBlogs,
  fetchBlogDetail,
  createBlog,
  likeBlog,
  deleteBlog,
  uploadImage,
} from "../../../../api/consultantAPI";
import "./WriteBlogs.css";

const WriteBlogs = ({ userId, selectedTab }) => {
  // Form instances
  const [createBlogForm] = Form.useForm();
  const [editBlogForm] = Form.useForm();
  const [tagForm] = Form.useForm();

  // State
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState({});
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateBlogModalVisible, setIsCreateBlogModalVisible] =
    useState(false);
  const [isEditBlogModalVisible, setIsEditBlogModalVisible] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [createBlogLoading, setCreateBlogLoading] = useState(false);

  // Tag state
  const [tagOptions, setTagOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  // Load blogs
  const loadBlogs = async (page = 0, size = 10) => {
    setLoadingBlogs(true);
    try {
      console.log("Loading blogs with pagination:", { page, size });
      const res = await fetchBlogs(page, size);
      console.log("Blogs API response:", res.data);

      const blogData = res.data?.content || res.data || [];
      const processedBlogs = blogData.map((blog) => ({
        ...blog,
        id: blog.id || blog.blog_id,
        createdAt: blog.createdAt
          ? new Date(blog.createdAt).toLocaleString("vi-VN")
          : "Không có",
        updatedAt: blog.updatedAt
          ? new Date(blog.updatedAt).toLocaleString("vi-VN")
          : "Không có",
        author: blog.author || { fullname: "Không có tác giả" },
        tags: Array.isArray(blog.tags) ? blog.tags : [],
      }));

      setBlogs(processedBlogs);
      console.log("Processed blogs:", processedBlogs);
    } catch (error) {
      console.error("Error loading blogs:", error);
      toast.error(
        `Không thể tải danh sách blog: ${error.message || "Lỗi không xác định"}`
      );
      setBlogs([]);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Load tags
  const loadTags = async () => {
    try {
      const res = await axios.get("/api/tags");
      setTagOptions(
        (res.data || []).map((tag) => ({
          label: tag.name,
          value: tag.id,
        }))
      );
      setTags(res.data || []);
    } catch {
      setTagOptions([]);
      setTags([]);
    }
  };

  // Filter blogs by tag
  const handleFilterByTag = async (tagId) => {
    setSelectedTag(tagId);
    if (!tagId) {
      loadBlogs();
      return;
    }
    try {
      console.log("Filtering blogs by tag:", tagId);
      const res = await axios.get(`/api/blog/by-tag/${tagId}`);
      console.log("Filter by tag response:", res.data);

      const blogData = res.data?.content || res.data || [];
      const processedBlogs = blogData.map((blog) => ({
        ...blog,
        id: blog.id || blog.blog_id,
        createdAt: blog.createdAt
          ? new Date(blog.createdAt).toLocaleString("vi-VN")
          : "Không có",
        updatedAt: blog.updatedAt
          ? new Date(blog.updatedAt).toLocaleString("vi-VN")
          : "Không có",
        author: blog.author || { fullname: "Không có tác giả" },
        tags: Array.isArray(blog.tags) ? blog.tags : [],
      }));

      setBlogs(processedBlogs);
    } catch (error) {
      console.error("Error filtering blogs by tag:", error);
      toast.error("Không thể lọc blog theo chủ đề");
      setBlogs([]);
    }
  };

  // Fetch blog detail
  const handleFetchBlogDetail = async (id) => {
    if (!id) {
      toast.error("ID blog không hợp lệ");
      return;
    }

    try {
      console.log("Fetching blog detail for ID:", id);
      const res = await fetchBlogDetail(id);
      console.log("Blog detail response:", res.data);

      const blog = res.data || {};

      const processedBlog = {
        id: blog.id ?? "Không có",
        title: blog.title ?? "Không có tiêu đề",
        author: {
          fullname: blog.author?.fullname ?? "Không có tác giả",
          id: blog.author?.id ?? null,
          email: blog.author?.email ?? "",
          imageUrl: blog.author?.imageUrl ?? "",
          role: blog.author?.role ?? "",
        },
        createdAt: blog.createdAt
          ? new Date(blog.createdAt).toLocaleString("vi-VN")
          : "Không có",
        updatedAt: blog.updatedAt
          ? new Date(blog.updatedAt).toLocaleString("vi-VN")
          : "Không có",
        viewCount: blog.viewCount ?? 0,
        likeCount: blog.likeCount ?? 0,
        status: blog.status ?? "Không có",
        imgUrl: blog.imgUrl ?? "",
        content: blog.content ?? "Không có nội dung",
        tags: Array.isArray(blog.tags) ? blog.tags : [],
      };

      setSelectedBlog(processedBlog);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      toast.error(
        `Không thể tải chi tiết blog: ${error.message || "Lỗi không xác định"}`
      );

      setSelectedBlog({
        id: "Không có",
        title: "Lỗi tải dữ liệu",
        author: { fullname: "Không có" },
        createdAt: "Không có",
        updatedAt: "Không có",
        viewCount: 0,
        likeCount: 0,
        status: "Không có",
        imgUrl: "",
        content: "Không thể tải nội dung blog",
        tags: [],
      });
      setIsDetailModalVisible(true);
    }
  };

  // Create blog
  const handleCreateBlog = async () => {
    if (!userId) {
      toast.error("Không tìm thấy userId. Vui lòng đăng nhập lại!");
      return;
    }

    setCreateBlogLoading(true);
    try {
      const values = await createBlogForm.validateFields();
      console.log("Creating blog with values:", values);

      // Get image file if exists
      const fileInput = document.querySelector('input[type="file"]');
      const imgFile = fileInput?.files[0] || null;

      console.log("Image file:", imgFile);

      const blogData = {
        title: values.title,
        content: values.content,
        status: values.status || "PUBLISHED",
        imgFile: imgFile,
        tags: values.tags || [],
      };

      console.log("Blog data to send:", blogData);

      const response = await createBlog(blogData);
      console.log("Create blog response:", response);

      // Close modal and reset form
      setIsCreateBlogModalVisible(false);
      createBlogForm.resetFields();

      // Clear file input
      if (fileInput) {
        fileInput.value = "";
      }

      // Reload blogs list
      await loadBlogs();

      toast.success("Tạo blog thành công!");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(
        `Tạo blog thất bại: ${error.message || "Lỗi không xác định"}`
      );
    } finally {
      setCreateBlogLoading(false);
    }
  };

  // Edit blog
  const handleEditBlog = async () => {
    const values = await editBlogForm.validateFields();
    try {
      await axios.put(`/api/blog/${editingBlogId}`, {
        ...values,
        tags: values.tags,
      });
      setIsEditBlogModalVisible(false);
      loadBlogs();
      toast.success("Cập nhật blog thành công!");
    } catch {
      toast.error("Cập nhật blog thất bại");
    }
  };

  // Delete blog
  const handleDeleteBlog = async (blogId) => {
    if (!blogId) return;
    try {
      await deleteBlog(blogId);
      toast.success("Xóa blog thành công!");
      loadBlogs();
    } catch {
      toast.error("Chức năng xóa blog chưa được hỗ trợ hoặc đã xảy ra lỗi.");
    }
  };

  // Like blog
  const handleLikeBlog = async (id) => {
    if (!id) return;
    try {
      await likeBlog(id);
      loadBlogs();
      toast.success("Đã thích blog!");
    } catch {
      toast.error("Không thể thả tim");
    }
  };

  // Upload image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const res = await uploadImage(file);
      createBlogForm.setFieldsValue({ imgUrl: res.data.secure_url });
      toast.success("Upload ảnh thành công!");
    } catch {
      toast.error("Upload ảnh thất bại");
    } finally {
      setImageUploading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === "write_blogs") {
      loadBlogs();
      loadTags();
    } else if (selectedTab === "manage_tags") {
      loadTags();
    }
  }, [selectedTab, userId]);

  // Blog columns for table
  const blogColumns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Lượt xem", dataIndex: "viewCount", key: "viewCount" },
    { title: "Lượt thích", dataIndex: "likeCount", key: "likeCount" },
    {
      title: "Chủ đề",
      dataIndex: "tags",
      key: "tags",
      render: (tags) =>
        tags && tags.length
          ? tags.map((tag) => (
              <Tag key={tag.id || tag} color="blue">
                {tag.name || tag}
              </Tag>
            ))
          : "Không có",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => handleFetchBlogDetail(record.id)}
            size="small"
            type="default"
          >
            Xem chi tiết
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              editBlogForm.setFieldsValue({
                title: record.title,
                content: record.content,
                tags: record.tags?.map((tag) => tag.id),
                status: record.status,
              });
              setIsEditBlogModalVisible(true);
              setEditingBlogId(record.id);
            }}
          >
            Sửa
          </Button>
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={() => handleLikeBlog(record.id)}
          >
            Thích
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDeleteBlog(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Tag columns for table
  const tagColumns = [
    { title: "Tên chủ đề", dataIndex: "name", key: "name" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingTag(record);
              tagForm.setFieldsValue({ name: record.name });
              setIsTagModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa chủ đề này?"
            onConfirm={async () => {
              await axios.delete(`/api/tags/${record.id}`);
              loadTags();
              toast.success("Xóa chủ đề thành công!");
            }}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (selectedTab === "write_blogs") {
    return (
      <div>
        <Select
          allowClear
          placeholder="Lọc theo chủ đề"
          style={{ width: 200, marginBottom: 16, marginRight: 16 }}
          options={tagOptions}
          value={selectedTag}
          onChange={handleFilterByTag}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 16 }}
          onClick={() => setIsCreateBlogModalVisible(true)}
        >
          Tạo Blog mới
        </Button>
        <Table
          columns={blogColumns}
          dataSource={blogs}
          loading={loadingBlogs}
          rowKey="id"
          pagination={false}
        />

        {/* Modal tạo blog mới */}
        <Modal
          title="Tạo bài đăng mới"
          open={isCreateBlogModalVisible}
          onOk={handleCreateBlog}
          onCancel={() => {
            if (!createBlogLoading) {
              setIsCreateBlogModalVisible(false);
              createBlogForm.resetFields();
            }
          }}
          okText="Tạo bài đăng"
          cancelText="Hủy"
          width={800}
          confirmLoading={createBlogLoading || imageUploading}
          maskClosable={!createBlogLoading}
        >
          <Form form={createBlogForm} layout="vertical">
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
              <Input.TextArea
                rows={8}
                placeholder="Nhập nội dung bài viết..."
              />
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
              initialValue="PUBLISHED"
            >
              <Select>
                <Select.Option value="PUBLISHED">Xuất bản</Select.Option>
                <Select.Option value="DRAFT">Bản nháp</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Ảnh đại diện">
              <input
                id="blog-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: 8 }}
                disabled={createBlogLoading}
              />
              {imageUploading && <div>Đang tải ảnh...</div>}
              <div style={{ fontSize: "12px", color: "#666", marginTop: 4 }}>
                Chọn ảnh đại diện cho bài viết (tùy chọn)
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chỉnh sửa blog */}
        <Modal
          title="Chỉnh sửa bài đăng"
          open={isEditBlogModalVisible}
          onOk={handleEditBlog}
          onCancel={() => {
            setIsEditBlogModalVisible(false);
            editBlogForm.resetFields();
          }}
          okText="Cập nhật"
          cancelText="Hủy"
          width={800}
        >
          <Form form={editBlogForm} layout="vertical">
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
              <Input.TextArea
                rows={8}
                placeholder="Nhập nội dung bài viết..."
              />
            </Form.Item>

            <Form.Item name="tags" label="Chủ đề">
              <Select
                mode="multiple"
                placeholder="Chọn chủ đề"
                options={tagOptions}
                allowClear
              />
            </Form.Item>

            <Form.Item name="status" label="Trạng thái">
              <Select>
                <Select.Option value="PUBLISHED">Xuất bản</Select.Option>
                <Select.Option value="DRAFT">Bản nháp</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chi tiết blog */}
        <Modal
          title={selectedBlog?.title || "Chi tiết bài viết"}
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedBlog && Object.keys(selectedBlog).length > 0 ? (
            <div>
              <div style={{ marginBottom: 12 }}>
                <b>ID:</b> {selectedBlog.id}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Tiêu đề:</b> {selectedBlog.title}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Tác giả:</b> {selectedBlog.author?.fullname}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Ngày tạo:</b> {selectedBlog.createdAt}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Ngày cập nhật:</b> {selectedBlog.updatedAt}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Lượt xem:</b> {selectedBlog.viewCount} | <b>Lượt thích:</b>{" "}
                {selectedBlog.likeCount}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Trạng thái:</b> {selectedBlog.status}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Chủ đề:</b>{" "}
                {selectedBlog.tags && selectedBlog.tags.length
                  ? selectedBlog.tags.map((tag) => tag.name || tag).join(", ")
                  : "Không có"}
              </div>
              {selectedBlog.imgUrl ? (
                <div style={{ marginBottom: 12 }}>
                  <b>Ảnh blog:</b>
                  <br />
                  <img
                    src={selectedBlog.imgUrl}
                    alt="blog"
                    style={{
                      maxWidth: "100%",
                      marginTop: 4,
                      marginBottom: 12,
                    }}
                  />
                </div>
              ) : null}
              <div style={{ marginBottom: 12 }}>
                <b>Nội dung:</b>
                <br />
                <div style={{ whiteSpace: "pre-line" }}>
                  {selectedBlog.content}
                </div>
              </div>
            </div>
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </Modal>
      </div>
    );
  }

  if (selectedTab === "manage_tags") {
    return (
      <div>
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => {
            setEditingTag(null);
            tagForm.resetFields();
            setIsTagModalVisible(true);
          }}
        >
          Thêm chủ đề
        </Button>
        <Table
          dataSource={tags}
          rowKey="id"
          columns={tagColumns}
          pagination={false}
        />

        {/* Modal quản lý tag */}
        <Modal
          title={editingTag ? "Sửa chủ đề" : "Thêm chủ đề"}
          open={isTagModalVisible}
          onOk={async () => {
            const values = await tagForm.validateFields();
            if (editingTag) {
              await axios.put(`/api/tags/${editingTag.id}`, values);
            } else {
              await axios.post("/api/tags", values);
            }
            setIsTagModalVisible(false);
            loadTags();
            toast.success(
              editingTag
                ? "Cập nhật chủ đề thành công!"
                : "Thêm chủ đề thành công!"
            );
          }}
          onCancel={() => setIsTagModalVisible(false)}
        >
          <Form
            form={tagForm}
            layout="vertical"
            initialValues={editingTag || {}}
          >
            <Form.Item
              name="name"
              label="Tên chủ đề"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  return <div>Chọn tab để bắt đầu</div>;
};

export default WriteBlogs;
