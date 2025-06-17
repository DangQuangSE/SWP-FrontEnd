import { useState } from "react";
import { useSelector } from "react-redux";
import "./userprofile.css";

export default function UserProfile() {
  const user = useSelector((state) => state.user);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [activeTab, setActiveTab] = useState("3");
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    dob: user?.date_of_birth || "",
    gender: user?.gender || "",
    phone: user?.phone || "",
  });

  const menuItems = [
    { key: "1", icon: "👤", label: "Xem hồ sơ của tôi" },
    { key: "2", icon: "❤️", label: "Sức khỏe", iconClass: "up-heart-icon" },
    { key: "3", icon: "📚", label: "Đã lưu", iconClass: "up-saved-icon" },
    {
      key: "4",
      icon: "📅",
      label: "Lịch sử đặt chỗ",
      iconClass: "up-calendar-icon",
    },
    { key: "5", icon: "👥", label: "Đã tham gia", iconClass: "up-team-icon" },
    { key: "7", icon: "⚙️", label: "Thiết lập tài khoản", hasSubmenu: true },
    { key: "8", icon: "❓", label: "Trợ giúp", iconClass: "up-help-icon" },
    { key: "9", icon: "🚪", label: "Đăng xuất", iconClass: "up-logout-icon" },
  ];

  const tabs = [
    { key: "1", label: "Lịch hẹn sắp đến (0)" },
    { key: "2", label: "Hoàn thành (0)" },
    { key: "3", label: "Lịch sử đặt chỗ" },
    { key: "4", label: "Gói khám sức khỏe (0)" },
  ];

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    console.log("Lưu hồ sơ:", form);
    setIsEditing(false);
    // TODO: Gửi API cập nhật backend ở đây
  };

  const renderProfileView = () => (
    <div className="up-profile-card">
      <div className="up-profile-header">
        <img
          src={user?.imageUrl || "/placeholder.svg"}
          className="up-profile-avatar"
        />
        <div>
          <h2>{user?.fullname}</h2>
          <p>{user?.username}</p>
        </div>
      </div>
      <table className="up-profile-table">
        <tbody>
          <tr>
            <td>Họ và tên</td>
            <td>{user?.fullname}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user?.email}</td>
          </tr>
          <tr>
            <td>Ngày sinh</td>
            <td>{user?.date_of_birth || "--"}</td>
          </tr>
          <tr>
            <td>Giới tính</td>
            <td>{user?.gender || "--"}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>{user?.phone || "--"}</td>
          </tr>
        </tbody>
      </table>
      <div className="up-profile-edit">
        <button
          className="up-find-hospital-btn"
          onClick={() => setIsEditing(true)}
        >
          Chỉnh sửa ✏️
        </button>
      </div>
    </div>
  );

  const renderProfileForm = () => (
    <div className="up-profile-card">
      <div className="up-profile-header">
        <img
          src={user?.imageUrl || "/placeholder.svg"}
          className="up-profile-avatar"
        />
        <div>
          <h2>{user?.fullname || user?.name}</h2>
          <p>{user?.username}</p>
        </div>
      </div>
      <table className="up-profile-table">
        <tbody>
          <tr>
            <td>Họ và tên</td>
            <td>
              <input
                value={form.fullname}
                onChange={(e) => handleChange("fullname", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Ngày sinh</td>
            <td>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Giới tính</td>
            <td>
              <select
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">--</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="up-profile-edit">
        <button className="up-find-hospital-btn" onClick={handleSave}>
          Lưu
        </button>
        <button className="up-cancel-btn" onClick={() => setIsEditing(false)}>
          Hủy
        </button>
      </div>
    </div>
  );

  const renderEmptyState = (title, description, showButton = false) => (
    <div className="up-empty-state">
      <h3 className="up-empty-title">{title}</h3>
      <p className="up-empty-description">{description}</p>
      {showButton && (
        <button className="up-find-hospital-btn">Đăng kí khám bệnh</button>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return renderEmptyState(
          "Không có lịch hẹn sắp đến",
          "Đặt lịch với chuyên gia gần bạn",
          true
        );
      case "2":
        return renderEmptyState(
          "Không có lịch hẹn đã hoàn thành",
          "Các cuộc hẹn đã hoàn thành sẽ xuất hiện ở đây"
        );
      case "3":
        return renderEmptyState(
          "Không có lịch hẹn sắp đến",
          "Đặt lịch với chuyên gia gần bạn",
          true
        );
      case "4":
        return renderEmptyState(
          "Không có gói khám sức khỏe",
          "Các gói khám sức khỏe sẽ xuất hiện ở đây"
        );
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    if (selectedMenuItem === "1") {
      return isEditing ? renderProfileForm() : renderProfileView();
    } else {
      return (
        <>
          <div className="up-tabs-nav">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`up-tab-button ${
                  activeTab === tab.key ? "up-tab-active" : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="up-tab-content">{renderTabContent()}</div>
        </>
      );
    }
  };

  return (
    <div className="up-medical-layout">
      <div className="up-sidebar">
        <div className="up-user-profile">
          <div className="up-user-avatar">
            <img src={user?.imageUrl || "/placeholder.svg"} alt="User Avatar" />
          </div>
          <div className="up-user-info">
            <h3 className="up-user-name">{user?.fullname || user?.name}</h3>
            <p className="up-user-handle">{user?.email || user?.username}</p>
          </div>
          <div className="up-member-badge">
            <span className="up-member-text">Thành viên</span>
          </div>
        </div>

        <nav className="up-sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`up-menu-item ${
                selectedMenuItem === item.key ? "up-menu-item-selected" : ""
              }`}
              onClick={() => {
                setSelectedMenuItem(item.key);
                setIsEditing(false);
              }}
            >
              <span className={`up-menu-icon ${item.iconClass || ""}`}>
                {item.icon}
              </span>
              <span className="up-menu-label">{item.label}</span>
              {item.hasSubmenu && <span className="up-submenu-arrow">▼</span>}
            </div>
          ))}
        </nav>
      </div>

      <div className="up-main-layout">
        <div className="up-main-content">
          <div className="up-content-header">
            <h1 className="up-page-title">
              {selectedMenuItem === "1" ? "Hồ sơ" : "Lịch sử đặt chỗ"}
            </h1>
          </div>
          <div className="up-booking-tabs">{renderMainContent()}</div>
        </div>
      </div>
    </div>
  );
}
