// pages/UserProfile/index.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UserIcon,
  HealthIcon,
  BookIcon,
  CalendarIcon,
  UsersIcon,
  SettingsIcon,
} from "../../components/Icons/UserProfileIcons";
import "./userprofile.css";

const menuItems = [
  {
    path: "profile",
    label: "Hồ sơ",
    icon: <UserIcon size={18} color="#3b82f6" />,
  },
  // { path: "health", label: "Sức khỏe", icon: <HealthIcon size={18} color="#3b82f6" /> },
  {
    path: "saved",
    label: "Đã lưu",
    icon: <BookIcon size={18} color="#3b82f6" />,
  },
  {
    path: "booking",
    label: "Lịch sử đặt chỗ",
    icon: <CalendarIcon size={18} color="#3b82f6" />,
  },
  {
    path: "attended",
    label: "Đã tham gia",
    icon: <UsersIcon size={18} color="#3b82f6" />,
  },
  // { path: "settings", label: "Thiết lập tài khoản", icon: <SettingsIcon size={18} color="#3b82f6" /> },
];

export default function UserProfileLayout() {
  const user = useSelector((state) => state.user.user);

  console.log("User redux:", user);

  return (
    <div className="up-profile-container">
      <aside className="up-sidebar">
        <div className="up-user-profile">
          <img
            className="up-profile-avatar"
            src={user.imageUrl || "/placeholder.svg"}
            alt="avatar"
          />
          <div className="up-user-info">
            <h3>{user.fullname}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <nav className="up-sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={({ isActive }) =>
                `up-menu-item ${isActive ? "up-menu-item-selected" : ""}`
              }
              end
            >
              <span className="up-menu-icon">{item.icon}</span>
              <span className="up-menu-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="up-main">
        <div className="up-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
