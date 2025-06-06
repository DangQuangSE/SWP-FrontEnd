import "./AuthButtons.css";
import GradientButton from "../../common/GradientButton.jsx";
import { useState } from "react";
import AuthModal from "../../authen-form/AuthModal";

const AuthButtons = () => {
  const [open, setOpen] = useState(false);

  const onLoginClick = () => {
    setOpen(true);
  };

  return (
    <div className="header-buttons">
      <GradientButton type="pink" onClick={onLoginClick}>
        <span className="login-btn">Đăng nhập</span>
      </GradientButton>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AuthButtons;
