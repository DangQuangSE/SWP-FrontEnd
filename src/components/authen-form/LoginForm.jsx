import { useState } from "react";
import { Form, Input, Button, Spin, DatePicker, Select } from "antd";
import GradientButton from "../common/GradientButton";
import axios from "axios";
import LoginFace from "../../api/LoginFace";
import LoginGoogle from "../../api/LoginGoogle";
import api from "../../configs/axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const LoginForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  // dispatch(login(response.data.data));
  //     localStorage.setItem("token", response.data.data.token);
  //     // dispatch gửi action lên redux store
  //     // action này sẽ được userSlice xử lý
  //     navigate("/dashboard");

  // Đăng nhập bằng email và mật khẩu
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", {
        email: values.email,
        password: values.password,
      });
      const user = res.data;
      dispatch(login(res.data.user));
      toast.success("Đăng nhập thành công!");
      if (onClose) onClose();

      // Chuyển trang đúng theo role
      if (user.user.role === "CUSTOMER") {
        navigate("/");
      } else if (user.user.role === "ADMIN") {
        navigate("/dashboard");
      } else if (user.user.role === "STAFF") {
        navigate("/staff");
      } else if (user.user.role === "CONSULTANT") {
        navigate("/consultant");
      } else {
        navigate("/error");
      }
      console.log("Login response:", user);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Email hoặc mật khẩu không chính xác!");
      } else {
        toast.error("Lỗi đăng nhập!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSuccess = async (res) => {
    try {
      setLoading(true);
      // Gửi accessToken lên backend để xác thực hoặc lấy thông tin user
      const response = await api.post("/auth/facebook", {
        accessToken: res.accessToken,
      });

      console.log("Facebook response:", response.data);

      if (response.data.user && response.data.jwt) {
        toast.success("Đăng nhập Facebook thành công!");
        dispatch(login(response.data.user));
        // TODO: Đóng modal hoặc redirect, ví dụ:
        window.location.href = "/";
      } else {
        toast.error("Đăng nhập Facebook thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi xác thực Facebook!");
      console.log(err.toast);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập Google thành công
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    try {
      setLoading(true);
      console.log("Google login successful");

      const { credential } = credentialResponse;

      const res = await api.post(
        "/auth/google",
        { accessToken: credential },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🧾 FULL response từ backend:", res.data);

      const { user, jwt: token } = res.data; // ✅ sửa ở đây
      console.log("Google response user:", user);
      console.log("Google response token:", token);

      if (token) {
        localStorage.setItem("token", token);
        dispatch(login(user));
        toast.success("Đăng nhập Google thành công!");
        window.location.href = "/";
      } else {
        toast.error("Đăng nhập Google thất bại! Không có token.");
      }
    } catch (error) {
      toast.error("Lỗi xác thực Google!");
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, minWidth: 340, justifyContent: "center" }}>
      {
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
            <a href="/forgot-password">Lấy lại mật khẩu</a>
          </div>
          <Form.Item style={{ marginTop: 16 }}>
            <GradientButton htmlType="submit" block loading={loading}>
              Đăng nhập
            </GradientButton>
          </Form.Item>
        </Form>
      }
      {
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
      }
    </div>
  );
};

export default LoginForm;
