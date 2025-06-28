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
      console.log("Attempting login with:", { email: values.email });
      console.log("API base URL:", api.defaults.baseURL);

      const res = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      console.log(" Login API Response:", res.data);

      console.log("Login successful, response:", res.data);
      const token = res.data.jwt || res.data.accessToken || res.data.token;
      const user = res.data.user || res.data;

      console.log(" Extracted token:", token);
      console.log(" Extracted user:", user);

      //  Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      //  Dispatch đúng cấu trúc
      dispatch(login({ user, token }));

      toast.success("Đăng nhập thành công!");
      if (onClose) onClose();

      // Chuyển trang đúng theo role
      if (user.role === "CUSTOMER") {
        navigate("/");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "STAFF") {
        navigate("/staff");
      } else if (user.role === "CONSULTANT") {
        navigate("/consultant");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);

      if (err.response?.status === 401) {
        toast.error("Email hoặc mật khẩu không chính xác!");
      } else if (
        err.code === "ERR_NETWORK" ||
        err.message.includes("Network Error")
      ) {
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!"
        );
      } else if (err.code === "ERR_FAILED") {
        toast.error("Lỗi kết nối đến server. Vui lòng thử lại sau!");
      } else {
        toast.error(`Lỗi đăng nhập: ${err.message || "Lỗi không xác định"}`);
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

      console.log(" Google API Response:", res.data);

      const { user, jwt: token } = res.data;
      console.log(" Google user:", user);
      console.log(" Google token:", token);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        //  Dispatch đúng cấu trúc
        dispatch(login({ user, token }));

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
