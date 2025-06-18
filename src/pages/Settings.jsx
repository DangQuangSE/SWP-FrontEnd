import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Switch, Select, Form, Button, message, Divider } from 'antd';
import {
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  EyeOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { updateSettings } from '../redux/features/userSlice';
import './Settings.css';

const { Option } = Select;

const Settings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.user.settings);
  const loading = useSelector((state) => state.user.loading);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await dispatch(updateSettings(values)).unwrap();
      message.success('Cập nhật cài đặt thành công!');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật cài đặt!');
    }
  };

  return (
    <div className="settings-container">
      <Card className="settings-card">
        <h2 className="settings-title">Cài đặt</h2>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={settings}
        >
          <div className="settings-section">
            <h3>
              <BellOutlined /> Thông báo
            </h3>
            <Form.Item
              name="notifications"
              label="Thông báo đẩy"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="emailNotifications"
              label="Thông báo qua email"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>

          <Divider />

          <div className="settings-section">
            <h3>
              <GlobalOutlined /> Ngôn ngữ & Giao diện
            </h3>
            <Form.Item
              name="language"
              label="Ngôn ngữ"
            >
              <Select>
                <Option value="vi">Tiếng Việt</Option>
                <Option value="en">English</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="theme"
              label="Giao diện"
            >
              <Select>
                <Option value="light">Sáng</Option>
                <Option value="dark">Tối</Option>
                <Option value="system">Theo hệ thống</Option>
              </Select>
            </Form.Item>
          </div>

          <Divider />

          <div className="settings-section">
            <h3>
              <LockOutlined /> Quyền riêng tư
            </h3>
            <Form.Item
              name="privacy"
              label="Chế độ hiển thị hồ sơ"
            >
              <Select>
                <Option value="public">Công khai</Option>
                <Option value="friends">Chỉ bạn bè</Option>
                <Option value="private">Riêng tư</Option>
              </Select>
            </Form.Item>
          </div>

          <Divider />

          <div className="settings-section">
            <h3>
              <EyeOutlined /> Hiển thị
            </h3>
            <Form.Item
              name="showOnlineStatus"
              label="Hiển thị trạng thái hoạt động"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="showLastSeen"
              label="Hiển thị lần hoạt động cuối"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>

          <Divider />

          <div className="settings-section">
            <h3>
              <SoundOutlined /> Âm thanh
            </h3>
            <Form.Item
              name="messageSound"
              label="Âm thanh tin nhắn"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="notificationSound"
              label="Âm thanh thông báo"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 