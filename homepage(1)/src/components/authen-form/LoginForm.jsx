import { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import GradientButton from "../common/GradientButton";
import axios from "axios";
import LoginFace from "../../api/LoginFace";
import LoginGoogle from "../../api/LoginGoogle";
import jwtDecode from "jwt-decode";

// ...existing code...
const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Đăng nhập bằng email và mật khẩu
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/users?email=${values.email}&password=${values.password}`
      );
      const user = res.data[0];
      if (user) {
        message.success("Đăng nhập thành công!");
        // TODO: Đóng modal hoặc redirect
      } else {
        message.error("Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      message.error("Lỗi đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập Facebook thành công
  const handleFacebookSuccess = async (res) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8080/api/authFace", {
        accessToken: res.accessToken,
      });
      if (response.data && response.data.success) {
        message.success("Đăng nhập Facebook thành công!");
        window.location.href = "/";
      } else {
        message.error("Đăng nhập Facebook thất bại!");
      }
    } catch (err) {
      message.error("Lỗi xác thực Facebook!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập Google thành công
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential);
      console.log("Google User Info:", decoded);
      console.log("Google credential (ID Token):", credential);

      const res = await axios.post(
        "http://localhost:8080/api/auth/google",
        {
          idToken: credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", res.data.token);
      message.success("Đăng nhập Google thành công!");
      window.location.href = "/"; // hoặc navigate nếu dùng react-router
    } catch (error) {
      console.error("Google login failed:", error);
      message.error("Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, minWidth: 340, justifyContent: "center" }}>
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
    </div>
  );
};

export default LoginForm;
