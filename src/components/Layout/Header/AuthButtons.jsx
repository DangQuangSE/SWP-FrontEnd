import "./AuthButtons.css";
import GradientButton from "../../common/GradientButton.jsx";
import { useState } from "react";
import AuthModal from "../../../features/authentication/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { logout } from "../../../redux/reduxStore/userSlice.js";
import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  LẤY RA USER ĐÚNG TỪ state
  const userState = useSelector((state) => state.user);
  const user = userState?.user;

  //  Debug logging
  console.log("AuthButtons Debug:");
  console.log("Full userState:", userState);
  console.log("Extracted user:", user);
  console.log("user.email:", user?.email);
  console.log("user.fullname:", user?.fullname);
  console.log("user.imageUrl:", user?.imageUrl);

  //  Cải thiện logic kiểm tra đăng nhập
  const isLoggedIn = user && user.email && user.email.trim() !== "";
  console.log("isLoggedIn:", isLoggedIn);

  const onLoginClick = () => {
    setOpen(true);
  };

  const items = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/user"),
    },
    {
      key: "2",
      label: "Cài đặt",
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(logout());
        localStorage.clear(); //  Gộp xóa gọn
        navigate("/");
      },
    },
  ];

  return (
    <div className="header-buttons">
      {!isLoggedIn ? (
        <GradientButton onClick={onLoginClick}>
          <span className="login-btn">Đăng nhập</span>
        </GradientButton>
      ) : (
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Avatar src={user?.imageUrl || "/placeholder.svg"} />
            <span style={{ marginLeft: "8px" }}>
              {user?.fullname || "User"}
            </span>
          </div>
        </Dropdown>
      )}

      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AuthButtons;
