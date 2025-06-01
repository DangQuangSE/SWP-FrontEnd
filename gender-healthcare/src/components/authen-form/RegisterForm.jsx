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
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
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

  const handleNextPassword = () => {
    form
      .validateFields(["password", "confirmPassword"])
      .then(() => setStep(3))
      .catch(() => {});
  };

  const handleBack = () => setStep((prev) => prev - 1);

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

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered>
      <div className="register-box">
        <div className="register-header-top">
          <img src="/logo-removebg.png" alt="logo" className="brand-logo" />
          <h2>Đăng ký tài khoản</h2>
          <p className="register-subtitle">
            {step === 1
              ? "Bước 1: Nhập số điện thoại"
              : step === 2
              ? "Bước 2: Nhập mật khẩu"
              : "Bước 3: Hoàn tất thông tin cá nhân"}
          </p>
        </div>

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
          >
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

            {step === 2 && (
              <>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Nhập lại mật khẩu"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận lại mật khẩu" />
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
                    <GradientButton onClick={handleNextPassword}>
                      Tiếp tục
                    </GradientButton>
                  </div>
                </Form.Item>
              </>
            )}

            {step === 3 && (
              <>
                <Form.Item name="fullname" label="Họ và tên">
                  <Input placeholder="(Tuỳ chọn) Nhập họ và tên" />
                </Form.Item>

                <Form.Item name="gender" label="Giới tính">
                  <Select placeholder="(Tuỳ chọn) Chọn giới tính">
                    <Option value="MALE">Nam</Option>
                    <Option value="FEMALE">Nữ</Option>
                    <Option value="OTHER">Khác</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="dob" label="Ngày sinh">
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="(Tuỳ chọn) Chọn ngày sinh"
                  />
                </Form.Item>
              </>
            )}
          </Form>
        </Spin>
        <div className="auth-divider">— OR —</div>
        <div className="social-buttons">
          <button className="social-button google">
            <FcGoogle style={{ marginRight: "8px", fontSize: "25px" }} />
            Sign up with Google
          </button>
          <button className="social-button facebook">
            <FaFacebook style={{ marginRight: "8px", fontSize: "25px" }} />
            Sign up with Facebook
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterForm;
