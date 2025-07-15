import React, { useState } from "react";
import "./Admin.css";
import { Layout, Menu, Card, Form, Typography, Breadcrumb, theme } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

// Import modals
import { BlogModal } from "./index";
// Import Specialization components
import { SpecializationManagement } from "./Specialization";

// Import Service Management component
import ServiceManagement from "./ServiceModal/ServiceManagement";

// Import Room Management component
import { RoomManagement } from "./Room";

// Import Blog Management component
import BlogManagement from "./Blog/BlogManagement";

import { UserManagement } from "./UserManagement";
import { DashboardReports } from "./DashboardReports";

import BookingDashboard from "./BookingDashboard/BookingDashboard";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function Admin() {
  const [blogForm] = Form.useForm();
  const [isBlogModalVisible, setIsBlogModalVisible] = useState(false);

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
        return <DashboardReports />;
      case "handle_feedback":
        return (
          <Card title="Handle Service/Consultant Feedback">
            <p>Feedback management will be implemented here.</p>
          </Card>
        );
      case "manage_payments":
        return (
          <Card title="Manage Payment & Transaction Records">
            <p>Payment management will be implemented here.</p>
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

      <BlogModal
        visible={isBlogModalVisible}
        onOk={() => {}}
        onCancel={() => setIsBlogModalVisible(false)}
        form={blogForm}
        editingArticle={null}
        imageUrl=""
        handleUpload={() => {}}
      />
    </Layout>
  );
}

export default Admin;
