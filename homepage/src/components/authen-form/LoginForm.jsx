import { useState } from "react";
import { Form, Input, Button, message, Spin, DatePicker, Select } from "antd";
import GradientButton from "../common/GradientButton";
import axios from "axios";
import LoginFace from "../../api/LoginFace";
import LoginGoogle from "../../api/LoginGoogle";
import jwtDecode from "jwt-decode";
const { Option } = Select;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [step, setStep] = useState(1); // 1: login, 2: khai báo thông tin
  const [userId, setUserId] = useState(null);

  // Đăng nhập bằng email và mật khẩu
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/users?email=${values.email}&password=${values.password}`
      );
      const user = res.data[0];
      if (user) {
        // Nếu thiếu thông tin cá nhân thì chuyển sang step 2
        if (!user.fullname || !user.gender || !user.dob) {
          setUserId(user.id);
          setStep(2);
          message.success(
            "Đăng nhập thành công! Vui lòng khai báo thông tin cá nhân."
          );
        } else {
          message.success("Đăng nhập thành công!");
          // TODO: Đóng modal hoặc redirect
        }
      } else {
        message.error("Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      message.error("Lỗi đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  // Lưu thông tin cá nhân
  const handleFinishProfile = async (values) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:8080/users/${userId}`, values);
      message.success("Khai báo thông tin thành công!");
      // TODO: Đóng modal hoặc redirect
    } catch (err) {
      message.error("Lưu thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập Facebook thành công
  const handleFacebookSuccess = async (res) => {
    // ...giữ nguyên code cũ...
  };

  // Xử lý đăng nhập Google thành công
  const handleGoogleSuccess = async (credentialResponse) => {
    // ...giữ nguyên code cũ...
  };

  return (
    <div style={{ padding: 24, minWidth: 340, justifyContent: "center" }}>
      {step === 1 && (
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <h2 style={{ marginBottom: 8 }}>Đăng nhập</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>
            Dùng email để tiếp tục
          </p>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Quên mật khẩu?</span>
            <a href="#">Lấy lại mật khẩu</a>
          </div>
          <Form.Item style={{ marginTop: 16 }}>
            <GradientButton htmlType="submit" block loading={loading}>
              Đăng nhập
            </GradientButton>
          </Form.Item>
        </Form>
      )}

      {/* Step 2: Khai báo thông tin cá nhân */}
      {step === 2 && (
        <Spin spinning={loading}>
          <div>
            <h2>Khai báo thông tin cá nhân</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Vui lòng cung cấp thông tin để hoàn tất đăng nhập.
            </p>
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleFinishProfile}
              autoComplete="off"
            >
              <Form.Item
                name="fullname"
                label="Tên"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Nhập tên của bạn" />
              </Form.Item>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="FEMALE">
                    <span role="img" aria-label="Nữ">
                      👩‍🦰
                    </span>{" "}
                    Nữ
                  </Option>
                  <Option value="MALE">
                    <span role="img" aria-label="Nam">
                      👨‍🦱
                    </span>{" "}
                    Nam
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="dob"
                label="Ngày sinh"
                rules={[
                  { required: true, message: "Vui lòng nhập ngày sinh!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Nhập ngày sinh của bạn"
                />
              </Form.Item>
              <Form.Item>
                <GradientButton htmlType="submit" block>
                  Lưu
                </GradientButton>
              </Form.Item>
            </Form>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button
                type="link"
                onClick={() => {
                  message.info("Bạn đã bỏ qua khai báo thông tin cá nhân.");
                  // TODO: Đóng modal hoặc redirect
                }}
              >
                Thiết lập sau
              </Button>
            </div>
          </div>
        </Spin>
      )}

      {step === 1 && (
        <div style={{ margin: "32px 0 0" }}>
          <div style={{ textAlign: "center", color: "#bbb", marginBottom: 16 }}>
            Hoặc tiếp tục bằng
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <LoginGoogle onSuccess={handleGoogleSuccess} />
            <LoginFace onSuccess={handleFacebookSuccess} />
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 20 }}>
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <a href="#" style={{ color: "#3870ff" }}>
              Chính sách bảo mật
            </a>{" "}
            và{" "}
            <a href="#" style={{ color: "#3870ff" }}>
              Điều khoản sử dụng
            </a>
            .
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
