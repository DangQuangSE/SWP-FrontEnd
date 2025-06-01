import { Form, Input, Checkbox, message, Modal } from "antd";
import GradientButton from "../common/GradientButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
const LoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        values
      );
      localStorage.setItem("token", res.data.token);
      message.success("Đăng nhập thành công!");
      onClose(); // đóng modal
      navigate("/homepage"); // chuyển trang đúng cách
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Email hoặc mật khẩu sai!");
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered>
      <div className="login-container">
        <div className="login-box">
          <div
            className="login-logo"
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            <img src="/logo-removebg.png" alt="Logo" width={70} />
          </div>
          <div
            className="login-header"
            style={{ textAlign: "center", marginBottom: 24 }}
          >
            <h2>Welcome back</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="Phone Number"
              name="phonenumner"
              rules={[
                { required: true, message: "Please input your phone numner!" },
              ]}
            >
              <Input placeholder="Enter your phone numner" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <div
              className="login-extra"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#">Forgot password?</a>
            </div>

            <Form.Item>
              <GradientButton htmlType="submit" block>
                Login
              </GradientButton>
            </Form.Item>
          </Form>
        </div>
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

export default LoginModal;
