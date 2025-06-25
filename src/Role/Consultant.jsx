import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "./Consultant.css";
import api from "../configs/api";
import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Tabs,
  List,
  Typography,
  Row,
  Col,
  Tag,
  Space,
  Breadcrumb,
  theme,
  notification,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  LaptopOutlined,
  NotificationOutlined,
  SolutionOutlined, // For consultation
  ScheduleOutlined, // For schedule management
  FormOutlined, // For writing blogs
  CommentOutlined, // For feedback/comments
  ProfileOutlined, // For user profile
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

function Consultant() {
  const handleDeleteBlog = (id) => {
    const updatedBlogs = blogArticles.filter((blog) => blog.id !== id);
    setBlogArticles(updatedBlogs);
    localStorage.setItem("blogArticles", JSON.stringify(updatedBlogs));
  };
  const [editingBlog, setEditingBlog] = useState(null);
  const [isEditBlogModalVisible, setIsEditBlogModalVisible] = useState(false);
  const [isConsultationModalVisible, setIsConsultationModalVisible] =
    useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isCreateBlogModalVisible, setIsCreateBlogModalVisible] =
    useState(false);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [form] = Form.useForm();

  // Lấy thông tin user từ Redux
  const user = useSelector((state) => state.user);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Function để fetch dữ liệu lịch làm việc
  const fetchScheduleData = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingSchedule(true);
      const response = await api.get(
        `/schedules/view?consultant_id=${user.id}`
      );
      setScheduleData(response.data);
      console.log("Schedule data loaded:", response.data);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu lịch làm việc",
        placement: "topRight",
      });
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  // Load dữ liệu khi component mount hoặc user thay đổi
  useEffect(() => {
    fetchScheduleData();
  }, [user?.id]);

  // Menu items for the top navigation (can be adapted for consultant dashboard)
  const items1 = ["Dashboard", "My Schedule", "Settings"].map((label, key) => ({
    key: String(key + 1),
    label,
  }));

  const [blogArticles, setBlogArticles] = useState(() => {
    // Lấy dữ liệu từ localStorage khi load trang
    return JSON.parse(localStorage.getItem("blogArticles") || "[]");
  });

  const handleCreateBlog = () => {
    form.validateFields().then((values) => {
      const newBlog = {
        id: Date.now(),
        title: values.title,
        content: values.content,
        date: values.date.format("YYYY-MM-DD"),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
      };
      const updatedBlogs = [newBlog, ...blogArticles];
      setBlogArticles(updatedBlogs);
      localStorage.setItem("blogArticles", JSON.stringify(updatedBlogs));
      setIsCreateBlogModalVisible(false);
      form.resetFields();
    });
  };

  // Menu items for the side navigation
  const items2 = [
    {
      key: "personal_schedule",
      icon: React.createElement(CalendarOutlined),
      label: "Personal Consultation Schedule",
    },
    {
      key: "user_profiles",
      icon: React.createElement(UserOutlined),
      label: "User Profiles",
    },
    {
      key: "online_consultation",
      icon: React.createElement(SolutionOutlined),
      label: "Online Consultation",
    },
    {
      key: "consultation_results",
      icon: React.createElement(EditOutlined),
      label: "Send Consultation Results",
    },
    {
      key: "manage_schedule",
      icon: React.createElement(ScheduleOutlined),
      label: "Manage Work Schedule",
    },
    {
      key: "write_blogs",
      icon: React.createElement(FormOutlined),
      label: "Write Blogs",
    },
    {
      key: "view_feedback",
      icon: React.createElement(CommentOutlined),
      label: "View Feedback/Comments",
    },
  ];

  const [selectedMenuItem, setSelectedMenuItem] = useState("personal_schedule"); // Default selected item

  // Mock data - Replace with actual API calls
  const personalConsultations = [
    {
      id: 1,
      date: "2024-03-25",
      time: "10:00 AM",
      patient: "Alice Wonderland",
      status: "Confirmed",
    },
    {
      id: 2,
      date: "2024-03-25",
      time: "02:30 PM",
      patient: "Bob The Builder",
      status: "Pending",
    },
  ];

  const userProfiles = [
    {
      id: 1,
      name: "Alice Wonderland",
      age: 30,
      gender: "Female",
      medicalHistory: "None",
    },
    {
      id: 2,
      name: "Bob The Builder",
      age: 45,
      gender: "Male",
      medicalHistory: "Hypertension",
    },
  ];

  const feedback = [
    {
      id: 1,
      source: "Blog: Common Cold",
      comment: "Very informative article!",
      date: "2024-03-21",
    },
    {
      id: 2,
      source: "Service: Online Consultation",
      comment: "Great consultation, very helpful.",
      date: "2024-03-22",
    },
  ];

  const consultationColumns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Patient", dataIndex: "patient", key: "patient" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<SolutionOutlined />}
            size="small"
            onClick={() => setIsConsultationModalVisible(true)}
          >
            Conduct
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => setIsResultModalVisible(true)}
          >
            Send Results
          </Button>
        </Space>
      ),
    },
  ];

  const userProfileColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Medical History",
      dataIndex: "medicalHistory",
      key: "medicalHistory",
    },
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

  const blogColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Views", dataIndex: "viewCount", key: "viewCount" },
    { title: "Likes", dataIndex: "likeCount", key: "likeCount" },
    { title: "Comments", dataIndex: "commentCount", key: "commentCount" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingBlog(record);
              form.setFieldsValue({
                title: record.title,
                content: record.content,
                date: dayjs(record.date),
              });
              setIsEditBlogModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDeleteBlog(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const feedbackColumns = [
    { title: "Source", dataIndex: "source", key: "source" },
    { title: "Comment", dataIndex: "comment", key: "comment" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button icon={<EyeOutlined />} size="small">
          View
        </Button>
      ),
    },
  ];

  // Columns cho bảng hiển thị lịch làm việc
  const scheduleColumns = [
    { title: "Ngày", dataIndex: "workDate", key: "workDate" },
    {
      title: "Thời gian",
      key: "timeSlots",
      render: (_, record) => (
        <div>
          {record.slots?.map((slot, index) => (
            <Tag
              key={index}
              color="blue"
              style={{ marginBottom: 4, display: "block" }}
            >
              {slot.startTime} - {slot.endTime}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Số lượng booking",
      key: "bookings",
      render: (_, record) => (
        <div>
          {record.slots?.map((slot, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              {slot.currentBooking}/{slot.maxBooking}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Còn trống",
      key: "available",
      render: (_, record) => (
        <div>
          {record.slots?.map((slot, index) => (
            <Tag
              key={index}
              color={slot.availableBooking > 0 ? "green" : "red"}
              style={{ marginBottom: 4, display: "block" }}
            >
              {slot.availableBooking}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  const handleConductConsultation = () => {
    form.validateFields().then((values) => {
      console.log("Consultation values:", values);
      setIsConsultationModalVisible(false);
      form.resetFields();
    });
  };

  const handleSendResult = () => {
    form.validateFields().then((values) => {
      console.log("Result values:", values);
      setIsResultModalVisible(false);
      form.resetFields();
    });
  };

  const handleManageSchedule = async () => {
    try {
      const values = await form.validateFields();
      setIsScheduleLoading(true);

      // Chuẩn bị dữ liệu theo format API yêu cầu
      const scheduleData = {
        scheduleItems: [
          {
            workDate: values.date.format("YYYY-MM-DD"),
            timeSlotDTO: {
              startTime: values.timeFrom.format("HH:mm"),
              endTime: values.timeTo.format("HH:mm"),
            },
          },
        ],
      };

      // Gọi API đăng ký lịch làm việc
      const response = await api.post("/schedules/register", scheduleData);

      console.log("Schedule registered successfully:", response.data);

      // Hiển thị thông báo thành công
      notification.success({
        message: "Thành công",
        description: "Đăng ký lịch làm việc thành công!",
        placement: "topRight",
      });

      // Refresh dữ liệu lịch làm việc
      await fetchScheduleData();

      setIsScheduleModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error registering schedule:", error);

      // Hiển thị thông báo lỗi
      if (error.response) {
        notification.error({
          message: "Lỗi",
          description:
            error.response.data.message || "Không thể đăng ký lịch làm việc",
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến server. Vui lòng thử lại!",
          placement: "topRight",
        });
      }
    } finally {
      setIsScheduleLoading(false);
    }
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "personal_schedule":
        return (
          <Card title="Personal Consultation Schedule">
            <Table
              columns={consultationColumns}
              dataSource={personalConsultations}
              rowKey="id"
            />
          </Card>
        );
      case "user_profiles":
        return (
          <Card title="User Profiles">
            <Table
              columns={userProfileColumns}
              dataSource={userProfiles}
              rowKey="id"
            />
          </Card>
        );
      case "online_consultation":
        return (
          <Card title="Online Consultation">
            <Button
              type="primary"
              icon={<SolutionOutlined />}
              onClick={() => setIsConsultationModalVisible(true)}
            >
              Start New Consultation
            </Button>
            <p style={{ marginTop: "20px" }}>
              Details for ongoing consultations...
            </p>
          </Card>
        );
      case "consultation_results":
        return (
          <Card title="Send Consultation Results">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsResultModalVisible(true)}
            >
              Send New Result
            </Button>
            <p style={{ marginTop: "20px" }}>List of sent results...</p>
          </Card>
        );
      case "manage_schedule":
        return (
          <Card
            title="Manage Work Schedule"
            extra={
              <Button
                type="primary"
                icon={<ScheduleOutlined />}
                onClick={() => setIsScheduleModalVisible(true)}
              >
                Add/Edit Schedule Slot
              </Button>
            }
          >
            <Table
              columns={scheduleColumns}
              dataSource={scheduleData}
              rowKey="workDate"
              loading={isLoadingSchedule}
              pagination={false}
              locale={{
                emptyText: "Chưa có lịch làm việc nào được đăng ký",
              }}
            />
          </Card>
        );
      case "write_blogs":
        return (
          <Card
            title="Write Blogs"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateBlogModalVisible(true)}
              >
                Create New Blog
              </Button>
            }
          >
            <Table
              columns={blogColumns}
              dataSource={blogArticles}
              rowKey="id"
            />
          </Card>
        );
      case "view_feedback":
        return (
          <Card title="View Feedback/Comments">
            <Table
              columns={feedbackColumns}
              dataSource={feedback}
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
          Consultant Dashboard
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
        <Sider width={250} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["personal_schedule"]}
            defaultOpenKeys={["personal_schedule"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items2}
            onSelect={({ key }) => setSelectedMenuItem(key)}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb
            items={[
              { title: "Home" },
              { title: "Consultant" },
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

      {/* Modals for Consultant Actions */}
      <Modal
        title="Conduct Online Consultation"
        visible={isConsultationModalVisible}
        onOk={handleConductConsultation}
        onCancel={() => setIsConsultationModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="patientName"
            label="Patient Name"
            rules={[{ required: true, message: "Please input patient name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="consultationNotes" label="Consultation Notes">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Send Consultation Results"
        visible={isResultModalVisible}
        onOk={handleSendResult}
        onCancel={() => setIsResultModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="patientName"
            label="Patient Name"
            rules={[{ required: true, message: "Please input patient name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="results"
            label="Results"
            rules={[
              { required: true, message: "Please input consultation results!" },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Manage Work Schedule"
        visible={isScheduleModalVisible}
        onOk={handleManageSchedule}
        onCancel={() => setIsScheduleModalVisible(false)}
        confirmLoading={isScheduleLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="timeFrom"
            label="Time From"
            rules={[{ required: true, message: "Please select start time!" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="timeTo"
            label="Time To"
            rules={[{ required: true, message: "Please select end time!" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Create New Blog"
        visible={isCreateBlogModalVisible}
        onOk={handleCreateBlog}
        onCancel={() => setIsCreateBlogModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input blog title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please input blog content!" }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Blog"
        open={isEditBlogModalVisible}
        onOk={() => {
          form.validateFields().then((values) => {
            const updatedBlogs = blogArticles.map((blog) =>
              blog.id === editingBlog.id
                ? { ...blog, ...values, date: values.date.format("YYYY-MM-DD") }
                : blog
            );
            setBlogArticles(updatedBlogs);
            localStorage.setItem("blogArticles", JSON.stringify(updatedBlogs));
            setIsEditBlogModalVisible(false);
            setEditingBlog(null);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsEditBlogModalVisible(false);
          setEditingBlog(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input blog title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please input blog content!" }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Consultant;
