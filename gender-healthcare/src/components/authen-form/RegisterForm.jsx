import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Button,
  Spin,
} from "antd";
import axios from "axios";
import GradientButton from "../common/GradientButton";
import "./RegisterForm.css";

const { Option } = Select;

const RegisterForm = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const checkPhoneNumber = async () => {
    const phone = form.getFieldValue("phone");
    if (!phone) {
      message.warning("Vui lòng nhập số điện thoại");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/auth/check-phone?phone=${phone}`
      );
      if (res.data.exists) {
        message.error("Số điện thoại đã được đăng ký!");
      } else {
        setStep(2);
      }
    } catch (err) {
      console.error("Register failed:", err);
      message.error("Đã xảy ra lỗi khi kiểm tra số điện thoại.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (values) => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", values);
      message.success("Đăng ký thành công!");
      form.resetFields();
      setStep(1);
      onClose();
    } catch (err) {
      console.error("Register failed:", err);
      message.error("Đăng ký thất bại.");
    }
  };

  const handleBack = () => setStep(1);

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered>
      <div className="register-box">
        <div className="register-header-top">
          <img src="/logo-removebg.png" alt="logo" className="brand-logo" />
          <h2>Đăng ký tài khoản</h2>
          <p className="register-subtitle">
            {step === 1
              ? "Nhập số điện thoại để bắt đầu đăng ký."
              : "Hoàn tất thông tin còn lại."}
          </p>
        </div>

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
          >
            {/* Bước 1: Chỉ nhập số điện thoại */}
            {step === 1 && (
              <>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item>
                  <GradientButton block onClick={checkPhoneNumber}>
                    Tiếp tục
                  </GradientButton>
                </Form.Item>
              </>
            )}

            {/* Nhập thông tin còn lại  */}
            {step === 2 && (
              <>
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
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính!" },
                  ]}
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
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh!" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <Button onClick={handleBack}>Quay lại</Button>
                    <GradientButton htmlType="submit">Đăng ký</GradientButton>
                  </div>
                </Form.Item>
              </>
            )}
          </Form>
        </Spin>
      </div>
    </Modal>
  );
};

export default RegisterForm;
