import { useState } from "react";
import { Form, Input } from "antd";
import GradientButton from "../../components/common/GradientButton";
import LoginGoogle from "../../api/LoginGoogle";
import api from "../../configs/api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../redux/reduxStore/userSlice";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      const token = res.data.jwt || res.data.accessToken || res.data.token;
      localStorage.setItem("token", token);
      // Lưu cả user và jwt vào Redux
      const user = res.data.user || {};
      dispatch(login({ ...user, jwt: token }));
      toast.success("Đăng nhập thành công!");
      if (onClose) onClose();

      // Chuyển trang đúng theo role
      if (user.role === "CUSTOMER") {
        navigate("/");
      } else if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else if (user.role === "STAFF") {
        navigate("/staff");
      } else if (user.role === "CONSULTANT") {
        navigate("/consultant");
      } else {
        navigate("/error");
      }
      console.log("Login response:", res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Email hoặc mật khẩu không chính xác!");
      } else {
        toast.error("Lỗi đăng nhập!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập Google thành công
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { credential } = credentialResponse;

      const res = await api.post(
        "/auth/google",
        { accessToken: credential },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(" FULL response từ backend:", res.data);

      const { user, jwt } = res.data;
      console.log("Google response user:", user);
      console.log("Google response token:", jwt);

      if (jwt) {
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(login({ ...user, jwt }));
        toast.success("Đăng nhập Google thành công!");
        if (onClose) onClose();
        navigate("/");
      } else {
        toast.error("Đăng nhập Google thất bại! Không có token.");
      }
    } catch (error) {
      toast.error("Lỗi xác thực Google!");
      console.error("Lỗi xác thực Google:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-wrapper">
      <Form form={form} layout="vertical" onFinish={handleLogin}>
        <div className="auth-modal-logo">
          <img src="/logostc.png" alt="Logo" />
        </div>
        <h2 className="login-title">Đăng nhập</h2>
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
        <div className="forgot-password">
          <span>Quên mật khẩu?</span>
          <a href="/forgot-password">Lấy lại mật khẩu</a>
        </div>
        <Form.Item className="submit-button">
          <GradientButton htmlType="submit" block loading={loading}>
            Đăng nhập
          </GradientButton>
        </Form.Item>
      </Form>

      <div className="login-divider">
        <div className="login-divider-text">Hoặc tiếp tục bằng</div>
        <div className="login-socials">
          <LoginGoogle onSuccess={handleGoogleSuccess} />
        </div>
        <div className="login-policy">
          Bằng cách đăng ký, bạn đồng ý với <a href="#">Chính sách bảo mật</a>{" "}
          và <a href="#">Điều khoản sử dụng</a>.
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
