import "./AuthButtons.css";
import GradientButton from "../../common/GradientButton.jsx";
import { useState } from "react";
import AuthModal from "../../authen-form/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Avatar, Dropdown } from "antd";
import { logout } from "../../../redux/features/userSlice.js";
import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  console.log("User state:", user);
  console.log(user?.imageUrl);
  const onLoginClick = () => {
    setOpen(true);
  };
  const navigate = useNavigate();

  const items = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => {
        navigate("/profile");
      }
    },
    {
      key: "2",
      label: "Cài đặt",
      icon: <SettingOutlined />,
      onClick: () => {
        navigate("/settings");
      }
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(logout());
      },
    },
  ];

  return (
    <div className="header-buttons">
      {user == null ? (
        <GradientButton type="pink" onClick={onLoginClick}>
          <span className="login-btn">Đăng nhập</span>
        </GradientButton>
      ) : (
        <Dropdown menu={{ items }} trigger={["click"]}>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Avatar src={user?.imageUrl} />
            <span style={{ marginLeft: "8px" }}>
              {user?.name || user?.username || user?.fullname || "User"}
            </span>
          </div>
        </Dropdown>
      )}
      {/* Modal for login/signup */}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AuthButtons;
