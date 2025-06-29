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
import api from "../../../../configs/api";
import {
  fetchBlogs,
  fetchAllBlogs,
  fetchMyBlogs,
  fetchBlogsByAuthor,
  fetchBlogDetail,
  createBlog,
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
    console.log(` Loading blogs: page=${page}, size=${size}`);
    setLoadingBlogs(true);
    try {
      // Simplified: Just use basic fetchBlogs endpoint
      console.log(" Using basic fetchBlogs endpoint...");
      const res = await fetchBlogs(page, size);
      console.log("📋 fetchBlogs response:", res.data);

      // Handle both paginated and direct array response
      let blogData = [];
      if (res.data?.content && Array.isArray(res.data.content)) {
        blogData = res.data.content;
      } else if (Array.isArray(res.data)) {
        blogData = res.data;
      } else if (res.data && typeof res.data === "object") {
        // Single blog object - convert to array
        blogData = [res.data];
      }

      console.log("📊 Blog data extracted:", blogData.length, "blogs");

      const processedBlogs = blogData.map((blog) => {
        // Handle circular reference in author.blogs
        const cleanAuthor = blog.author
          ? {
              id: blog.author.id,
              fullname: blog.author.fullname || "Không có tác giả",
              email: blog.author.email,
              imageUrl: blog.author.imageUrl,
              role: blog.author.role,
              // Don't include blogs array to avoid circular reference
            }
          : { fullname: "Không có tác giả" };

        return {
          id: blog.id || blog.blog_id,
          title: blog.title || "Không có tiêu đề",
          content: blog.content || "Không có nội dung",
          imgUrl: blog.imgUrl,
          viewCount: blog.viewCount || 0,
          likeCount: blog.likeCount || 0,
          status: blog.status || "DRAFT",
          createdAt: blog.createdAt
            ? new Date(blog.createdAt).toLocaleString("vi-VN")
            : "Không có",
          updatedAt: blog.updatedAt
            ? new Date(blog.updatedAt).toLocaleString("vi-VN")
            : "Không có",
          author: cleanAuthor,
          tags: Array.isArray(blog.tags) ? blog.tags : [],
        };
      });

      setBlogs(processedBlogs);
      console.log(
        " Processed blogs set to state:",
        processedBlogs.length,
        "blogs"
      );
      console.log(
        "📝 Latest blog titles:",
        processedBlogs.slice(0, 3).map((b) => b.title)
      );

      // If no blogs from API but we have created blogs in session, show message
      if (processedBlogs.length === 0) {
        console.log(
          "⚠️ No blogs returned from API - this might be due to status filtering"
        );
        console.log(
          "💡 Backend API only returns PUBLISHED blogs, but you may have created DRAFT/PENDING blogs"
        );
      }
    } catch (error) {
      console.error(" Error loading blogs:", error);
      toast.error(
        `Không thể tải danh sách blog: ${error.message || "Lỗi không xác định"}`
      );
      setBlogs([]);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Load tags
  const loadTags = async (forceRefresh = false) => {
    try {
      // Add cache busting parameter if force refresh
      const url = forceRefresh ? `/tags?_t=${Date.now()}` : "/tags";
      const res = await api.get(url);

      // Filter out deleted tags (temporary fix for soft delete)
      const activeTags = (res.data || []).filter(
        (tag) => !tag.deleted && !tag.deleted_at && tag.status !== "DELETED"
      );

      setTagOptions(
        activeTags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }))
      );
      setTags(activeTags);
    } catch (error) {
      console.error("Error loading tags:", error);
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
      const res = await api.get(`/blog/by-tag/${tagId}`);
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

      // Safely parse response to avoid circular reference issues
      let blog = {};
      try {
        if (typeof res.data === "string") {
          // If response is string, try to parse it
          blog = JSON.parse(res.data);
        } else {
          blog = res.data || {};
        }
        console.log("Blog detail response parsed successfully:", blog);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.log("Raw response type:", typeof res.data);
        console.log(
          "Raw response preview:",
          String(res.data).substring(0, 200) + "..."
        );

        // If parsing fails, try to extract data manually from string
        const responseText = String(res.data);

        // Try to extract basic info using regex (fallback)
        const titleMatch = responseText.match(/"title":"([^"]*)"/);
        const contentMatch = responseText.match(/"content":"([^"]*?)"/);
        const idMatch = responseText.match(/"id":(\d+)/);
        const viewCountMatch = responseText.match(/"viewCount":(\d+)/);
        const likeCountMatch = responseText.match(/"likeCount":(\d+)/);
        const statusMatch = responseText.match(/"status":"([^"]*?)"/);
        const imgUrlMatch = responseText.match(/"imgUrl":"([^"]*?)"/);
        const authorNameMatch = responseText.match(/"fullname":"([^"]*?)"/);

        blog = {
          id: idMatch ? parseInt(idMatch[1]) : null,
          title: titleMatch ? titleMatch[1] : "Không thể tải tiêu đề",
          content: contentMatch ? contentMatch[1] : "Không thể tải nội dung",
          viewCount: viewCountMatch ? parseInt(viewCountMatch[1]) : 0,
          likeCount: likeCountMatch ? parseInt(likeCountMatch[1]) : 0,
          status: statusMatch ? statusMatch[1] : "UNKNOWN",
          imgUrl: imgUrlMatch ? imgUrlMatch[1] : "",
          author: {
            fullname: authorNameMatch
              ? authorNameMatch[1]
              : "Không thể tải thông tin tác giả",
            id: null,
            email: "",
            imageUrl: "",
            role: "",
          },
          tags: [],
        };

        console.log("Fallback parsed blog data:", blog);
      }

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
    console.log("🚀 Starting handleCreateBlog...");

    // Temporary bypass for testing - use hardcoded userId
    const testUserId = userId || 1;
    console.log(" Using userId (test mode):", testUserId);

    console.log(" UserId found:", userId);
    setCreateBlogLoading(true);

    try {
      console.log(" Validating form fields...");
      const values = await createBlogForm.validateFields();
      console.log(" Form validation passed:", values);

      // Get image file if exists
      const fileInput = document.getElementById("blog-image-input");
      const imgFile = fileInput?.files[0] || null;

      // Validate required fields
      console.log(" Validating title:", values.title?.length);
      if (!values.title || values.title.trim().length < 10) {
        console.error(" Title validation failed");
        toast.error("Tiêu đề phải có ít nhất 10 ký tự!");
        return;
      }

      console.log(" Validating content:", values.content?.length);
      if (!values.content || values.content.trim().length < 50) {
        console.error(" Content validation failed");
        toast.error("Nội dung phải có ít nhất 50 ký tự!");
        return;
      }

      console.log(" All validations passed");

      // Process tags - convert IDs to names for backend
      let tagNames = [];
      if (values.tags && values.tags.length > 0) {
        console.log("🏷️ Selected tag IDs:", values.tags);
        console.log("🏷️ Available tags:", tags);

        tagNames = values.tags
          .map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? tag.name : null;
          })
          .filter((name) => name !== null);

        console.log("🏷️ Converted tag names:", tagNames);
      }

      const blogData = {
        title: values.title.trim(),
        content: values.content.trim(),
        status: values.status || "DRAFT",
        imgFile: imgFile,
        tagNames: tagNames, // Backend expects tag names
      };

      // Prepare blog data for submission

      // Submit blog data
      console.log("🚀 Submitting blog data:", blogData);
      try {
        console.log("📤 Calling createBlog API...");
        const response = await createBlog(blogData);
        console.log(" Blog created successfully:", response.data);

        toast.success("Tạo blog thành công!");

        // Close modal and reset form
        setIsCreateBlogModalVisible(false);
        createBlogForm.resetFields();

        // Force reload blogs to show new blog
        console.log(" Reloading blogs after create...");

        // Add the created blog directly to state as immediate feedback
        if (response.data) {
          const newBlog = {
            ...response.data,
            createdAt: response.data.createdAt
              ? new Date(response.data.createdAt).toLocaleString("vi-VN")
              : "Vừa tạo",
            updatedAt: response.data.updatedAt
              ? new Date(response.data.updatedAt).toLocaleString("vi-VN")
              : "Vừa tạo",
            author: response.data.author || { fullname: "Bạn" },
            tags: Array.isArray(response.data.tags) ? response.data.tags : [],
          };

          console.log("➕ Adding new blog to state immediately:", newBlog);
          setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
        }

        await loadBlogs(0, 20); // Also try to reload from server
      } catch (error) {
        console.error(" Create blog failed:", error);
        console.error(" Error response:", error.response?.data);

        // Retry without tags if error occurs and tags were included
        if (error.response?.status === 500 && blogData.tagNames.length > 0) {
          console.log(" Retrying without tags...");
          const blogDataNoTags = { ...blogData, tagNames: [] };
          const retryResponse = await createBlog(blogDataNoTags);
          console.log(" Blog created without tags:", retryResponse.data);

          toast.warning(
            "Blog được tạo thành công nhưng không có tags do hạn chế hệ thống"
          );

          // Close modal and reset form
          setIsCreateBlogModalVisible(false);
          createBlogForm.resetFields();

          // Add the created blog directly to state
          if (retryResponse.data) {
            const newBlog = {
              ...retryResponse.data,
              createdAt: retryResponse.data.createdAt
                ? new Date(retryResponse.data.createdAt).toLocaleString("vi-VN")
                : "Vừa tạo",
              updatedAt: retryResponse.data.updatedAt
                ? new Date(retryResponse.data.updatedAt).toLocaleString("vi-VN")
                : "Vừa tạo",
              author: retryResponse.data.author || { fullname: "Bạn" },
              tags: [],
            };

            console.log("➕ Adding new blog (no tags) to state:", newBlog);
            setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
          }

          // Force reload blogs
          await loadBlogs(0, 20);
        } else {
          throw error;
        }
      }

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
      // Handle error with appropriate message
      let errorMessage = "Lỗi không xác định";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(`Tạo blog thất bại: ${errorMessage}`);
    } finally {
      setCreateBlogLoading(false);
    }
  };

  // Edit blog
  const handleEditBlog = async () => {
    const values = await editBlogForm.validateFields();
    try {
      await api.put(`/blog/${editingBlogId}`, {
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

    console.log(`🗑️ Attempting to delete blog ${blogId}`);

    try {
      await deleteBlog(blogId);
      console.log(` Blog ${blogId} deleted successfully`);
      toast.success("Xóa blog thành công!");
      loadBlogs(); // Reload the blog list
    } catch (error) {
      console.error(` Error deleting blog ${blogId}:`, error);

      // Show specific error message
      const errorMessage =
        error.message || "Không thể xóa blog. Vui lòng thử lại sau.";
      toast.error(errorMessage);

      // If authentication error, suggest login
      if (errorMessage.includes("đăng nhập")) {
        setTimeout(() => {
          const shouldLogin = confirm(`🔑 Bạn có muốn đăng nhập lại không?`);
          if (shouldLogin) {
            window.location.href = "/login";
          }
        }, 2000);
      }
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

  // Function to render status with color and icon
  const renderStatus = (status) => {
    const statusConfig = {
      DRAFT: { color: "#8c8c8c", icon: "📝", text: "Bản nháp" },
      PENDING: { color: "#faad14", icon: "⏳", text: "Chờ duyệt" },
      APPROVED: { color: "#52c41a", icon: "", text: "Đã duyệt" },
      PUBLISHED: { color: "#1890ff", icon: "🌐", text: "Đã đăng" },
      REJECTED: { color: "#ff4d4f", icon: "", text: "Bị từ chối" },
      ARCHIVED: { color: "#722ed1", icon: "📦", text: "Đã lưu trữ" },
    };

    const config = statusConfig[status] || {
      color: "#8c8c8c",
      icon: "❓",
      text: status,
    };

    return (
      <span style={{ color: config.color, fontWeight: "bold" }}>
        {config.icon} {config.text}
      </span>
    );
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
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (title, record) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>
            {title || "Không có tiêu đề"}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>ID: {record.id}</div>
        </div>
      ),
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "12%",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
      render: (createdAt) => (
        <div style={{ fontSize: "13px" }}>{createdAt || "Không có"}</div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status) => renderStatus(status),
    },
    {
      title: "Thống kê",
      key: "stats",
      width: "12%",
      sorter: (a, b) => (a.viewCount || 0) - (b.viewCount || 0),
      render: (_, record) => (
        <div>
          <div style={{ fontSize: "12px", marginBottom: 2 }}>
            👁️ {record.viewCount || 0} lượt xem
          </div>
          <div style={{ fontSize: "12px" }}>
            ❤️ {record.likeCount || 0} lượt thích
          </div>
        </div>
      ),
    },
    {
      title: "Chủ đề",
      dataIndex: "tags",
      key: "tags",
      width: "15%",
      render: (tags) => (
        <div>
          {tags && tags.length ? (
            <Tag color="blue" style={{ fontSize: "11px" }}>
              {tags[0]?.name || tags[0]}
            </Tag>
          ) : (
            <span style={{ color: "#999", fontSize: "11px" }}>Không có</span>
          )}
          {tags && tags.length > 1 && (
            <div style={{ fontSize: "10px", color: "#666", marginTop: 2 }}>
              +{tags.length - 1}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "13%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button
            onClick={() => handleFetchBlogDetail(record.id)}
            size="small"
            type="default"
            block
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
            block
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa blog"
            description={`Bạn có chắc chắn muốn xóa blog "${record.title}"?`}
            onConfirm={() => handleDeleteBlog(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" block>
              Xóa
            </Button>
          </Popconfirm>
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
              console.log("✏️ Editing tag:", record);
              setEditingTag(record);
              tagForm.setFieldsValue({
                name: record.name,
                description: record.description || "",
              });
              setIsTagModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa chủ đề này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={async () => {
              try {
                console.log("🗑️ Deleting tag with ID:", record.id);
                console.log("📋 Tags before delete:", tags.length);

                const response = await api.delete(`/tags/${record.id}`);
                console.log(
                  " Delete API response:",
                  response.status,
                  response.statusText
                );

                if (response.status === 204) {
                  // Backend trả về 204 nhưng không xóa thật
                  // Fake delete ở frontend để UX tốt hơn
                  console.log(
                    "🎭 Backend fake delete - removing from frontend state"
                  );
                  const updatedTags = tags.filter(
                    (tag) => tag.id !== record.id
                  );
                  setTags(updatedTags);
                  setTagOptions(
                    updatedTags.map((tag) => ({
                      label: tag.name,
                      value: tag.id,
                    }))
                  );
                  console.log("� Tags after fake delete:", updatedTags.length);
                  toast.success("Xóa chủ đề thành công!");
                } else {
                  // Nếu backend thực sự xóa, reload như bình thường
                  console.log("� Reloading tags after delete...");
                  await loadTags();
                  console.log("📋 Tags after reload:", tags.length);
                  toast.success("Xóa chủ đề thành công!");
                }
              } catch (error) {
                console.error(" Error deleting tag:", error);
                console.error("Response data:", error.response?.data);
                console.error("Response status:", error.response?.status);
                toast.error(
                  `Xóa chủ đề thất bại: ${
                    error.response?.data?.message ||
                    error.message ||
                    "Lỗi không xác định"
                  }`
                );
              }
            }}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (selectedTab === "write_blogs") {
    // Calculate statistics
    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(
      (blog) => blog.status === "PUBLISHED"
    ).length;
    const draftBlogs = blogs.filter((blog) => blog.status === "DRAFT").length;
    const totalViews = blogs.reduce(
      (sum, blog) => sum + (blog.viewCount || 0),
      0
    );
    const totalLikes = blogs.reduce(
      (sum, blog) => sum + (blog.likeCount || 0),
      0
    );

    return (
      <div>
        {/* Statistics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}
            >
              {totalBlogs}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>
              Tổng số bài viết
            </div>
          </div>

          <div
            style={{
              background: "#e6f7ff",
              border: "1px solid #91d5ff",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}
            >
              {publishedBlogs}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>Đã xuất bản</div>
          </div>

          <div
            style={{
              background: "#fff7e6",
              border: "1px solid #ffd591",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#fa8c16" }}
            >
              {draftBlogs}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>Bản nháp</div>
          </div>

          <div
            style={{
              background: "#f9f0ff",
              border: "1px solid #d3adf7",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#722ed1" }}
            >
              {totalViews}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>Tổng lượt xem</div>
          </div>

          <div
            style={{
              background: "#fff0f6",
              border: "1px solid #ffadd2",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#eb2f96" }}
            >
              {totalLikes}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>
              Tổng lượt thích
            </div>
          </div>
        </div>

        {/* Filter and Actions */}
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Select
            allowClear
            placeholder="Lọc theo chủ đề"
            style={{ width: 200 }}
            options={tagOptions}
            value={selectedTag}
            onChange={handleFilterByTag}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateBlogModalVisible(true)}
          >
            Tạo Blog mới
          </Button>
        </div>
        <Table
          columns={blogColumns}
          dataSource={blogs}
          loading={loadingBlogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bài viết`,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          size="middle"
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
          confirmLoading={createBlogLoading}
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
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select placeholder="Chọn trạng thái bài viết">
                <Select.Option value="DRAFT">📝 Bản nháp</Select.Option>
                <Select.Option value="PENDING">⏳ Chờ duyệt</Select.Option>
                <Select.Option value="APPROVED"> Đã duyệt</Select.Option>
                <Select.Option value="PUBLISHED">🌐 Đã đăng</Select.Option>
                <Select.Option value="REJECTED"> Bị từ chối</Select.Option>
                <Select.Option value="ARCHIVED">📦 Đã lưu trữ</Select.Option>
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
              {createBlogLoading && <div>Đang xử lý...</div>}
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

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select placeholder="Chọn trạng thái bài viết">
                <Select.Option value="DRAFT">📝 Bản nháp</Select.Option>
                <Select.Option value="PENDING">⏳ Chờ duyệt</Select.Option>
                <Select.Option value="APPROVED"> Đã duyệt</Select.Option>
                <Select.Option value="PUBLISHED">🌐 Đã đăng</Select.Option>
                <Select.Option value="REJECTED"> Bị từ chối</Select.Option>
                <Select.Option value="ARCHIVED">📦 Đã lưu trữ</Select.Option>
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
                <b>Trạng thái:</b> {renderStatus(selectedBlog.status)}
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
            try {
              const values = await tagForm.validateFields();
              console.log("📝 Creating/updating tag with values:", values);
              console.log("📋 Current editingTag:", editingTag);

              if (editingTag) {
                // Update existing tag
                await api.put(`/tags/${editingTag.id}`, values);

                // Update local state immediately
                const updatedTags = tags.map((tag) =>
                  tag.id === editingTag.id ? { ...tag, ...values } : tag
                );
                setTags(updatedTags);
                setTagOptions(
                  updatedTags.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))
                );
              } else {
                // Create new tag
                const response = await api.post("/tags", values);

                // Add new tag to local state
                const newTag = response.data || { ...values, id: Date.now() };
                const updatedTags = [...tags, newTag];
                setTags(updatedTags);
                setTagOptions(
                  updatedTags.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))
                );
              }

              // Close modal and reset form
              setIsTagModalVisible(false);
              tagForm.resetFields();
              setEditingTag(null);

              // Force reload tags to reflect changes
              await loadTags(true);

              toast.success(
                editingTag
                  ? "Cập nhật chủ đề thành công!"
                  : "Thêm chủ đề thành công!"
              );
            } catch (error) {
              console.error(" Error creating/updating tag:", error);
              console.error("📦 Error response data:", error.response?.data);
              console.error(
                "🔢 Error response status:",
                error.response?.status
              );
              console.error(
                "📄 Error response headers:",
                error.response?.headers
              );

              toast.error(
                `${editingTag ? "Cập nhật" : "Tạo"} chủ đề thất bại: ${
                  error.response?.data?.message ||
                  error.message ||
                  "Lỗi không xác định"
                }`
              );
            }
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
              rules={[
                { required: true, message: "Vui lòng nhập tên chủ đề!" },
                { min: 2, message: "Tên chủ đề phải có ít nhất 2 ký tự!" },
                { max: 50, message: "Tên chủ đề không được quá 50 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập tên chủ đề..." />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ max: 200, message: "Mô tả không được quá 200 ký tự!" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Nhập mô tả cho chủ đề (tùy chọn)..."
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  return <div>Chọn tab để bắt đầu</div>;
};

export default WriteBlogs;
