import "./AuthButtons.css";
import GradientButton from "../../common/GradientButton.jsx";
import { useState, useEffect } from "react";
import AuthModal from "../../../features/authentication/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Badge } from "antd";
import { logout } from "../../../redux/reduxStore/userSlice.js";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/api";
import NotificationDropdown from "./Notification.jsx";
import NotificationDetail from "./NotificationDetail.jsx";

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationDetailVisible, setNotificationDetailVisible] = useState(false);
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
        { id: 1, message: "Bạn có lịch hẹn mới", createdAt: new Date().toISOString() },
        { id: 2, message: "Kết quả xét nghiệm đã có", createdAt: new Date().toISOString() }
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
        setNotifications(prevNotifications =>
          prevNotifications.map(item =>
            item.id === notification.id
              ? { ...item, isRead: true }
              : item
          )
        );
      }

      // Lấy chi tiết thông báo từ API khi người dùng nhấn vào thông báo
      const detailResponse = await api.get(`/notifications/${notification.id}`);
      console.log("Notification detail response:", detailResponse.data);

      // Hiển thị chi tiết thông báo từ API
      setSelectedNotification(detailResponse.data);
      setNotificationDetailVisible(true);
    } catch (error) {
      console.error("Error handling notification:", error);
      // Nếu có lỗi, vẫn hiển thị thông báo với dữ liệu hiện có
      setSelectedNotification(notification);
      setNotificationDetailVisible(true);
    }
  };

  const closeNotificationDetail = () => {
    setNotificationDetailVisible(false);
    setSelectedNotification(null);
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
              style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
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

      {/* Modal chi tiết thông báo */ tao them dữ lie}
      <NotificationDetail
        visible={notificationDetailVisible}
        notification={selectedNotification}
        onClose={closeNotificationDetail}
      />
    </div>
  );
};

export default AuthButtons;
