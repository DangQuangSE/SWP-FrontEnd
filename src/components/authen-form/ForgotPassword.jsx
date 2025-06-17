import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, Space, Spin, Steps } from "antd";
import "./ForgotPasswordOTP.css";
import { toast } from "react-toastify";

const API_BASE_URL = "http://14.225.198.16:8085";
const { Step } = Steps;

function ForgotPasswordOTP() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [emailForOTP, setEmailForOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password/request-otp`,
        {
          email: values.email.trim(),
        }
      );
      setEmailForOTP(values.email.trim());
      setCurrentStep(1);
      toast.success(
        response.data || "OTP đã được gửi tới email. Vui lòng kiểm tra email!"
      ); // Lấy message từ response
      form.resetFields(["otp", "newPassword", "confirmPassword"]);
    } catch (error) {
      console.error(
        "Lỗi gửi OTP:",
        error.response ? error.response.data : error.message
      );
      const errorMessage =
        error.response?.data || "Gửi OTP thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password/verify-otp`, {
        email: emailForOTP,
        otp: values.otp.trim(),
      });
      setCurrentStep(2);
      toast.success("Xác minh OTP thành công. Vui lòng đặt mật khẩu mới.");
      form.resetFields(["newPassword", "confirmPassword"]);
    } catch (error) {
      console.error(
        "Lỗi xác minh OTP:",
        error.response ? error.response.data : error.message
      );

      // Lấy thông báo lỗi cụ thể từ API (nếu có)
      const errorMessage =
        error.response?.data || "Mã OTP không hợp lệ hoặc đã hết hạn!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);

    if (values.newPassword !== values.confirmPassword) {
      toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password/resetPass`, {
        email: emailForOTP,
        password: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success(
        "Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới."
      );
      navigate("/");
    } catch (error) {
      console.error(
        "Lỗi đặt lại mật khẩu:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <p className="fp-otp-step-description">
              Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi mã OTP để
              xác minh.
            </p>
            <Form
              form={form}
              name="send_otp_form"
              onFinish={handleSendOTP}
              layout="vertical"
              className="otp-form"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
              >
                <Input
                  className="otp-input"
                  placeholder="Nhập email của bạn"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="gradient-button"
                >
                  Gửi Mã OTP
                </Button>
              </Form.Item>
              <Button
                type="link"
                onClick={() => navigate("/")}
                block
                disabled={loading}
                className="fp-otp-back-link"
              >
                Quay Lại Trang Chủ
              </Button>
            </Form>
          </>
        );
      case 1:
        return (
          <>
            <p className="step-description">
              Một mã OTP đã được gửi đến email <strong>{emailForOTP}</strong>.
              Vui lòng nhập mã OTP.
            </p>
            <Form
              form={form}
              name="verify_otp_form"
              onFinish={handleVerifyOTP}
              layout="vertical"
              className="fp-otp-form"
            >
              <Form.Item
                label="Mã OTP"
                name="otp"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
              >
                <Input
                  className="fp-otp-input"
                  placeholder="Nhập mã OTP (6 chữ số)"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                      message:
                        "Mật khẩu phải có ít nhất một chữ cái và một chữ số!",
                    },
                  ]}
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item>
                <Space className="form-actions-space" style={{ width: "100%" }}>
                  <Button
                    onClick={() => {
                      setCurrentStep(0);
                      form.setFieldsValue({ email: emailForOTP });
                    }}
                    disabled={loading}
                    className="secondary-button"
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="gradient-button"
                  >
                    Xác Nhận OTP
                  </Button>
                </Space>
              </Form.Item>
              <Button
                type="link"
                onClick={() => handleSendOTP({ email: emailForOTP })}
                disabled={loading}
                className="fp-otp-resend-link"
              >
                Gửi lại OTP
              </Button>
            </Form>
          </>
        );
      case 2:
        return (
          <>
            <p className="step-description">
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
            </p>
            <Form
              form={form}
              name="reset_password_form"
              onFinish={handleResetPassword}
              layout="vertical"
              className="otp-form"
            >
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
                hasFeedback
              >
                <Input.Password
                  className="otp-input"
                  placeholder="Nhập mật khẩu mới"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng xác nhận mật khẩu mới!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Hai mật khẩu bạn nhập không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  className="otp-input"
                  placeholder="Xác nhận mật khẩu mới"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="gradient-button"
                >
                  Đặt Lại Mật Khẩu
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      default:
        return <p>Đã có lỗi xảy ra hoặc bước không hợp lệ.</p>;
    }
  };

  return (
    <div className="fp-otp-page">
      <Spin
        spinning={loading}
        tip="Đang xử lý..."
        size="large"
        fullscreen={loading}
      >
        <div className="fp-otp-card">
          <div className="fp-otp-card-header">
            {/* Logo */}
            <h2 className="fp-otp-card-title">Quên Mật Khẩu</h2>
          </div>

          <div className="fp-otp-step-content">{renderStepContent()}</div>
        </div>
      </Spin>
    </div>
  );
}

export default ForgotPasswordOTP;
