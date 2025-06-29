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
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import api from "../../../configs/api";
import "./Profile.css";

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const user = useSelector((state) => state.user.user);

  // Load profile data from Redux
  useEffect(() => {
    if (user) {
      setProfileData(user);
      setImageUrl(user.imageUrl || "");

      // Set form values from Redux user data
      form.setFieldsValue({
        fullname: user.fullname || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      });
    }
  }, [user, form]);

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

      // Profile data will be updated from Redux after API response
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Cập nhật hồ sơ thất bại!");
    } finally {
      setLoading(false);
    }
  };

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
                src={imageUrl || user?.imageUrl}
                icon={<UserOutlined />}
                className="profile-avatar"
              />

              <div className="user-basic-info">
                <h3>
                  {profileData?.fullname || user?.fullname || "Chưa có tên"}
                </h3>
                <p>{user?.email}</p>
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
                        // Reset form to original user data from Redux
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
