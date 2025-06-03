import { useState } from "react";
import { Form, Input, Button, DatePicker, Select, message, Spin } from "antd";
import GradientButton from "../common/GradientButton";
import axios from "axios";
const { Option } = Select;

const RegisterForm = () => {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập mật khẩu (nếu đã có), 3: tạo mật khẩu mới (nếu chưa có), 4: khai báo thông tin cá nhân
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [userId, setUserId] = useState(null);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();

  // Step 1: Check email
  const handleCheckEmail = async () => {
    try {
      const value = await form.validateFields(["email"]);
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/users?email=${value.email}`
      );
      setEmail(value.email);
      if (res.data.length > 0) {
        setUserExists(true);
        setUserId(res.data[0].id);
        setStep(2); // Đã tồn tại, sang nhập mật khẩu
      } else {
        setUserExists(false);
        setStep(3); // Chưa tồn tại, sang tạo mật khẩu
      }
    } catch (err) {
      message.error("Đã xảy ra lỗi khi kiểm tra email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Đăng nhập nếu đã có tài khoản
  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/users?email=${email}&password=${values.password}`
      );
      const user = res.data[0];
      if (user) {
        // Kiểm tra đã khai báo thông tin cá nhân chưa
        if (user.fullname && user.gender && user.dob) {
          message.success("Đăng nhập thành công!");
          // TODO: chuyển sang trang chính
        } else {
          message.success(
            "Đăng nhập thành công! Vui lòng khai báo thông tin cá nhân."
          );
          setUserId(user.id);
          setStep(4);
        }
      } else {
        message.error("Sai mật khẩu hoặc tài khoản không tồn tại!");
      }
    } catch (err) {
      message.error("Lỗi đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Tạo mật khẩu mới cho email chưa có tài khoản
  const handleCreateAccount = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8080/users", {
        email,
        password: values.password,
      });
      setUserId(res.data.id);
      message.success(
        "Tạo tài khoản thành công! Vui lòng khai báo thông tin cá nhân."
      );
      setStep(4); // Chuyển thẳng sang khai báo thông tin cá nhân
    } catch (err) {
      message.error("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Lưu thông tin cá nhân (chỉ khai báo 1 lần)
  const handleFinishProfile = async (values) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:8080/users/${userId}`, values);
      message.success("Khai báo thông tin thành công!");
      // TODO: chuyển sang trang chính
    } catch (err) {
      message.error("Lưu thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Quay lại bước nhập email
  const handleBack = () => setStep(1);

  return (
    <div className="login-box">
      {/* Step 1: Nhập email */}
      {step === 1 && (
        <Spin spinning={loading}>
          <div className="login-header" style={{ textAlign: "center" }}>
            <img
              src="/logo-removebg.png"
              alt="logo"
              className="brand-logo"
              style={{ margin: "0 auto 12px" }}
            />
            <h2 style={{ marginBottom: 8, fontWeight: 700 }}>
              Đăng ký / Đăng nhập
            </h2>
            <p style={{ color: "#666", marginBottom: 16 }}>
              Nhập email để tiếp tục
            </p>
          </div>
          <Form form={form} layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
              style={{ marginBottom: 16 }}
            >
              <Input size="large" placeholder="Nhập email" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 12 }}>
              <GradientButton
                block
                loading={loading}
                style={{ fontWeight: 600, fontSize: 16, height: 44 }}
                onClick={handleCheckEmail}
              >
                Tiếp tục
              </GradientButton>
            </Form.Item>
          </Form>
          <div style={{ margin: "32px 0 0" }}>
            <div
              style={{ textAlign: "center", color: "#bbb", marginBottom: 16 }}
            >
              Hoặc tiếp tục bằng
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Button
                icon={
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                    alt="google"
                    style={{ width: 20 }}
                  />
                }
                shape="round"
              >
                Google
              </Button>
              <Button
                icon={
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
                    alt="facebook"
                    style={{ width: 20 }}
                  />
                }
                shape="round"
              >
                Facebook
              </Button>
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
        </Spin>
      )}

      {/* Step 2: Nếu đã có tài khoản, nhập mật khẩu */}
      {step === 2 && userExists && (
        <Spin spinning={loading}>
          <div className="login-header">
            <Button
              type="text"
              icon={<span style={{ fontSize: 22, fontWeight: 700 }}>←</span>}
              onClick={handleBack}
              style={{ marginBottom: 16 }}
            />
            <h2 style={{ marginBottom: 8, fontWeight: 700 }}>Nhập mật khẩu</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Đăng nhập bằng mật khẩu của bạn.
            </p>
          </div>
          <Form layout="vertical" onFinish={handleLogin}>
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
        </Spin>
      )}

      {/* Step 3: Tạo mật khẩu mới cho email chưa có tài khoản */}
      {step === 3 && !userExists && (
        <Spin spinning={loading}>
          <div
            style={{
              background: "linear-gradient(180deg,#eaf3ff 0,#fff 100%)",
              borderRadius: 12,
              padding: 24,
              minWidth: 340,
              maxWidth: 400,
              margin: "0 auto",
              boxShadow: "0 2px 8px #eaf3ff55",
            }}
          >
            <Button
              type="text"
              icon={<span style={{ fontSize: 22, fontWeight: 700 }}>←</span>}
              onClick={handleBack}
              style={{ marginBottom: 16 }}
            />
            <h2 style={{ marginBottom: 8, fontWeight: 700 }}>Tạo mật khẩu</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Tạo mật khẩu để đăng nhập và hoàn tất đăng ký tài khoản tại{" "}
              <b>Website</b>
            </p>
            <Form layout="vertical" onFinish={handleCreateAccount}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      "Mật khẩu cần ít nhất 1 chữ hoa, 1 chữ thường, 1 số!",
                  },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" size="large" />
              </Form.Item>
              <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>
                <div>
                  <span style={{ color: "#52c41a", marginRight: 4 }}>✔</span>
                  Có ít nhất 8 kí tự
                </div>
                <div>
                  <span style={{ color: "#52c41a", marginRight: 4 }}>✔</span>
                  Có ít nhất 1 chữ viết hoa, 1 chữ viết thường, 1 chữ số
                </div>
              </div>
              <Form.Item
                name="confirm"
                label="Xác nhận mật khẩu"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Mật khẩu không khớp!");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" size="large" />
              </Form.Item>
              <Form.Item style={{ marginTop: 16 }}>
                <GradientButton htmlType="submit" block loading={loading}>
                  Tạo tài khoản mới
                </GradientButton>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      )}

      {/* Step 4: Khai báo thông tin cá nhân (chỉ khai báo 1 lần) */}
      {step === 4 && (
        <div>
          <h2>Khai báo thông tin cá nhân</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>
            Vui lòng cung cấp thông tin để hoàn tất đăng nhập.
          </p>
          <Spin spinning={loading}>
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
                  // Bỏ qua bước khai báo, chuyển sang trang chính hoặc đóng modal
                  message.info("Bạn đã bỏ qua khai báo thông tin cá nhân.");
                  // TODO: chuyển sang trang chính hoặc đóng modal tại đây
                }}
              >
                Thiết lập sau
              </Button>
            </div>
          </Spin>
        </div>
      )}
      {/* Debug chuyển step */}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Button
          onClick={() => {
            setUserExists(false);
            setStep(1);
          }}
          style={{ margin: 4 }}
        >
          Step 1
        </Button>
        <Button
          onClick={() => {
            setUserExists(true);
            setStep(2);
          }}
          style={{ margin: 4 }}
        >
          Step 2
        </Button>
        <Button
          onClick={() => {
            setUserExists(false);
            setStep(3);
          }}
          style={{ margin: 4 }}
        >
          Step 3
        </Button>
        <Button onClick={() => setStep(4)} style={{ margin: 4 }}>
          Step 4
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
