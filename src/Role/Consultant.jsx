import React, { useState, useEffect } from "react";
import "./Consultant.css";

import jwt_decode from "jwt-decode";
import {
  Layout,
  Menu,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Typography,
  Tag,
  Space,
  Breadcrumb,
  theme,
  Popconfirm,
  Table,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  SolutionOutlined,
  ScheduleOutlined,
  FormOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchBlogs,
  fetchBlogDetail,
  createBlog,
  likeBlog,
  deleteBlog,
  uploadImage,
  fetchAvailableSlots,
  fetchConsultantSchedule,
  cancelSchedule,
  registerSchedule,
} from "../configs/consultantService";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function Consultant() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("personal_schedule");
  const token = useSelector((state) => state.user.jwt || state.user.token);
  let userId;
  if (token) {
    try {
      const decoded = jwt_decode(token);
      userId = decoded.id;
    } catch {
      userId = null;
    }
  }

  // Form
  const [createBlogForm] = Form.useForm();
  const [editBlogForm] = Form.useForm();
  const [consultForm] = Form.useForm();
  const [resultForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();

  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [personalConsultations, setPersonalConsultations] = useState([]);
  const [manageSchedules, setManageSchedules] = useState([]);
  const [isEditBlogModalVisible, setIsEditBlogModalVisible] = useState(false);
  const [isConsultationModalVisible, setIsConsultationModalVisible] =
    useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isCreateBlogModalVisible, setIsCreateBlogModalVisible] =
    useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Lấy thông tin user từ Redux
  const user = useSelector((state) => state.user);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // BLOG STATE & API
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState({});
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Lịch tư vấn cá nhân
  const loadPersonalConsultations = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const res = await fetchAvailableSlots(userId, today, oneMonthLater);
      const slots = (res.data || []).map((slot) => ({
        id: slot.id || slot.slotId,
        date: slot.workDate || slot.date,
        time:
          slot.startTime && slot.endTime
            ? `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(
                0,
                5
              )}`
            : "",
        patient: `${slot.currentBooking || 0}/${slot.maxBooking || 0}`,
        status: slot.status || "ACTIVE",
      }));
      setPersonalConsultations(slots);
    } catch {
      setPersonalConsultations([]);
    }
  };

  // Lịch làm việc
  const loadManageSchedules = async () => {
    try {
      const res = await fetchConsultantSchedule(userId);
      const flattenedSchedule = (res.data || []).flatMap((workDateItem) =>
        (workDateItem.slots || []).map((slot) => ({
          id: slot.slotId || slot.id,
          date: workDateItem.workDate,
          time:
            slot.startTime && slot.endTime
              ? `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(
                  0,
                  5
                )}`
              : "",
          patient: `${slot.currentBooking || 0}/${slot.maxBooking || 0}`,
          status: slot.status || "ACTIVE",
        }))
      );
      setManageSchedules(flattenedSchedule);
    } catch {
      setManageSchedules([]);
    }
  };

  // BLOG
  const loadBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const res = await fetchBlogs();
      setBlogs(
        (res.data || []).map((blog) => ({
          ...blog,
          id: blog.id || blog.blog_id, // Đảm bảo luôn có id
        }))
      );
    } catch {
      toast.error("Không thể tải danh sách blog");
      setBlogs([]);
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Lấy chi tiết blog - GÁN GIÁ TRỊ MẶC ĐỊNH
  const handleFetchBlogDetail = async (id) => {
    try {
      const res = await fetchBlogDetail(id);
      const blog = res.data || {};
      setSelectedBlog({
        id: blog.id ?? "Không có",
        title: blog.title ?? "Không có",
        author: blog.author ?? { fullname: "Không có" },
        createdAt: blog.createdAt ?? "Không có",
        updatedAt: blog.updatedAt ?? "Không có",
        viewCount: blog.viewCount ?? 0,
        likeCount: blog.likeCount ?? 0,
        status: blog.status ?? "Không có",
        imgUrl: blog.imgUrl ?? "",
        content: blog.content ?? "Không có nội dung",
      });
      setIsDetailModalVisible(true);
    } catch (err) {
      toast.error("Không thể tải chi tiết blog");
      setSelectedBlog({});
      setIsDetailModalVisible(true);
    }
  };

  // Tạo blog mới
  const handleCreateBlog = () => {
    if (!userId) {
      toast("Không tìm thấy userId. Vui lòng đăng nhập lại!");
      return;
    }
    createBlogForm.validateFields().then(async (values) => {
      try {
        // Lấy file ảnh từ input (nếu có)
        const imgFile = document.querySelector('input[type="file"]').files[0];
        await createBlog({
          title: values.title,
          content: values.content,
          status: values.status || "PUBLISHED",
          imgFile: imgFile,
          // tags: values.tags, // nếu có tag
        });
        setIsCreateBlogModalVisible(false);
        createBlogForm.resetFields();
        loadBlogs();
      } catch {
        toast("Tạo blog thất bại");
      }
    });
  };

  // Xóa blog
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
    } catch {
      toast.error("Không thể thả tim");
    }
  };

  // Upload ảnh
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const res = await uploadImage(file);
      createBlogForm.setFieldsValue({ imgUrl: res.data.secure_url });
    } catch {
      toast("Upload ảnh thất bại");
    } finally {
      setImageUploading(false);
    }
  };

  // Hủy lịch làm việc
  const handleCancelSchedule = async (record) => {
    try {
      let startTime = "08:00";
      let endTime = "09:00";
      if (record.time && record.time.includes("-")) {
        const [start, end] = record.time.split("-").map((s) => s.trim());
        startTime = start;
        endTime = end;
      }
      const scheduleData = {
        consultant_id: userId,
        date: `${record.date}T${startTime}:00`,
        startTime: startTime,
        endTime: endTime,
        reason: "Hủy lịch làm việc",
      };
      await cancelSchedule(scheduleData);
      Modal.success({ content: "Hủy lịch làm việc thành công!" });
      loadManageSchedules();
      loadPersonalConsultations();
    } catch {
      Modal.error({ content: "Hủy lịch làm việc thất bại!" });
    }
  };

  // Đăng ký lịch làm việc
  const handleManageSchedule = async () => {
    try {
      const values = await scheduleForm.validateFields();
      const workDate = values.date.format("YYYY-MM-DD");
      const timeFrom = values.timeFrom.format("HH:mm");
      const timeTo = values.timeTo.format("HH:mm");
      const requestBody = {
        scheduleItems: [
          {
            workDate: workDate,
            timeSlotDTO: {
              startTime: timeFrom,
              endTime: timeTo,
            },
          },
        ],
      };
      await registerSchedule(requestBody);
      Modal.success({ content: "Đăng ký lịch làm việc thành công!" });
      setIsScheduleModalVisible(false);
      scheduleForm.resetFields();
      loadPersonalConsultations();
    } catch {
      Modal.error({ content: "Đăng ký lịch làm việc thất bại!" });
    }
  };

  // useEffect cho từng tab
  useEffect(() => {
    if (selectedMenuItem === "personal_schedule") loadPersonalConsultations();
    if (selectedMenuItem === "manage_schedule") loadManageSchedules();
    // eslint-disable-next-line
  }, [selectedMenuItem, userId]);

  // Columns cho các bảng
  const consultationColumns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "time", key: "time" },
    { title: "Bệnh nhân", dataIndex: "patient", key: "patient" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<SolutionOutlined />}
            size="small"
            onClick={() => setIsConsultationModalVisible(true)}
          >
            Tư vấn
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => setIsResultModalVisible(true)}
          >
            Gửi kết quả
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn hủy lịch này?"
            onConfirm={() => handleCancelSchedule(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger size="small">
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const blogColumns = [
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Lượt xem", dataIndex: "viewCount", key: "viewCount" },
    { title: "Lượt thích", dataIndex: "likeCount", key: "likeCount" },
    { title: "Bình luận", dataIndex: "commentCount", key: "commentCount" },
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
              });
              setIsEditBlogModalVisible(true);
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

  // Menu
  const items1 = [
    { key: "1", label: "Trang chủ" },
    { key: "2", label: "Lịch của tôi" },
    { key: "3", label: "Cài đặt" },
  ];
  const items2 = [
    {
      key: "personal_schedule",
      icon: React.createElement(CalendarOutlined),
      label: "Lịch tư vấn cá nhân",
    },
    {
      key: "user_profiles",
      icon: React.createElement(UserOutlined),
      label: "Thông tin người dùng",
    },
    {
      key: "online_consultation",
      icon: React.createElement(SolutionOutlined),
      label: "Tư vấn trực tuyến",
    },
    {
      key: "consultation_results",
      icon: React.createElement(EditOutlined),
      label: "Gửi kết quả tư vấn",
    },
    {
      key: "manage_schedule",
      icon: React.createElement(ScheduleOutlined),
      label: "Quản lý lịch làm việc",
    },
    {
      key: "write_blogs",
      icon: React.createElement(FormOutlined),
      label: "Viết bài đăng",
    },
    {
      key: "view_feedback",
      icon: React.createElement(CommentOutlined),
      label: "Xem phản hồi/nhận xét",
    },
  ];

  // Render content theo tab
  const renderContent = () => {
    switch (selectedMenuItem) {
      case "personal_schedule":
        return (
          <Table
            columns={consultationColumns}
            dataSource={personalConsultations}
            rowKey="id"
            pagination={false}
          />
        );
      case "user_profiles":
        return <div>Thông tin người dùng</div>;
      case "online_consultation":
        return (
          <Button
            type="primary"
            onClick={() => setIsConsultationModalVisible(true)}
          >
            Tư vấn trực tuyến
          </Button>
        );
      case "consultation_results":
        return (
          <Button type="primary" onClick={() => setIsResultModalVisible(true)}>
            Gửi kết quả tư vấn
          </Button>
        );
      case "manage_schedule":
        return (
          <Table
            columns={consultationColumns}
            dataSource={manageSchedules}
            rowKey="id"
            pagination={false}
          />
        );
      case "write_blogs":
        return (
          <div>
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
          </div>
        );
      case "view_feedback":
        return <div>Xem phản hồi/nhận xét</div>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Bảng điều khiển tư vấn viên
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
              { title: "Trang chủ" },
              { title: "Tư vấn viên" },
              {
                title: items2.find((i) => i.key === selectedMenuItem)?.label,
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

      {/* Modal tạo bài đăng mới */}
      <Modal
        title="Tạo bài đăng mới"
        open={isCreateBlogModalVisible}
        onOk={handleCreateBlog}
        onCancel={() => setIsCreateBlogModalVisible(false)}
      >
        <Form form={createBlogForm} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="imgUrl" label="Ảnh" rules={[{ required: false }]}>
            <Input
              placeholder="Dán link ảnh hoặc tải lên bên dưới"
              style={{ marginBottom: 8 }}
              value={createBlogForm.getFieldValue("imgUrl")}
              onChange={(e) =>
                createBlogForm.setFieldsValue({ imgUrl: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageUploading}
              style={{ marginTop: 8 }}
            />
            {imageUploading && <div>Đang tải ảnh...</div>}
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="PUBLISHED"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <select style={{ width: "100%", height: 32 }}>
              <option value="DRAFT">Nháp</option>
              <option value="PUBLISHED">Công khai</option>
              <option value="ARCHIVED">Lưu trữ</option>
            </select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết blog */}
      <Modal
        title={
          selectedBlog && (selectedBlog.title || selectedBlog.id)
            ? selectedBlog.title || selectedBlog.id
            : "Chi tiết bài viết"
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
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

      {/* Modal tư vấn trực tuyến */}
      <Modal
        title="Tư vấn trực tuyến"
        open={isConsultationModalVisible}
        onCancel={() => setIsConsultationModalVisible(false)}
        footer={null}
      >
        <Form form={consultForm} layout="vertical">
          <Form.Item
            name="patientName"
            label="Tên bệnh nhân"
            rules={[
              { required: true, message: "Vui lòng nhập tên bệnh nhân!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="consultationNotes" label="Ghi chú tư vấn">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal gửi kết quả tư vấn */}
      <Modal
        title="Gửi kết quả tư vấn"
        open={isResultModalVisible}
        onCancel={() => setIsResultModalVisible(false)}
        footer={null}
      >
        <Form form={resultForm} layout="vertical">
          <Form.Item
            name="patientName"
            label="Tên bệnh nhân"
            rules={[
              { required: true, message: "Vui lòng nhập tên bệnh nhân!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="results"
            label="Kết quả"
            rules={[
              { required: true, message: "Vui lòng nhập kết quả tư vấn!" },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal quản lý lịch làm việc */}
      <Modal
        title="Quản lý lịch làm việc"
        open={isScheduleModalVisible}
        onOk={handleManageSchedule}
        onCancel={() => setIsScheduleModalVisible(false)}
        confirmLoading={isScheduleLoading}
      >
        <Form form={scheduleForm} layout="vertical">
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="timeFrom"
            label="Giờ bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu!" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="timeTo"
            label="Giờ kết thúc"
            rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc!" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Consultant;
