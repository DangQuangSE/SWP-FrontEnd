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
import {
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../../configs/serverConfig";
import {
  fetchBlogs,
  fetchBlogDetail,
  createBlog,
  deleteBlog,
  uploadImage,
} from "../../../../api/consultantAPI";
import "./BlogManagement.css";
import axios from "axios";

const BlogManagement = ({ userId, selectedTab }) => {
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

  // Status filter state
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Load blogs - Admin xem tất cả blog (mọi trạng thái)
  const loadBlogs = async (page = 0, size = 10) => {
    setLoadingBlogs(true);
    try {
      const token = localStorage.getItem("token");

      // Sử dụng endpoint admin/all theo API documentation
      const apiUrl = `${API_BASE_URL}/blog/admin/all?page=${page}&size=${size}`;
      console.log("🔍 Admin loading all blogs from:", apiUrl);

      const res = await axios.get(apiUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      let blogData = [];
      if (res.data?.content && Array.isArray(res.data.content)) {
        blogData = res.data.content;
      } else if (Array.isArray(res.data)) {
        blogData = res.data;
      } else if (res.data && typeof res.data === "object") {
        blogData = [res.data];
      }

      const processedBlogs = blogData.map((blog) => {
        const cleanAuthor = blog.author
          ? {
              id: blog.author.id,
              fullname: blog.author.fullname || "Không có tác giả",
              email: blog.author.email,
              imageUrl: blog.author.imageUrl,
              role: blog.author.role,
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
    } catch (error) {
      console.error("❌ Load blogs error:", error);
      toast.error(
        `Không thể tải danh sách blog: ${error.message || "Lỗi không xác định"}`
      );
      setBlogs([]);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Load blogs by status (admin only)
  const loadBlogsByStatus = async (status, page = 0, size = 10) => {
    setLoadingBlogs(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${API_BASE_URL}/blog/admin/by-status?status=${status}&page=${page}&size=${size}`;
      console.log("🔍 Admin loading blogs by status from:", apiUrl);

      const res = await axios.get(apiUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      let blogData = [];
      if (res.data?.content && Array.isArray(res.data.content)) {
        blogData = res.data.content;
      } else if (Array.isArray(res.data)) {
        blogData = res.data;
      } else if (res.data && typeof res.data === "object") {
        blogData = [res.data];
      }
      const processedBlogs = blogData.map((blog) => {
        const cleanAuthor = blog.author
          ? {
              id: blog.author.id,
              fullname: blog.author.fullname || "Không có tác giả",
              email: blog.author.email,
              imageUrl: blog.author.imageUrl,
              role: blog.author.role,
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
    } catch (error) {
      toast.error(
        `Không thể tải blog theo trạng thái: ${
          error.message || "Lỗi không xác định"
        }`
      );
      setBlogs([]);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const loadTags = async (forceRefresh = false) => {
    try {
      const apiUrl = forceRefresh
        ? `${API_BASE_URL}/tags?_t=${Date.now()}`
        : `${API_BASE_URL}/tags`;
      console.log("🏷️ Loading tags from:", apiUrl);

      const res = await axios.get(apiUrl);
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
      console.error("❌ Load tags error:", error);
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
      const res = await api.get(`/blog/by-tag/${tagId}`);

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
      toast.error("Không thể lọc blog theo chủ đề");
      setBlogs([]);
    }
  };

  // Handle filter by status
  const handleFilterByStatus = (status) => {
    setSelectedStatus(status);
    if (status === "ALL") {
      loadBlogs();
    } else {
      loadBlogsByStatus(status);
    }
  };

  // Admin actions for blog approval
  const handleApproveBlog = async (id) => {
    try {
      console.log("🔄 Đang duyệt blog ID:", id);
      const blogBefore = blogs.find((b) => b.id === id);
      console.log(" Blog trước khi duyệt:", blogBefore);

      const token = localStorage.getItem("token");
      const apiUrl = `${API_BASE_URL}/blog/admin/${id}/approve`;
      console.log("✅ Approve API:", apiUrl);

      const response = await axios.post(apiUrl, null, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("✅ Approve response:", response.data);
      toast.success("Duyệt bài viết thành công!");

      // Refresh data ngay lập tức
      await loadBlogs();

      // Debug: Kiểm tra blog sau khi cập nhật với delay để đảm bảo state đã cập nhật
      setTimeout(() => {
        const blogAfter = blogs.find((b) => b.id === id);
        console.log(" Blog sau khi duyệt:", blogAfter);

        // Force component re-render
        setBlogs([...blogs]);
      }, 500);
    } catch (error) {
      console.error("❌ Error approving blog:", error);
      toast.error("Duyệt bài viết thất bại!");
    }
  };

  const handleRejectBlog = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${API_BASE_URL}/blog/admin/${id}/reject`;
      console.log("❌ Reject API:", apiUrl);

      await axios.post(apiUrl, null, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Từ chối bài viết thành công!");
      loadBlogs();
    } catch (error) {
      console.error("❌ Error rejecting blog:", error);
      toast.error("Từ chối bài viết thất bại!");
    }
  };

  const handlePublishBlog = async (id) => {
    try {
      console.log("🚀 Đang đăng blog ID:", id);
      const blogBefore = blogs.find((b) => b.id === id);
      console.log(" Blog trước khi đăng:", blogBefore);

      const token = localStorage.getItem("token");
      const apiUrl = `${API_BASE_URL}/blog/admin/${id}/publish`;
      console.log("🌐 Publish API:", apiUrl);

      const response = await axios.post(apiUrl, null, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("✅ Publish response:", response.data);
      toast.success("Đăng bài viết thành công!");

      await loadBlogs(); // Tải lại danh sách

      // Debug: Kiểm tra blog sau khi cập nhật
      setTimeout(() => {
        const blogAfter = blogs.find((b) => b.id === id);
        console.log(" Blog sau khi đăng:", blogAfter);
      }, 1000);
    } catch (error) {
      console.error("❌ Error publishing blog:", error);
      toast.error("Đăng bài viết thất bại!");
    }
  };

  // Fetch blog detail
  const handleFetchBlogDetail = async (id) => {
    if (!id) {
      toast.error("ID blog không hợp lệ");
      return;
    }

    try {
      console.log(`🔍 [DEBUG] Fetching blog detail for ID: ${id}`);
      const res = await fetchBlogDetail(id);
      console.log(`📥 [DEBUG] Blog detail response:`, res.data);

      let blog = {};
      try {
        if (typeof res.data === "string") {
          blog = JSON.parse(res.data);
        } else {
          blog = res.data || {};
        }
      } catch (parseError) {
        const responseText = String(res.data);
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
      console.error(`❌ [DEBUG] Error fetching blog detail:`, error);
      console.error(`❌ [DEBUG] Error response:`, error.response?.data);
      console.error(`❌ [DEBUG] Error status:`, error.response?.status);

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

  const handleCreateBlog = async () => {
    setCreateBlogLoading(true);

    const testUserId = userId || 1;
    console.log(" Using userId (test mode):", testUserId);

    console.log(" UserId found:", userId);

    try {
      const values = await createBlogForm.validateFields();

      const fileInput = document.getElementById("blog-image-input");
      const imgFile = fileInput?.files[0] || null;

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

      let tagNames = [];
      if (values.tags && values.tags.length > 0) {
        console.log(" Selected tag IDs:", values.tags);
        console.log(" Available tags:", tags);

        tagNames = values.tags
          .map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? tag.name : null;
          })
          .filter((name) => name !== null);
      }

      const blogData = {
        title: values.title.trim(),
        content: values.content.trim(),
        // Không cần truyền status - backend sẽ tự động set
        imgFile: imgFile,
        tagNames: tagNames,
      };
      console.log(">>> Submitting blog data:", blogData);
      try {
        const response = await createBlog(blogData);

        toast.success("Tạo blog thành công!");

        setIsCreateBlogModalVisible(false);
        createBlogForm.resetFields();

        console.log(" Reloading blogs after create...");
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

          console.log(" Adding new blog to state immediately:", newBlog);
          setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
        }

        await loadBlogs(0, 20);
      } catch (error) {
        console.error(" Create blog failed:", error);
        console.error(" Error response:", error.response?.data);
        if (error.response?.status === 500 && blogData.tagNames.length > 0) {
          console.log(" Retrying without tags...");
          const blogDataNoTags = { ...blogData, tagNames: [] };
          const retryResponse = await createBlog(blogDataNoTags);
          console.log(" Blog created without tags:", retryResponse.data);

          toast.warning(
            "Blog được tạo thành công nhưng không có tags do hạn chế hệ thống"
          );
          setIsCreateBlogModalVisible(false);
          createBlogForm.resetFields();
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

            console.log(" Adding new blog (no tags) to state:", newBlog);
            setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
          }
          await loadBlogs(0, 20);
        } else {
          throw error;
        }
      }
      setIsCreateBlogModalVisible(false);
      createBlogForm.resetFields();
      if (fileInput) {
        fileInput.value = "";
      }
      await loadBlogs();

      toast.success("Tạo blog thành công!");
    } catch (error) {
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
  const handleEditBlog = async () => {
    try {
      const values = await editBlogForm.validateFields();

      // Validate required fields
      if (!values.title || values.title.trim().length < 10) {
        toast.error("Tiêu đề phải có ít nhất 10 ký tự!");
        return;
      }

      if (!values.content || values.content.trim().length < 50) {
        toast.error("Nội dung phải có ít nhất 50 ký tự!");
        return;
      }

      // Prepare query parameters as per API documentation
      const params = new URLSearchParams();
      params.append("title", values.title.trim());
      params.append("content", values.content.trim());

      // Handle tags - convert tag IDs to tag names
      if (values.tags && values.tags.length > 0) {
        const tagNames = values.tags
          .map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return tag ? tag.name : null;
          })
          .filter((name) => name !== null);

        tagNames.forEach((tagName) => {
          params.append("tags", tagName);
        });
      }

      // Prepare request body with image (if provided)
      const formData = new FormData();

      // Check if new image is selected
      const fileInput = document.getElementById("edit-blog-image-input");
      const imgFile = fileInput?.files[0];

      if (imgFile) {
        formData.append("image", imgFile);
        console.log("🖼️ New image selected for blog update");
      }

      console.log(
        `🔧 Updating blog ${editingBlogId} with params:`,
        params.toString()
      );

      const token = localStorage.getItem("token");
      const apiUrl = `${API_BASE_URL}/blog/${editingBlogId}?${params.toString()}`;
      console.log("🔧 Edit blog API:", apiUrl);

      // Send request with query params and form data (for image)
      await axios.put(apiUrl, formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(imgFile ? { "Content-Type": "multipart/form-data" } : {}),
        },
      });

      setIsEditBlogModalVisible(false);
      editBlogForm.resetFields();

      // Clear file input
      if (fileInput) {
        fileInput.value = "";
      }

      await loadBlogs();
      toast.success("Cập nhật blog thành công!");
    } catch (error) {
      console.error("❌ Edit blog error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Lỗi không xác định";
      toast.error(`Cập nhật blog thất bại: ${errorMessage}`);
    }
  };
  const handleDeleteBlog = async (blogId) => {
    if (!blogId) return;

    try {
      await deleteBlog(blogId);
      toast.success("Xóa blog thành công!");
      loadBlogs();
    } catch (error) {
      const errorMessage =
        error.message || "Không thể xóa blog. Vui lòng thử lại sau.";
      toast.error(errorMessage);
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
  const renderStatus = (status) => {
    const statusConfig = {
      PENDING: { color: "#faad14", text: "Chờ duyệt" },
      PUBLISHED: { color: "#1890ff", text: "Đã đăng" },
      REJECTED: { color: "#ff4d4f", text: "Bị từ chối" },
    };
    const config = statusConfig[status] || {
      color: "#8c8c8c",
      text: status,
    };
    return (
      <span className={`blog-status ${status.toLowerCase()}`}>
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
  const blogColumns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (title, record) => (
        <div>
          <div className="blog-title-cell">{title || "Không có tiêu đề"}</div>
          <div className="blog-id-cell">ID: {record.id}</div>
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
        <div className="blog-date-cell">{createdAt || "Không có"}</div>
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
          <div className="blog-stats-cell">
            👁️ {record.viewCount || 0} lượt xem
          </div>
          <div className="blog-stats-likes">
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
            <Tag color="blue" className="blog-tag-primary">
              {tags[0]?.name || tags[0]}
            </Tag>
          ) : (
            <span className="blog-tag-empty">Không có</span>
          )}
          {tags && tags.length > 1 && (
            <div className="blog-tag-count">+{tags.length - 1}</div>
          )}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "13%",
      render: (_, record) => {
        const actions = [];

        // Always show View Detail
        actions.push(
          <Button
            key="detail"
            onClick={() => handleFetchBlogDetail(record.id)}
            size="small"
            type="default"
            block
          >
            Xem chi tiết
          </Button>
        );

        // Show Approve and Reject buttons for PENDING blogs
        if (record.status === "PENDING") {
          actions.push(
            <Popconfirm
              key="approve"
              title="Duyệt bài viết này?"
              onConfirm={() => handleApproveBlog(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                icon={<CheckOutlined />}
                size="small"
                type="primary"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                block
              >
                Duyệt
              </Button>
            </Popconfirm>
          );

          actions.push(
            <Popconfirm
              key="reject"
              title="Từ chối bài viết này?"
              onConfirm={() => handleRejectBlog(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button icon={<CloseOutlined />} size="small" danger block>
                Từ chối
              </Button>
            </Popconfirm>
          );
        }

        // Show Publish button for APPROVED blogs
        if (record.status === "APPROVED") {
          actions.push(
            <Popconfirm
              key="publish"
              title="Đăng bài viết này?"
              onConfirm={() => handlePublishBlog(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button icon={<SendOutlined />} size="small" type="primary" block>
                Đăng
              </Button>
            </Popconfirm>
          );
        }

        // Always show Edit
        actions.push(
          <Button
            key="edit"
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
        );

        // Always show Delete
        actions.push(
          <Popconfirm
            key="delete"
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
        );

        return (
          <Space direction="vertical" size="small">
            {actions}
          </Space>
        );
      },
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
                const apiUrl = `${API_BASE_URL}/tags/${record.id}`;
                console.log("🗑️ Delete tag API:", apiUrl);
                const response = await axios.delete(apiUrl);

                if (response.status === 204) {
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
                  toast.success("Xóa chủ đề thành công!");
                } else {
                  await loadTags();
                  toast.success("Xóa chủ đề thành công!");
                }
              } catch (error) {
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
        <div className="stats-grid">
          <div className="stats-card total">
            <div className="stats-number total">{totalBlogs}</div>
            <div className="stats-label">Tổng số bài viết</div>
          </div>

          <div className="stats-card published">
            <div className="stats-number published">{publishedBlogs}</div>
            <div className="stats-label">Đã xuất bản</div>
          </div>

          <div className="stats-card draft">
            <div className="stats-number draft">{draftBlogs}</div>
            <div className="stats-label">Bản nháp</div>
          </div>

          <div className="stats-card views">
            <div className="stats-number views">{totalViews}</div>
            <div className="stats-label">Tổng lượt xem</div>
          </div>

          <div className="stats-card likes">
            <div className="stats-number likes">{totalLikes}</div>
            <div className="stats-label">Tổng lượt thích</div>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="filter-actions">
          <div style={{ display: "flex", gap: "16px" }}>
            <Select
              placeholder="Lọc theo trạng thái"
              className="filter-select"
              value={selectedStatus}
              onChange={handleFilterByStatus}
              options={[
                { value: "ALL", label: "Tất cả trạng thái" },
                { value: "PENDING", label: "Chờ duyệt" },
                { value: "PUBLISHED", label: "Đã đăng" },
                { value: "REJECTED", label: "Bị từ chối" },
              ]}
            />
            <Select
              allowClear
              placeholder="Lọc theo chủ đề"
              className="filter-select"
              options={tagOptions}
              value={selectedTag}
              onChange={handleFilterByTag}
            />
          </div>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={() => {
              console.log("🔄 Manual refresh triggered");
              loadBlogs();
            }}
            style={{ marginRight: 8 }}
          >
            Làm mới
          </Button>
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

            <Form.Item label="Ảnh đại diện">
              <input
                id="blog-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
                disabled={createBlogLoading}
              />
              {createBlogLoading && <div>Đang xử lý...</div>}
              <div className="image-upload-hint">
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
            // Clear file input
            const fileInput = document.getElementById("edit-blog-image-input");
            if (fileInput) {
              fileInput.value = "";
            }
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
                <Select.Option value="PENDING">⏳ Chờ duyệt</Select.Option>
                <Select.Option value="PUBLISHED">🌐 Đã đăng</Select.Option>
                <Select.Option value="REJECTED">❌ Bị từ chối</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Ảnh đại diện">
              <input
                id="edit-blog-image-input"
                type="file"
                accept="image/*"
                className="image-upload-input"
              />
              <div className="image-upload-hint">
                Chọn ảnh đại diện mới cho bài viết (tùy chọn)
              </div>
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
              <div className="blog-detail-item">
                <b>ID:</b> {selectedBlog.id}
              </div>
              <div className="blog-detail-item">
                <b>Tiêu đề:</b> {selectedBlog.title}
              </div>
              <div className="blog-detail-item">
                <b>Tác giả:</b> {selectedBlog.author?.fullname}
              </div>
              <div className="blog-detail-item">
                <b>Ngày tạo:</b> {selectedBlog.createdAt}
              </div>
              <div className="blog-detail-item">
                <b>Ngày cập nhật:</b> {selectedBlog.updatedAt}
              </div>
              <div className="blog-detail-item">
                <b>Lượt xem:</b> {selectedBlog.viewCount} | <b>Lượt thích:</b>{" "}
                {selectedBlog.likeCount}
              </div>
              <div className="blog-detail-item">
                <b>Trạng thái:</b> {renderStatus(selectedBlog.status)}
              </div>
              <div className="blog-detail-item">
                <b>Chủ đề:</b>{" "}
                {selectedBlog.tags && selectedBlog.tags.length
                  ? selectedBlog.tags.map((tag) => tag.name || tag).join(", ")
                  : "Không có"}
              </div>
              {selectedBlog.imgUrl ? (
                <div className="blog-detail-item">
                  <b>Ảnh blog:</b>
                  <br />
                  <img
                    src={selectedBlog.imgUrl}
                    alt="blog"
                    className="blog-image"
                  />
                </div>
              ) : null}
              <div className="blog-detail-item">
                <b>Nội dung:</b>
                <br />
                <div className="blog-content">{selectedBlog.content}</div>
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
          className="tag-create-button"
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

              if (editingTag) {
                const apiUrl = `${API_BASE_URL}/tags/${editingTag.id}`;
                console.log("✏️ Update tag API:", apiUrl);
                await axios.put(apiUrl, values);

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
                const apiUrl = `${SERVER_CONFIG.API_URL}/tags`;
                console.log("➕ Create tag API:", apiUrl);
                const response = await axios.post(apiUrl, values);

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

              setIsTagModalVisible(false);
              tagForm.resetFields();
              setEditingTag(null);

              await loadTags(true);

              toast.success(
                editingTag
                  ? "Cập nhật chủ đề thành công!"
                  : "Thêm chủ đề thành công!"
              );
            } catch (error) {
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

export default BlogManagement;
