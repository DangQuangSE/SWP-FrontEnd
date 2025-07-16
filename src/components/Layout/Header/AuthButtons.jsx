import "./AuthButtons.css";
import GradientButton from "../../common/GradientButton.jsx";
import { useState, useEffect } from "react";
import AuthModal from "../../../features/authentication/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Badge, Calendar } from "antd";
import { logout } from "../../../redux/reduxStore/userSlice.js";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/api";
import NotificationDropdown from "./Notification.jsx";

const AuthButtons = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  LẤY RA USER ĐÚNG TỪ state
  const userState = useSelector((state) => state.user);
  let user = userState?.user;

  // Fallback từ localStorage nếu Redux state bị lỗi
  if (!user || !user.email) {
    try {
      const localUser = localStorage.getItem("user");
      if (localUser) {
        user = JSON.parse(localUser);
        console.log("🔧 Using fallback user from localStorage:", user);
      }
    } catch {
      console.log("🔧 No valid localStorage user data");
    }
  }

  //  Debug logging
  console.log("AuthButtons Debug:");
  console.log("Full userState:", userState);
  console.log("Final user:", user);
  console.log("user.email:", user?.email);
  console.log("user.fullname:", user?.fullname);
  console.log("user.imageUrl:", user?.imageUrl);

  //  Cải thiện logic kiểm tra đăng nhập
  const isLoggedIn = user && user.email && user.email.trim() !== "";
  console.log("isLoggedIn:", isLoggedIn);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const onLoginClick = () => {
    setOpen(true);
  };

  const items = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/user/profile"),
    },
    {
      key: "2",
      label: "Cài đặt",
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
    },
    {
      key: "3",
      label: "Lịch sử đặt chỗ",
      icon: <CalendarOutlined />,
      onClick: () => {
        navigate("/user/booking");
      },
    },
    {
      key: "4",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(logout());
        localStorage.clear(); //  Gộp xóa gọn
        navigate("/");
      },
    },
  ];

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications");
      console.log("Notifications API response:", response.data);
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Nếu API lỗi, sử dụng dữ liệu mẫu
      setNotifications([
        {
          id: 1,
          message: "Bạn có lịch hẹn mới",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          message: "Kết quả xét nghiệm đã có",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    console.log("Notification clicked:", notification);
    try {
      // Nếu thông báo chưa đọc, gọi API đánh dấu đã đọc
      if (!notification.isRead) {
        await api.patch(`/notifications/${notification.id}/read`);

        // Cập nhật state để hiển thị thông báo đã đọc
        setNotifications((prevNotifications) =>
          prevNotifications.map((item) =>
            item.id === notification.id ? { ...item, isRead: true } : item
          )
        );
      }

      // Đóng dropdown notification
      setShowNotifications(false);

      // Navigate đến trang booking
      console.log("🔔 [NOTIFICATION] Navigating to /user/booking");
      navigate("/user/booking");
    } catch (error) {
      console.error("Error handling notification:", error);
      // Nếu có lỗi, vẫn navigate đến booking page
      setShowNotifications(false);
      navigate("/user/booking");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);

    // Nếu đang mở thông báo, refresh dữ liệu
    if (!showNotifications && isLoggedIn) {
      fetchNotifications();
    }
  };

  return (
    <div className="header-buttons">
      {!isLoggedIn ? (
        <GradientButton onClick={onLoginClick}>
          <span className="login-btn">Đăng nhập</span>
        </GradientButton>
      ) : (
        <div className="auth-buttons">
          {/* Biểu tương thông báo */}
          <NotificationDropdown
            notifications={notifications}
            loading={loading}
            show={showNotifications}
            toggle={toggleNotifications}
            onClickNotification={handleNotificationClick}
          />
          {/* User dropdown */}
          <Dropdown menu={{ items }} trigger={["click"]}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Avatar src={user?.imageUrl || "/placeholder.svg"} />
              <span style={{ marginLeft: "8px" }}>
                {user?.fullname || "User"}
              </span>
            </div>
          </Dropdown>
        </div>
      )}

      <AuthModal open={open} onClose={() => setOpen(false)} />

      {/* Modal chi tiết thông báo */}
    </div>
  );
};

export default AuthButtons;
