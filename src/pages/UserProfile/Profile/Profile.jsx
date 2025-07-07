import { useState, useEffect } from "react";
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
  Upload,
  Modal,
  Select,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../../configs/api";
import { useDispatch } from "react-redux";
import { updateUserAvatar } from "../../../redux/reduxStore/userSlice";
import "./Profile.css";

const Profile = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Fetch user data from API /api/me
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetchingUser(true);
        const response = await api.get("/me");
        console.log("User data from /api/me:", response.data);
        setUser(response.data);
        setImageUrl(response.data.imageUrl || "");

        // Set form values from API user data
        form.setFieldsValue({
          fullname: response.data.fullname || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          gender: response.data.gender || "",
          dateOfBirth: response.data.dateOfBirth
            ? dayjs(response.data.dateOfBirth)
            : null,
        });
      } catch (error) {
        console.error(" Error fetching user data:", error);
        message.error("Không thể lấy thông tin người dùng");
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserData();
  }, [form]);

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setUploading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload to server using PUT instead of POST
      const response = await api.put("/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.imageUrl) {
        setImageUrl(response.data.imageUrl);

        // Update user data with new image URL
        setUser((prev) => ({
          ...prev,
          imageUrl: response.data.imageUrl,
        }));

        // Cập nhật Redux store để các component khác cũng nhận được ảnh mới
        dispatch(updateUserAvatar({ imageUrl: response.data.imageUrl }));

        message.success("Tải ảnh lên thành công!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Có lỗi xảy ra khi tải ảnh lên!");
    } finally {
      setUploading(false);
    }
  };

  // Preview image
  const handlePreview = () => {
    setPreviewImage(imageUrl || user?.imageUrl);
    setPreviewVisible(true);
  };

  // Update profile
  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);

      const updateData = {
        fullname: values.fullname,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
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
        loading={loading || fetchingUser}
      >
        <Row gutter={24}>
          {/* Avatar Section */}
          <Col xs={24} md={8}>
            <div className="avatar-section">
              <div className="avatar-container">
                <Avatar
                  size={120}
                  src={imageUrl || user?.imageUrl}
                  icon={<UserOutlined />}
                  className="profile-avatar"
                  onClick={handlePreview}
                />
                <Upload
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={handleImageUpload}
                  accept="image/*"
                >
                  <Button
                    className="avatar-upload-button"
                    icon={<CameraOutlined />}
                    loading={uploading}
                    type="primary"
                    shape="circle"
                  />
                </Upload>
              </div>

              <div className="user-basic-info">
                <h3>{user?.fullname || "Chưa có tên"}</h3>
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
                  <Form.Item name="gender" label="Giới tính">
                    <Select
                      placeholder="Chọn giới tính"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="MALE">Nam</Select.Option>
                      <Select.Option value="FEMALE">Nữ</Select.Option>
                      <Select.Option value="OTHER">Khác</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
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
                          gender: user?.gender || "",
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

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="Xem ảnh đại diện"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        className="avatar-preview-modal"
      >
        <img alt="Avatar" src={previewImage} />
      </Modal>
    </div>
  );
};

export default Profile;
