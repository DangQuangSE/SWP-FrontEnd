import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message } from "antd";
import "./RegisterForm.css";
import GradientButton from "../common/GradientButton";

const { Option } = Select;

const RegisterForm = ({ open, onClose }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Dữ liệu đăng ký:", values);
    message.success("Đăng ký thành công!");
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="register-screen"
      bodyStyle={{ display: "flex", justifyContent: "center" }} // ⬅ thêm dòng này
    >
      <div className="register-box">
        <div className="register-header-top">
          <img src="/logo-removebg.png" alt="logo" className="brand-logo" />
          <h2>Đăng ký tài khoản</h2>
          <p className="register-subtitle">
            Nhập thông tin của bạn để tạo tài khoản mới.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="fullname"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
              <Option value="OTHER">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dob"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item>
            <GradientButton type="primary" htmlType="submit" block>
              Đăng ký
            </GradientButton>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default RegisterForm;
