import { useState, useEffect } from "react";
import { Modal, Tabs } from "antd";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// Modal xác nhận thoát
const ConfirmExitModal = ({ open, onCancel, onOk }) => (
  <Modal
    open={open}
    onCancel={onCancel}
    footer={null}
    centered
    closable={false}
    width={380}
    styles={{ body: { textAlign: "center", padding: 32 } }}
  >
    <div>
      <div
        style={{
          background: "#eaf3ff",
          borderRadius: "50%",
          width: 80,
          height: 80,
          margin: "0 auto 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src="/exit-icon.png" alt="exit" style={{ width: 40 }} />
      </div>
      <h2 style={{ fontWeight: 700, marginBottom: 8 }}>
        Bạn có chắc muốn thoát?
      </h2>
      <div style={{ color: "#555", marginBottom: 24 }}>
        Bạn chưa hoàn tất thiết lập tài khoản. Bạn có thực sự muốn thoát?
      </div>
      <button
        style={{
          background: "#1890ff",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 32px",
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 12,
          cursor: "pointer",
          width: "100%",
        }}
        onClick={onCancel}
      >
        Hủy bỏ
      </button>
      <button
        style={{
          background: "none",
          border: "none",
          color: "#888",
          fontSize: 16,
          cursor: "pointer",
          width: "100%",
        }}
        onClick={onOk}
      >
        Thoát
      </button>
    </div>
  </Modal>
);

const AuthModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [registerPhone, setRegisterPhone] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!open) {
      setActiveTab("login");
      setRegisterPhone("");
      setShowConfirm(false);
    }
  }, [open]);

  const handleRequestClose = () => setShowConfirm(true);
  const handleExit = () => {
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={handleRequestClose}
        footer={null}
        width={440}
        centered
        closeIcon={<span style={{ fontSize: 24 }}>&times;</span>}
        styles={{
          body: {
            padding: 0,
            background: "#f5f7fa",
            borderRadius: 12,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
        maskClosable
      >
        <div style={{ padding: 24 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={[
              {
                key: "login",
                label: (
                  <span style={{ fontWeight: 600, fontSize: 16 }}>
                    Đăng nhập
                  </span>
                ),
                children: (
                  <div style={{ paddingTop: 16 }}>
                    <LoginForm
                      onRequireRegister={(phone) => {
                        setRegisterPhone(phone);
                        setActiveTab("register");
                      }}
                      onClose={onClose} // truyền prop onClose vào LoginForm
                    />
                  </div>
                ),
              },
              {
                key: "register",
                label: (
                  <span style={{ fontWeight: 600, fontSize: 16 }}>
                    Tạo tài khoản
                  </span>
                ),
                children: (
                  <div style={{ paddingTop: 16 }}>
                    <RegisterForm phone={registerPhone} onClose={onClose} /> {/* truyền prop onClose vào RegisterForm nếu muốn */}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Modal>

      <ConfirmExitModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onOk={handleExit}
      />
    </>
  );
};

export default AuthModal;