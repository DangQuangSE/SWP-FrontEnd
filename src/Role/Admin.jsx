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
  const [isBlogModalVisible, setIsBlogModalVisible] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
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
      const response = await api.get("/services");
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy dịch vụ:", error);
      return [];
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
      const response = await api.post("/services", service);
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm dịch vụ:", error);
      throw error;
    }
  };

  // Sửa dịch vụ
  const updateService = async (id, service) => {
    try {
      const response = await api.put(`/services/${id}`, service);
      return response.data;
    } catch (error) {
      console.error("Lỗi sửa dịch vụ:", error);
      throw error;
    }
  };

  // Xóa dịch vụ
  const deleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
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
    { title: "Service Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
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
        await updateService(editingService.id, values);
      } else {
        await addService(values);
      }
      setIsServiceModalVisible(false);
      form.resetFields();
      setEditingService(null);
      // Cập nhật lại danh sách dịch vụ
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error("Lỗi cập nhật dịch vụ:", error);
    }
  };

  const handleEditService = (record) => {
    setEditingService(record);
    form.setFieldsValue(record); // Đổ dữ liệu dịch vụ lên form
    setIsServiceModalVisible(true); // Mở modal
  };

  const handleDeleteService = async (id) => {
    await deleteService(id);
    const data = await fetchServices();
    setServices(data);
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
  const {data, error } = await supabase.storage
    .from("image")
    .upload(filePath, file, { upsert: true });
  if (error) {
    console.error("Upload error:", error);
    message.error("Upload failed: " + error.message);
    return;
  }
  const { data: urlData } = supabase.storage.from("image").getPublicUrl(filePath);
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsServiceModalVisible(true)}
              >
                Add Service
              </Button>
            }
          >
            <Table columns={serviceColumns} dataSource={services} rowKey="id" />
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
        title="Manage Service"
        visible={isServiceModalVisible}
        onOk={handleServiceModalOk}
        onCancel={() => setIsServiceModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="serviceName"
            label="Service Name"
            rules={[{ required: true, message: "Please input service name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
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
