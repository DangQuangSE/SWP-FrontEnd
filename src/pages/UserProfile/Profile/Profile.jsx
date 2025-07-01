import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Avatar,
  message,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../../configs/api";
import "./Profile.css";

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  // Fetch user data from API /api/me
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setFetchingUser(false);
        message.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem hồ sơ.");
        return;
      }

      try {
        setFetchingUser(true);
        const response = await api.get("/me");
        console.log("✅ User data from /api/me:", response.data);
        setUser(response.data);

        // Set form values from API user data
        form.setFieldsValue({
          fullname: response.data.fullname || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          dateOfBirth: response.data.dateOfBirth
            ? dayjs(response.data.dateOfBirth)
            : null,
        });
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        const errorMessage =
          error.response?.data?.message || "Không thể lấy thông tin người dùng";
        message.error(errorMessage);
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserData();
  }, [form]);

  // Update profile
  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);

      const updateData = {
        fullname: values.fullname,
        phone: values.phone,
        address: values.address,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : null,
      };

      console.log("Updating profile with:", updateData);

      const response = await api.put("/me/profile", updateData);
      console.log("Update response:", response.data);

      message.success("Cập nhật hồ sơ thành công!");
      setEditing(false);

      // Refresh user data after successful update
      const updatedResponse = await api.get("/me");
      setUser(updatedResponse.data);

      // Update form with fresh data
      form.setFieldsValue({
        fullname: updatedResponse.data.fullname || "",
        phone: updatedResponse.data.phone || "",
        address: updatedResponse.data.address || "",
        dateOfBirth: updatedResponse.data.dateOfBirth
          ? dayjs(updatedResponse.data.dateOfBirth)
          : null,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Cập nhật hồ sơ thất bại!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading when fetching user data
  if (fetchingUser) {
    return (
      <div className="profile-container">
        <Card loading={true}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Đang tải thông tin hồ sơ...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if no user data
  if (!user) {
    return (
      <div className="profile-container">
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#ff4d4f", fontSize: "16px" }}>
              Không thể tải thông tin hồ sơ. Vui lòng thử lại.
            </p>
            <Button
              type="primary"
              onClick={() => window.location.reload()}
              style={{ marginTop: "16px" }}
            >
              Tải lại trang
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Card
        title={
          <div className="profile-header">
            <h2>Hồ sơ cá nhân</h2>
            <Button
              type={editing ? "default" : "primary"}
              icon={editing ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (editing) {
                  form.submit();
                } else {
                  setEditing(true);
                }
              }}
              loading={loading}
              disabled={!user}
            >
              {editing ? "Lưu thay đổi" : "Chỉnh sửa"}
            </Button>
          </div>
        }
        loading={loading}
      >
        <Row gutter={24}>
          {/* Avatar Section */}
          <Col xs={24} md={8}>
            <div className="avatar-section">
              <Avatar
                size={120}
                src={user?.imageUrl}
                icon={<UserOutlined />}
                className="profile-avatar"
              />

              <div className="user-basic-info">
                <h3>{user?.fullname || "Chưa có tên"}</h3>
                <p>{user?.email}</p>
                {user?.role && (
                  <p style={{ color: "#1890ff", fontWeight: "500" }}>
                    Vai trò: {user.role}
                  </p>
                )}
              </div>
            </div>
          </Col>

          {/* Form Section */}
          <Col xs={24} md={16}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              disabled={!editing}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullname"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nhập họ và tên"
                      size="large"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]{10,11}$/,
                        message: "Số điện thoại không hợp lệ!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="dateOfBirth" label="Ngày sinh">
                    <DatePicker
                      prefix={<CalendarOutlined />}
                      placeholder="Chọn ngày sinh"
                      size="large"
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Email">
                    <Input
                      value={user?.email}
                      disabled
                      size="large"
                      placeholder="Email không thể thay đổi"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="address" label="Địa chỉ">
                <Input.TextArea
                  prefix={<HomeOutlined />}
                  placeholder="Nhập địa chỉ"
                  rows={3}
                  size="large"
                />
              </Form.Item>

              {editing && (
                <Form.Item>
                  <div className="form-actions">
                    <Button
                      onClick={() => {
                        setEditing(false);
                        // Reset form to original user data from API
                        form.setFieldsValue({
                          fullname: user?.fullname || "",
                          phone: user?.phone || "",
                          address: user?.address || "",
                          dateOfBirth: user?.dateOfBirth
                            ? dayjs(user.dateOfBirth)
                            : null,
                        });
                      }}
                      style={{ marginRight: 8 }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile;
