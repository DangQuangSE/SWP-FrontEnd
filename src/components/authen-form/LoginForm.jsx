import { useState } from "react";
import { Form, Input, Button, message, Spin, DatePicker, Select } from "antd";
import GradientButton from "../common/GradientButton";
import axios from "axios";
import LoginFace from "../../api/LoginFace";
import LoginGoogle from "../../api/LoginGoogle";
import api from "../../configs/axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../redux/features/userSlice";
const { Option } = Select;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [step, setStep] = useState(1); // 1: login, 2: khai báo thông tin
  const [userId, setUserId] = useState(null);

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
      const res = await axios.get(
        `http://localhost:8080/users?email=${values.email}&password=${values.password}`
      );
      const user = res.data[0];
      if (user) {
        // Nếu thiếu thông tin cá nhân thì chuyển sang step 2
        if (!user.fullname || !user.gender || !user.dob) {
          setUserId(user.id);
          setStep(2);
          toast.success(
            "Đăng nhập thành công! Vui lòng khai báo thông tin cá nhân."
          );
        } else {
          toast.success("Đăng nhập thành công!");
          // TODO: Đóng modal hoặc redirect
        }
      } else {
        toast.error("Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      toast.error("Lỗi đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  // Lưu thông tin cá nhân
  const handleFinishProfile = async (values) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:8080/users/${userId}`, values);
      toast.success("Khai báo thông tin thành công!");
      // TODO: Đóng modal hoặc redirect
    } catch (err) {
      toast.error("Lưu thông tin thất bại!");
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
      dispatch(login(response.data.user));
      console.log("Facebook response:", response.data);

      if (response.data.user && response.data.jwt) {
        toast.success("Đăng nhập Facebook thành công!");
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
      // Gửi idToken lên backend để xác thực hoặc lấy thông tin user
      const res = await api.post(
        "/auth/google",
        {
          accessToken: credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Google response:", res.data.user);
      console.log("Google response:", res.data.token);
      dispatch(login(res.data.user));
      if (res.data && res.data.jwt) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";

        toast.success("Đăng nhập Google thành công!");
        // TODO: Đóng modal hoặc redirect, ví dụ:
      } else {
        toast.error("Đăng nhập Google thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi xác thực Google!");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
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
