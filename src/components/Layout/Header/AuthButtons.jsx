import "./AuthButtons.css";
import GradientButton from "../../common/GradientButton.jsx";
import { useState, useEffect } from "react";
import AuthModal from "../../../features/authentication/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellFilled
} from "@ant-design/icons";
import { Avatar, Dropdown, Badge } from "antd";
import { logout } from "../../../redux/reduxStore/userSlice.js";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/api";
import { formatDistanceToNow, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale';

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'Vừa xong';

  try {
    const date = parseISO(dateTimeString);
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    // Kết quả: "5 phút trước", "2 giờ trước", "3 ngày trước", v.v.
  } catch (e) {
    console.error('Error parsing date:', e);
    return 'Vừa xong';
  }
};

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

  // const toggleNotifications = () => {
  //   setShowNotifications(!showNotifications);
  // };

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

  // const notifications = [
  //   { id: 1, message: "Có tin nhắn mới" },
  //   { id: 2, message: "Bạn có thông báo mới" },
  // ];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

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

      // Hiển thị chi tiết thông báo
      setSelectedNotification(notification);
      setNotificationDetailVisible(true);
    } catch (error) {
      console.error("Error marking notification as read:", error);
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
          <div className="notification-icon">
            {/* <BellFilled /> */}
            <Badge count={notifications.length} size="large">
              <div className="notification-circle"
                onClick={toggleNotifications}>
                <BellFilled />
              </div>
            </Badge>
            {showNotifications && (
              <div className="simple-notification-dropdown">
                {/* Bảng trắng đơn giản */}
                <div className="notification-header">
                  <h3>Thông báo</h3>
                </div>

                {loading ? (
                  <div className="notification-loading">Đang tải...</div>
                ) : notifications.length === 0 ? (
                  <div className="notification-empty">Không có thông báo mới</div>
                ) : (
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="notification-content">
                          <h4 className="notification-title">{notification.title}</h4>
                          <p className="notification-message">{notification.content}</p>
                          <span className="notification-time">
                            {formatDateTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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

      {/* Modal chi tiết thông báo */}
      {notificationDetailVisible && selectedNotification && (
        <div className="notification-detail-modal" onClick={closeNotificationDetail}>
          <div className="notification-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="notification-detail-header">
              <h3>{selectedNotification.title}</h3>
              <button className="close-button" onClick={closeNotificationDetail}>×</button>
            </div>
            <div className="notification-detail-body">
              <p className="notification-detail-message">{selectedNotification.content}</p>

              {/* Hiển thị thông tin liên quan đến cuộc hẹn nếu có */}
              {selectedNotification.appointment && (
                <div className="notification-appointment-info">
                  <h4>Thông tin cuộc hẹn</h4>
                  <p>Dịch vụ: {selectedNotification.appointment.serviceName}</p>
                  <p>Thời gian: {new Date(selectedNotification.appointment.appointmentTime).toLocaleString('vi-VN')}</p>
                  <p>Trạng thái: {selectedNotification.appointment.status}</p>
                </div>
              )}

              {/* Hiển thị thông tin liên quan đến chu kỳ nếu có */}
              {selectedNotification.cycleTracking && (
                <div className="notification-cycle-info">
                  <h4>Thông tin chu kỳ</h4>
                  <p>Ngày dự kiến: {new Date(selectedNotification.cycleTracking.expectedDate).toLocaleDateString('vi-VN')}</p>
                </div>
              )}

              <div className="notification-detail-footer">
                <span className="notification-time">
                  {formatDateTime(selectedNotification.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
