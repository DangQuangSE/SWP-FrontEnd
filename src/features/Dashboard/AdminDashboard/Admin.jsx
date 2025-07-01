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
  Tabs,
} from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import api from "../../../configs/api";

// Import Specialization components
import { SpecializationManagement } from "./Specialization";

// Import Service Management component
import ServiceManagement from "./ServiceModal/ServiceManagement";

// Import Room Management component
import { RoomManagement } from "./Room";

// Import Blog Management component
import BlogManagement from "./Blog/BlogManagement";

import { UserModal } from "./index";
import { UserManagement } from "./UserManagement";
    
import BookingDashboard from "./BookingDashboard/BookingDashboard";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function Admin() {
  const [imageUrl, setImageUrl] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);

  const [form] = Form.useForm();

  //  Di chuyển selectedMenuItem lên đây để tránh lỗi hooks order
  const [selectedMenuItem, setSelectedMenuItem] = useState("manage_users");

  // Function to get Vietnamese breadcrumb title
  const getBreadcrumbTitle = (menuKey) => {
    const titleMap = {
      manage_users: "Quản lý Tài khoản & Vai trò",
      manage_services: "Quản lý Dịch vụ Xét nghiệm & Giá cả",
      manage_articles: "Quản lý Bài viết Blog",
      manage_bookings: "Quản lý Lịch hẹn",
      dashboard_reports: "Xem Dashboard & Báo cáo",
      // handle_feedback: "Xử lý Phản hồi Dịch vụ/Tư vấn",
      manage_payments: "Quản lý Thanh toán & Giao dịch",
      manage_rooms: "Quản lý Phòng khám",
      manage_specializations: "Quản lý Chuyên khoa",
    };
    return titleMap[menuKey] || menuKey;
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu items for the top navigation
  const items1 = ["Dashboard", "Reports"].map((label, key) => ({
    key: String(key + 1),
    label,
  }));

  // Lấy danh sách user từ API
  const fetchUsers = async () => {
    try {
      console.log("🔄 Fetching all users from all roles...");
      const roles = ["CUSTOMER", "STAFF", "CONSULTANT"];
      const allUsers = [];

      // Gọi API cho từng role
      for (const role of roles) {
        try {
          const response = await api.get(`/admin/users?role=${role}`);
          const users = Array.isArray(response.data)
            ? response.data
            : [response.data];
          allUsers.push(...users);
          console.log(`✅ Fetched ${users.length} users with role ${role}`);
        } catch (roleError) {
          console.warn(
            `⚠️ Không thể lấy users với role ${role}:`,
            roleError.message
          );
        }
      }

      console.log(`✅ Total fetched users: ${allUsers.length}`);
      return allUsers;
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách user:", error);
      console.error("Error details:", error.response?.data);
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
      console.log("🔄 Adding user:", user);
      const response = await api.post("/admin/user", user);
      console.log("✅ User added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi thêm user:", error);
      console.error("Error details:", error.response?.data);
      throw error;
    }
  };

  // Sửa user
  const updateUser = async (id, user) => {
    try {
      console.log("🔄 Updating user:", id, user);
      const response = await api.put(`/admin/user/${id}`, user);
      console.log("✅ User updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi sửa user:", error);
      console.error("Error details:", error.response?.data);
      throw error;
    }
  };

  // Xóa user
  const deleteUser = async (id) => {
    try {
      console.log("🔄 Deleting user:", id);
      await api.delete(`/users/${id}`);
      console.log("✅ User deleted successfully");
    } catch (error) {
      console.error("❌ Lỗi xóa user:", error);
      console.error("Error details:", error.response?.data);
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
      label: "Quản lý Tài khoản & Vai trò",
    },
    {
      key: "manage_services",
      icon: React.createElement(SolutionOutlined),
      label: "Quản lý Dịch vụ Xét nghiệm & Giá cả",
    },
    {
      key: "manage_bookings",
      icon: React.createElement(CalendarOutlined),
      label: "Quản lý Lịch hẹn",
    },
    {
      key: "manage_articles",
      icon: React.createElement(FileTextOutlined),
      label: "Quản lý Bài viết Blog",
    },
    {
      key: "dashboard_reports",
      icon: React.createElement(BarChartOutlined),
      label: "Xem Dashboard & Báo cáo",
    },
    // {
    //   key: "handle_feedback",
    //   icon: React.createElement(EyeOutlined),
    //   label: "Xử lý Phản hồi Dịch vụ/Tư vấn",
    // },
    {
      key: "manage_payments",
      icon: React.createElement(SolutionOutlined),
      label: "Quản lý Thanh toán & Giao dịch",
    },
    {
      key: "manage_rooms",
      icon: React.createElement(TeamOutlined),
      label: "Quản lý Phòng khám",
    },
    {
      key: "manage_specializations",
      icon: React.createElement(SolutionOutlined),
      label: "Quản lý Chuyên khoa",
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

  const handleEditUser = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsUserModalVisible(true);
  };

  // Modal handlers
  const handleUserModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("📝 Form values:", values);

      if (editingUser) {
        console.log("🔄 Updating existing user:", editingUser.id);
        await updateUser(editingUser.id, values);
        message.success("Cập nhật người dùng thành công!");
      } else {
        console.log("🔄 Adding new user");
        await addUser(values);
        message.success("Thêm người dùng thành công!");
      }

      setIsUserModalVisible(false);
      form.resetFields();
      setEditingUser(null);

      // Refresh user list
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("❌ Lỗi cập nhật người dùng:", error);

      if (error.response?.status === 404) {
        message.error("Không tìm thấy API endpoint. Vui lòng kiểm tra server!");
      } else if (error.response?.status === 400) {
        message.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
      } else if (error.response?.status === 500) {
        message.error("Lỗi server. Vui lòng thử lại sau!");
      } else {
        message.error("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    }
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "manage_users":
        return <UserManagement form={form} />;
      case "manage_services":
        return <ServiceManagement />;
      case "manage_bookings":
        return <BookingDashboard />;
      case "manage_articles":
        return <BlogManagement userId={null} selectedTab="write_blogs" />;
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
        return <RoomManagement />;
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
              { title: "Trang chủ" },
              { title: "Quản trị" },
              {
                title: getBreadcrumbTitle(selectedMenuItem),
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
    </Layout>
  );
}

export default Admin;
