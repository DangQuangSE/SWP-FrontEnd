import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Card, Tabs, Form, Input, Button, Upload, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';
import { updateProfile, changePassword, updateAvatar } from '../redux/features/userSlice';
import './Profile.css';

const { TabPane } = Tabs;

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const onProfileFinish = async (values) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const onPasswordFinish = async (values) => {
    try {
      await dispatch(changePassword(values)).unwrap();
      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
    }
  };

  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await dispatch(updateAvatar(formData)).unwrap();
      message.success('Cập nhật ảnh đại diện thành công!');
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện!');
      return false;
    }
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar size={120} src={user?.imageUrl} icon={<UserOutlined />} />
          <h2>{user?.name || user?.username || user?.fullname || 'User'}</h2>
        </div>

        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Thông tin cá nhân" key="1">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
              }}
              onFinish={onProfileFinish}
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Đổi mật khẩu" key="2">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={onPasswordFinish}
            >
              <Form.Item
                name="currentPassword"
                label="Mật khẩu hiện tại"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu hiện tại" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu mới" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Ảnh đại diện" key="3">
            <div className="avatar-upload">
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={handleAvatarUpload}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
              <p className="upload-hint">Hỗ trợ: JPG, PNG. Kích thước tối đa: 2MB</p>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile; 