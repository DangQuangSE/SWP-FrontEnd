import React, { useState } from "react";
import "./Admin.css";
import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Modal,
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
import api from "../configs/axios";
import { useEffect } from "react";

import { supabase } from "../utils/supabaseClient";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

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

  const rooms = [
    { id: 1, name: "Room 101", capacity: 5, status: "Available" },
    { id: 2, name: "Room 102", capacity: 3, status: "Occupied" },
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
    { title: "ID", dataIndex: "id", key: "id" },
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
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
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
      {/* User Modal */}
      <Modal
        title="Manage User"
        visible={isUserModalVisible}
        onOk={handleUserModalOk}
        onCancel={() => setIsUserModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="User Name"
            rules={[{ required: true, message: "Please input user name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value="User">User</Option>
              <Option value="Consultant">Consultant</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Service Modal */}
      <Modal
        title={editingService ? "Edit Service" : "Add Service"}
        visible={isServiceModalVisible}
        onOk={handleServiceModalOk}
        onCancel={() => {
          setIsServiceModalVisible(false);
          setEditingService(null);
          setIsComboService(false);
          setAvailableServices([]);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Service Name"
            rules={[{ required: true, message: "Please input service name!" }]}
          >
            <Input placeholder="Enter service name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter service description" />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true, message: "Please input duration!" }]}
          >
            <Input type="number" placeholder="Enter duration in minutes" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Service Type"
            rules={[{ required: true, message: "Please select service type!" }]}
          >
            <Select placeholder="Select service type">
              <Option value="CONSULTING">CONSULTING</Option>
              <Option value="TESTING">TESTING</Option>
              <Option value="TREATMENT">TREATMENT</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (VND)"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
          <Form.Item name="discountPercent" label="Discount Percentage">
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="Enter discount percentage (0-100)"
            />
          </Form.Item>
          <Form.Item name="isCombo" label="Is Combo Service">
            <Select
              placeholder="Select if this is a combo service"
              onChange={(value) => {
                setIsComboService(value);
                if (value) {
                  // Load available services khi chọn combo
                  fetchAvailableServices().then(setAvailableServices);
                }
              }}
            >
              <Option value={false}>No</Option>
              <Option value={true}>Yes</Option>
            </Select>
          </Form.Item>

          {/* Hiển thị trường sub-services khi isCombo = true */}
          {isComboService && (
            <Form.Item
              name="subServiceIds"
              label="Sub Services"
              rules={[
                { required: true, message: "Please select sub services!" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select sub services"
                loading={availableServices.length === 0}
              >
                {availableServices.map((service) => (
                  <Option key={service.id} value={service.id}>
                    {service.name} - {service.price?.toLocaleString() || 0}đ
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item name="isActive" label="Status">
            <Select placeholder="Select status">
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Service Detail Modal */}
      <Modal
        title="Service Details"
        visible={isServiceDetailModalVisible}
        onCancel={() => {
          setIsServiceDetailModalVisible(false);
          setServiceDetail(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => setIsServiceDetailModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={600}
      >
        {serviceDetail && (
          <div>
            <p>
              <strong>ID:</strong> {serviceDetail.id}
            </p>
            <p>
              <strong>Name:</strong> {serviceDetail.name}
            </p>
            <p>
              <strong>Description:</strong> {serviceDetail.description}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {serviceDetail.duration
                ? Math.floor(serviceDetail.duration / 60)
                : "N/A"}{" "}
              minutes
            </p>
            <p>
              <strong>Type:</strong>
              <Tag
                color={serviceDetail.type === "CONSULTING" ? "blue" : "green"}
                style={{ marginLeft: 8 }}
              >
                {serviceDetail.type}
              </Tag>
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {serviceDetail.price?.toLocaleString() || 0}đ
            </p>
            <p>
              <strong>Discount:</strong> {serviceDetail.discountPercent || 0}%
            </p>
            <p>
              <strong>Is Combo:</strong>
              <Tag
                color={serviceDetail.isCombo ? "orange" : "default"}
                style={{ marginLeft: 8 }}
              >
                {serviceDetail.isCombo ? "Yes" : "No"}
              </Tag>
            </p>
            <p>
              <strong>Status:</strong>
              <Tag
                color={serviceDetail.isActive ? "green" : "red"}
                style={{ marginLeft: 8 }}
              >
                {serviceDetail.isActive ? "Active" : "Inactive"}
              </Tag>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(serviceDetail.createdAt).toLocaleString("vi-VN")}
            </p>
            {serviceDetail.subServiceIds &&
              serviceDetail.subServiceIds.length > 0 && (
                <p>
                  <strong>Sub Service IDs:</strong>{" "}
                  {serviceDetail.subServiceIds.join(", ")}
                </p>
              )}
            {serviceDetail.subServices &&
              serviceDetail.subServices.length > 0 && (
                <div>
                  <p>
                    <strong>Sub Services:</strong>
                  </p>
                  <div style={{ marginLeft: 16 }}>
                    {serviceDetail.subServices.map((subService, index) => (
                      <div
                        key={subService.id}
                        style={{
                          marginBottom: 8,
                          padding: 8,
                          border: "1px solid #f0f0f0",
                          borderRadius: 4,
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          <strong>
                            {index + 1}. {subService.name}
                          </strong>
                        </p>
                        <p
                          style={{ margin: 0, fontSize: "12px", color: "#666" }}
                        >
                          {subService.description}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px" }}>
                          Price: {subService.price?.toLocaleString() || 0}đ |
                          Duration:{" "}
                          {subService.duration
                            ? Math.floor(subService.duration / 60)
                            : "N/A"}{" "}
                          minutes | Type:{" "}
                          <Tag
                            size="small"
                            color={
                              subService.type === "CONSULTING"
                                ? "blue"
                                : "green"
                            }
                          >
                            {subService.type}
                          </Tag>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>

      {/* Blog Modal */}
      <Modal
        title="Manage Blog Article"
        visible={isBlogModalVisible}
        onOk={handleBlogModalOk}
        onCancel={() => setIsBlogModalVisible(false)}
      >
        <Form form={blogForm} layout="vertical">
          <Form.Item
            name="title"
            label="Article Title"
            rules={[{ required: true, message: "Please input article title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: "Please input author name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <Input.TextArea rows={8} />
          </Form.Item>
          {/* Tách riêng Form.Item cho ảnh và status */}
          <Form.Item label="Ảnh minh họa" name="image_url">
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

      {/* Room Modal */}
      <Modal
        title="Manage Medical Room"
        open={isRoomModalVisible}
        onOk={handleRoomModalOk}
        onCancel={() => setIsRoomModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="roomName"
            label="Room Name"
            rules={[{ required: true, message: "Please input room name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: "Please input capacity!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="Available">Available</Option>
              <Option value="Occupied">Occupied</Option>
              <Option value="Maintenance">Maintenance</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Admin;
