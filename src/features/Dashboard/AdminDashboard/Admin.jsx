import React, { useState, useEffect } from "react";
import "./Admin.css";
import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Form,
  Typography,
  Space,
  Breadcrumb,
  Tag,
  Popconfirm,
  message,
  theme,
} from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import api from "../../../configs/api";

// Import modals
import { UserModal, BlogModal, RoomModal } from "./index";

// Import Specialization components
import { SpecializationManagement } from "./Specialization";

// Import Service Management component
import ServiceManagement from "./ServiceModal/ServiceManagement";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function Admin() {
  const [imageUrl, setImageUrl] = useState("");
  const [blogForm] = Form.useForm();
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isBlogModalVisible, setIsBlogModalVisible] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [form] = Form.useForm();

  //  Di chuyển selectedMenuItem lên đây để tránh lỗi hooks order
  const [selectedMenuItem, setSelectedMenuItem] = useState("manage_users");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu items for the top navigation
  const items1 = ["Dashboard", "Settings", "Reports"].map((label, key) => ({
    key: String(key + 1),
    label,
  }));

  // Lấy danh sách bài viết từ backend
  const fetchArticles = async () => {
    try {
      const response = await api.get("/blog/summary");
      // Đảm bảo trả về array
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      return data;
    } catch (error) {
      message.error("Lỗi lấy danh sách bài viết!");
      return [];
    }
  };

  // Xóa bài viết
  const deleteArticle = async (id) => {
    try {
      await api.delete(`/blog/${id}`);
      message.success("Xóa bài viết thành công!");
    } catch (error) {
      message.error("Xóa bài viết thất bại!");
    }
  };

  // Lấy danh sách bài viết khi vào tab manage_articles
  useEffect(() => {
    if (selectedMenuItem === "manage_articles") {
      fetchArticles().then(setArticles);
    }
  }, [selectedMenuItem]);

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
      icon: React.createElement(FileTextOutlined),
      label: "Manage Blog Articles",
    },
    {
      key: "dashboard_reports",
      icon: React.createElement(BarChartOutlined),
      label: "View Dashboard & Reports",
    },
    {
      key: "handle_feedback",
      icon: React.createElement(EyeOutlined),
      label: "Handle Service/Consultant Feedback",
    },
    {
      key: "manage_payments",
      icon: React.createElement(SolutionOutlined),
      label: "Manage Payment & Transaction Records",
    },
    {
      key: "manage_rooms",
      icon: React.createElement(TeamOutlined),
      label: "Manage Medical Rooms",
    },
    {
      key: "manage_specializations",
      icon: React.createElement(SolutionOutlined),
      label: "Manage Specializations",
    },
  ];

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

  const articleColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (author) =>
        author && author.fullname ? author.fullname : "Không rõ",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "PUBLISHED" ? "green" : "orange"}>{status}</Tag>
      ),
    },
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
      render: (text, record) => (
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
        await updateUser(editingUser.id, values);
      } else {
        await addUser(values);
      }
      setIsUserModalVisible(false);
      form.resetFields();
      setEditingUser(null);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
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

  const handleRoomModalOk = () => {
    form.validateFields().then((values) => {
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
        return <ServiceManagement />;
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
        return <SpecializationManagement form={form} />;
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
          }}
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

      <BlogModal
        visible={isBlogModalVisible}
        onOk={() => {}}
        onCancel={() => setIsBlogModalVisible(false)}
        form={blogForm}
        editingArticle={editingArticle}
        imageUrl={imageUrl}
        handleUpload={() => {}}
      />

      <RoomModal
        visible={isRoomModalVisible}
        onOk={handleRoomModalOk}
        onCancel={() => setIsRoomModalVisible(false)}
        form={form}
        editingRoom={null}
      />
    </Layout>
  );
}

export default Admin;
