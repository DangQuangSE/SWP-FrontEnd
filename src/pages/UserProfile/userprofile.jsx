// pages/UserProfile/index.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import "./userprofile.css";

const menuItems = [
  { path: "profile", label: "Hồ sơ", icon: "👤" },
  // { path: "health", label: "Sức khỏe", icon: "❤️" },
  { path: "saved", label: "Đã lưu", icon: "📚" },
  { path: "booking", label: "Lịch sử đặt chỗ", icon: "" },
  { path: "attended", label: "Đã tham gia", icon: "👥" },
  // { path: "settings", label: "Thiết lập tài khoản", icon: "⚙️" },
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
