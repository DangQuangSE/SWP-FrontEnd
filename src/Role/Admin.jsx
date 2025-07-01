import React, { useState } from "react";
import "./Admin.css";
import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Form,
  Input,
  Typography,
  Space,
  Breadcrumb,
  Tag,
  Select,
  Popconfirm,
  message,
  theme,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  DollarOutlined,
  SolutionOutlined,
  FormOutlined,
  CreditCardOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../configs/api";
import { useEffect } from "react";

import { supabase } from "../utils/supabaseClient";

// Import modals
import {
  UserModal,
  ServiceModal,
  ServiceDetailModal,
  BlogModal,
  RoomModal,
  SpecializationModal,
} from "./AdminDashboard/index";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function Admin() {
  const [imageUrl, setImageUrl] = useState("");
  const [blogForm] = Form.useForm();
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [services, setServices] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
  const [isServiceDetailModalVisible, setIsServiceDetailModalVisible] =
    useState(false);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [isBlogModalVisible, setIsBlogModalVisible] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [isComboService, setIsComboService] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [form] = Form.useForm();

  // Specialization states
  const [specializations, setSpecializations] = useState([]);
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const [isSpecializationModalVisible, setIsSpecializationModalVisible] =
    useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu items for the top navigation
  const items1 = ["Dashboard", "Settings", "Reports"].map((label, key) => ({
    key: String(key + 1),
    label,
  }));

  // Lấy danh sách bài viết
  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("create-at", { ascending: false }); // sửa lại tên cột
    if (error) throw error;
    return data;
  };
  useEffect(() => {
    const getArticles = async () => {
      const data = await fetchArticles();
      setArticles(data);
    };
    getArticles();
  }, []);

  // Thêm bài viết
  const addArticle = async (article) => {
    const { data, error } = await supabase.from("articles").insert([article]);
    if (error) throw error;
    return data;
  };

  // Sửa bài viết
  const updateArticle = async (id, article) => {
    const { data, error } = await supabase
      .from("articles")
      .update(article)
      .eq("id", id);
    if (error) throw error;
    return data;
  };

  // Xóa bài viết
  const deleteArticle = async (id) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
  };
  // Lấy danh sách dịch vụ
  const fetchServices = async () => {
    try {
      const response = await api.get("/service");
      // Nếu response trả về một object thay vì array, wrap nó trong array
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      return data;
    } catch (error) {
      console.error("Lỗi lấy dịch vụ:", error);
      return [];
    }
  };

  // Lấy dịch vụ theo ID
  const fetchServiceById = async (id) => {
    try {
      const response = await api.get(`/service/id/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy dịch vụ theo ID:", error);
      throw error;
    }
  };

  // Lấy danh sách services để làm sub-services (chỉ lấy những service không phải combo)
  const fetchAvailableServices = async () => {
    try {
      const response = await api.get("/service");
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      // Lọc chỉ lấy những service không phải combo
      return data.filter((service) => !service.isCombo);
    } catch (error) {
      console.error("Lỗi lấy danh sách services:", error);
      return [];
    }
  };

  // Tạo combo service
  const createComboService = async (serviceData) => {
    try {
      const response = await api.post("/service/comboService", serviceData);
      return response.data;
    } catch (error) {
      console.error("Lỗi tạo combo service:", error);
      throw error;
    }
  };

  // Tìm kiếm service theo tên
  const searchServiceByName = async (name) => {
    try {
      const encodedName = encodeURIComponent(name);
      const response = await api.get(`/service/name/${encodedName}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi tìm kiếm service:", error);
      throw error;
    }
  };
  useEffect(() => {
    const getServices = async () => {
      const data = await fetchServices();
      setServices(data);
    };
    getServices();
  }, []);

  // Thêm dịch vụ
  const addService = async (service) => {
    try {
      // Chuyển đổi duration từ minutes sang seconds nếu cần
      const serviceData = {
        ...service,
        duration: service.duration ? parseInt(service.duration) * 60 : null,
        price: service.price ? parseFloat(service.price) : 0,
        discountPercent: service.discountPercent
          ? parseFloat(service.discountPercent)
          : 0,
      };
      const response = await api.post("/service", serviceData);
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm dịch vụ:", error);
      throw error;
    }
  };

  // Sửa dịch vụ
  const updateService = async (id, service) => {
    try {
      // Chuyển đổi duration từ minutes sang seconds nếu cần
      const serviceData = {
        ...service,
        duration: service.duration ? parseInt(service.duration) * 60 : null,
        price: service.price ? parseFloat(service.price) : 0,
        discountPercent: service.discountPercent
          ? parseFloat(service.discountPercent)
          : 0,
      };
      const response = await api.put(`/service/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error("Lỗi sửa dịch vụ:", error);
      throw error;
    }
  };

  // Xóa dịch vụ
  const deleteService = async (id) => {
    try {
      await api.delete(`/service/${id}`);
    } catch (error) {
      console.error("Lỗi xóa dịch vụ:", error);
      throw error;
    }
  };
  // Lấy danh sách user từ API
  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/users");
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
      return [];
    }
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getSpecializations = async () => {
      const data = await fetchSpecializations();
      setSpecializations(data);
    };
    getSpecializations();
  }, []);

  // Thêm user
  const addUser = async (user) => {
    try {
      const response = await api.post("/auth/users", user);
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm user:", error);
      throw error;
    }
  };

  // Sửa user
  const updateUser = async (id, user) => {
    try {
      const response = await api.put(`/auth/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error("Lỗi sửa user:", error);
      throw error;
    }
  };

  // Xóa user
  const deleteUser = async (id) => {
    try {
      await api.delete(`/auth/users/${id}`);
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      throw error;
    }
  };
  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    // Cập nhật lại danh sách
    const data = await fetchUsers();
    setUsers(data);
  };

  // Menu items for the side navigation
  const items2 = [
    {
      key: "manage_users",
      icon: React.createElement(UserOutlined),
      label: "Manage User Accounts & Roles",
    },
    {
      key: "manage_services",
      icon: React.createElement(SettingOutlined),
      label: "Manage Testing Services & Pricing",
    },
    {
      key: "manage_articles",
      icon: React.createElement(FormOutlined),
      label: "Manage Blog Articles",
    },
    {
      key: "dashboard_reports",
      icon: React.createElement(SolutionOutlined),
      label: "View Dashboard & Reports",
    },
    {
      key: "handle_feedback",
      icon: React.createElement(EyeOutlined), // Reusing EyeOutlined, consider a more specific icon if available
      label: "Handle Service/Consultant Feedback",
    },
    {
      key: "manage_payments",
      icon: React.createElement(CreditCardOutlined),
      label: "Manage Payment & Transaction Records",
    },
    {
      key: "manage_rooms",
      icon: React.createElement(MedicineBoxOutlined),
      label: "Manage Medical Rooms",
    },
    {
      key: "manage_specializations",
      icon: React.createElement(SolutionOutlined),
      label: "Manage Specializations",
    },
  ];

  const [selectedMenuItem, setSelectedMenuItem] = useState("manage_users"); // Default selected item

  const feedbacks = [
    {
      id: 1,
      type: "Service",
      subject: "Appointment Booking",
      message: "Difficulty with booking.",
      status: "Pending",
    },
    {
      id: 2,
      type: "Consultant",
      subject: "Dr. Jane Doe",
      message: "Very helpful consultation.",
      status: "Resolved",
    },
  ];

  const payments = [
    {
      id: 1,
      transactionId: "TXN001",
      user: "John Doe",
      amount: "500,000đ",
      date: "2024-03-20",
      status: "Completed",
    },
    {
      id: 2,
      transactionId: "TXN002",
      user: "Jane Smith",
      amount: "1,500,000đ",
      date: "2024-03-21",
      status: "Pending",
    },
  ];

  // Column Definitions
  const userColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "Admin"
              ? "volcano"
              : role === "Consultant"
              ? "geekblue"
              : "green"
          }
        >
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteUser(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const serviceColumns = [
    { title: "Service Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Duration (minutes)",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => (duration ? Math.floor(duration / 60) : "N/A"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "CONSULTING" ? "blue" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price?.toLocaleString() || 0}đ`,
    },
    {
      title: "Discount",
      dataIndex: "discountPercent",
      key: "discountPercent",
      render: (discount) => `${discount || 0}%`,
    },
    {
      title: "Is Combo",
      dataIndex: "isCombo",
      key: "isCombo",
      render: (isCombo) => (
        <Tag color={isCombo ? "orange" : "default"}>
          {isCombo ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewServiceDetail(record)}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditService(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteService(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const articleColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditArticle(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteArticle(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const feedbackColumns = [
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Message", dataIndex: "message", key: "message" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} size="small">
            View
          </Button>
          <Button icon={<SolutionOutlined />} size="small">
            Resolve
          </Button>
        </Space>
      ),
    },
  ];

  const paymentColumns = [
    { title: "User", dataIndex: "user", key: "user" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button icon={<EyeOutlined />} size="small">
          View Details
        </Button>
      ),
    },
  ];

  const roomColumns = [
    { title: "Room Name", dataIndex: "name", key: "name" },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => setIsRoomModalVisible(true)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => message.success("Deleted")}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const specializationColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditSpecialization(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteSpecialization(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditUser = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsUserModalVisible(true);
  };

  // Modal handlers
  const handleUserModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Sửa user
        await updateUser(editingUser.id, values);
      } else {
        // Thêm user
        await addUser(values);
      }
      setIsUserModalVisible(false);
      form.resetFields();
      setEditingUser(null);
      // Cập nhật lại danh sách
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
    }
  };

  const handleServiceModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingService) {
        // Chỉnh sửa service hiện có
        await updateService(editingService.id, values);
      } else {
        // Tạo service mới
        if (values.isCombo) {
          // Tạo combo service
          const comboData = {
            name: values.name,
            description: values.description,
            duration: values.duration ? parseInt(values.duration) * 60 : null,
            type: values.type,
            price: values.price ? parseFloat(values.price) : 0,
            isCombo: true,
            discountPercent: values.discountPercent
              ? parseFloat(values.discountPercent)
              : 0,
            subServiceIds: values.subServiceIds || [],
          };
          await createComboService(comboData);
        } else {
          // Tạo regular service
          await addService(values);
        }
      }

      setIsServiceModalVisible(false);
      form.resetFields();
      setEditingService(null);
      setIsComboService(false);

      // Cập nhật lại danh sách dịch vụ
      const data = await fetchServices();
      setServices(data);

      message.success(
        editingService
          ? "Cập nhật dịch vụ thành công!"
          : "Tạo dịch vụ thành công!"
      );
    } catch (error) {
      console.error("Lỗi cập nhật dịch vụ:", error);
      message.error("Có lỗi xảy ra khi xử lý dịch vụ!");
    }
  };

  const handleEditService = async (record) => {
    try {
      // Lấy chi tiết service từ API theo ID
      const serviceDetail = await fetchServiceById(record.id);
      setEditingService(serviceDetail);

      // Chuyển đổi duration từ seconds về minutes để hiển thị trong form
      const formData = {
        ...serviceDetail,
        duration: serviceDetail.duration
          ? Math.floor(serviceDetail.duration / 60)
          : null,
      };
      form.setFieldsValue(formData); // Đổ dữ liệu dịch vụ lên form
      setIsServiceModalVisible(true); // Mở modal
    } catch (error) {
      console.error("Lỗi lấy chi tiết dịch vụ:", error);
      message.error("Không thể lấy thông tin chi tiết dịch vụ!");
    }
  };

  const handleViewServiceDetail = async (record) => {
    try {
      // Lấy chi tiết service từ API theo ID
      const detail = await fetchServiceById(record.id);
      setServiceDetail(detail);
      setIsServiceDetailModalVisible(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết dịch vụ:", error);
      message.error("Không thể lấy thông tin chi tiết dịch vụ!");
    }
  };

  const handleDeleteService = async (id) => {
    await deleteService(id);
    const data = await fetchServices();
    setServices(data);
  };

  // Handle search service
  const handleSearchService = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      setSearchTerm("");
      return;
    }

    try {
      setIsSearching(true);
      setSearchTerm(value);
      const results = await searchServiceByName(value.trim());
      // Nếu kết quả là object, wrap thành array
      const searchData = Array.isArray(results) ? results : [results];
      setSearchResults(searchData);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setSearchResults([]);
      message.error("Không tìm thấy dịch vụ nào!");
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleBlogModalOk = async () => {
    try {
      const values = await blogForm.validateFields();
      if (editingArticle) {
        await updateArticle(editingArticle.id, values);
      } else {
        await addArticle(values);
      }
      setIsBlogModalVisible(false);
      setEditingArticle(null);
      const data = await fetchArticles();
      setArticles(data);
    } catch (error) {
      console.error("Lỗi cập nhật bài viết:", error);
    }
  };

  const handleEditArticle = (record) => {
    setEditingArticle(record);
    blogForm.setFieldsValue(record);
    setIsBlogModalVisible(true);
  };

  const handleDeleteArticle = async (id) => {
    await deleteArticle(id);
    const data = await fetchArticles();
    setArticles(data);
  };

  // Hàm upload ảnh lên Supabase Storage
  const handleUpload = async (file) => {
    if (!(file instanceof File)) {
      message.error("File không hợp lệ!");
      return;
    }
    const filePath = `articles/${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("image")
      .upload(filePath, file, { upsert: true });
    if (error) {
      console.error("Upload error:", error);
      message.error("Upload failed: " + error.message);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("image")
      .getPublicUrl(filePath);
    setImageUrl(urlData.publicUrl);
    blogForm.setFieldsValue({ image_url: urlData.publicUrl });
  };

  const handleRoomModalOk = () => {
    form.validateFields().then((values) => {
      console.log("Room Form values:", values);
      setIsRoomModalVisible(false);
      form.resetFields();
    });
  };

  // Specialization handlers
  const handleEditSpecialization = (record) => {
    setEditingSpecialization(record);
    form.setFieldsValue(record);
    setIsSpecializationModalVisible(true);
  };

  const handleSpecializationModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSpecialization) {
        // Sửa specialization
        await updateSpecialization(editingSpecialization.id, values);
        message.success("Cập nhật specialization thành công!");
      } else {
        // Thêm specialization
        await addSpecialization(values);
        message.success("Thêm specialization thành công!");
      }
      setIsSpecializationModalVisible(false);
      form.resetFields();
      setEditingSpecialization(null);
      // Cập nhật lại danh sách
      const data = await fetchSpecializations();
      setSpecializations(data);
    } catch (error) {
      console.error("Lỗi cập nhật specialization:", error);
      message.error("Có lỗi xảy ra khi xử lý specialization!");
    }
  };

  const handleDeleteSpecialization = async (id) => {
    try {
      await deleteSpecialization(id);
      message.success("Xóa specialization thành công!");
      // Cập nhật lại danh sách
      const data = await fetchSpecializations();
      setSpecializations(data);
    } catch (error) {
      console.error("Lỗi xóa specialization:", error);
      message.error("Có lỗi xảy ra khi xóa specialization!");
    }
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "manage_users":
        return (
          <Card
            title="Manage User Accounts & Roles"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsUserModalVisible(true)}
              >
                Add User
              </Button>
            }
          >
            <Table columns={userColumns} dataSource={users} rowKey="id" />
          </Card>
        );
      case "manage_services":
        return (
          <Card
            title="Manage Testing Services & Pricing"
            extra={
              <Space>
                <Input.Search
                  placeholder="Search services by name..."
                  allowClear
                  loading={isSearching}
                  onSearch={handleSearchService}
                  onChange={(e) => {
                    if (!e.target.value) {
                      handleClearSearch();
                    }
                  }}
                  style={{ width: 250 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsServiceModalVisible(true)}
                >
                  Add Service
                </Button>
              </Space>
            }
          >
            {searchTerm && (
              <div style={{ marginBottom: 16 }}>
                <Tag color="blue">
                  Search results for: "{searchTerm}" ({searchResults.length}{" "}
                  found)
                </Tag>
                <Button type="link" size="small" onClick={handleClearSearch}>
                  Clear search
                </Button>
              </div>
            )}
            <Table
              columns={serviceColumns}
              dataSource={searchTerm ? searchResults : services}
              rowKey="id"
              locale={{
                emptyText: searchTerm
                  ? `No services found for "${searchTerm}"`
                  : "No services available",
              }}
            />
          </Card>
        );
      case "manage_articles":
        return (
          <Card
            title="Manage Blog Articles"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingArticle(null);
                  blogForm.resetFields();
                  setIsBlogModalVisible(true);
                }}
              >
                Create Article
              </Button>
            }
          >
            <Table columns={articleColumns} dataSource={articles} rowKey="id" />
          </Card>
        );
      case "dashboard_reports":
        return (
          <Card title="Dashboard & Reports">
            <p>
              Admin dashboard with analytics and reports will be displayed here.
            </p>
            {/* Placeholder for charts/graphs */}
          </Card>
        );
      case "handle_feedback":
        return (
          <Card title="Handle Service/Consultant Feedback">
            <Table
              columns={feedbackColumns}
              dataSource={feedbacks}
              rowKey="id"
            />
          </Card>
        );
      case "manage_payments":
        return (
          <Card title="Manage Payment & Transaction Records">
            <Table columns={paymentColumns} dataSource={payments} rowKey="id" />
          </Card>
        );
      case "manage_rooms":
        return (
          <Card
            title="Manage Medical Rooms"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsRoomModalVisible(true)}
              >
                Add Room
              </Button>
            }
          >
            <Table columns={roomColumns} dataSource={rooms} rowKey="id" />
          </Card>
        );
      case "manage_specializations":
        return (
          <Card
            title="Manage Specializations"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingSpecialization(null);
                  form.resetFields();
                  setIsSpecializationModalVisible(true);
                }}
              >
                Add Specialization
              </Button>
            }
          >
            <Table
              columns={specializationColumns}
              dataSource={specializations}
              rowKey="id"
            />
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Admin Dashboard
        </Title>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
            justifyContent: "flex-end",
          }} /* Align right */
        />
      </Header>
      <Layout>
        <Sider width={280} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["manage_users"]}
            defaultOpenKeys={["manage_users"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items2}
            onSelect={({ key }) => setSelectedMenuItem(key)}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb
            items={[
              { title: "Home" },
              { title: "Admin" },
              {
                title: selectedMenuItem
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
              },
            ]}
            style={{ margin: "16px 0" }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>

      {/* Modals for Admin Actions */}
      <UserModal
        visible={isUserModalVisible}
        onOk={handleUserModalOk}
        onCancel={() => setIsUserModalVisible(false)}
        form={form}
        editingUser={editingUser}
      />

      <ServiceModal
        visible={isServiceModalVisible}
        onOk={handleServiceModalOk}
        onCancel={() => {
          setIsServiceModalVisible(false);
          setEditingService(null);
        }}
        form={form}
        editingService={editingService}
        isComboService={isComboService}
        setIsComboService={setIsComboService}
        availableServices={availableServices}
        fetchAvailableServices={fetchAvailableServices}
        setAvailableServices={setAvailableServices}
      />

      <ServiceDetailModal
        visible={isServiceDetailModalVisible}
        onCancel={() => {
          setIsServiceDetailModalVisible(false);
          setServiceDetail(null);
        }}
        serviceDetail={serviceDetail}
      />

      <BlogModal
        visible={isBlogModalVisible}
        onOk={handleBlogModalOk}
        onCancel={() => setIsBlogModalVisible(false)}
        form={blogForm}
        editingArticle={editingArticle}
        imageUrl={imageUrl}
        handleUpload={handleUpload}
      />

      <RoomModal
        visible={isRoomModalVisible}
        onOk={handleRoomModalOk}
        onCancel={() => setIsRoomModalVisible(false)}
        form={form}
        editingRoom={null} // You can add editingRoom state if needed
      />

      <SpecializationModal
        visible={isSpecializationModalVisible}
        onOk={handleSpecializationModalOk}
        onCancel={() => {
          setIsSpecializationModalVisible(false);
          setEditingSpecialization(null);
          form.resetFields();
        }}
        form={form}
        editingSpecialization={editingSpecialization}
      />
    </Layout>
  );
}

export default Admin;
