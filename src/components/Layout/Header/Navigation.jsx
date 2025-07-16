import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navigation.css";

const serviceOptions = [
  { label: "Tư vấn sức khỏe giới tính ", href: "/services?type=tu-van" },
  { label: "Xét nghiệm STIs", href: "/appointment" },
  { label: "Đăng kí khám bệnh", href: "/services?type=dangki" },
];

// Removed blog options - no longer using tag-based navigation

const Navigation = () => {
  const location = useLocation();
  const userState = useSelector((state) => state.user);

  // Get user from Redux state or fallback to localStorage
  let user = userState?.user;
  if (!user || !user.email) {
    try {
      const localUser = localStorage.getItem("user");
      if (localUser) {
        user = JSON.parse(localUser);
      }
    } catch {
      console.log("No valid localStorage user data");
    }
  }

  // Base navigation items
  const baseNavigationItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tin tức", href: "/blog" },
    { label: "Dịch vụ", href: "/services", dropdown: true },
    { label: "Liên hệ", href: "/contact" },
  ];

  // Role-specific navigation items
  const getRoleSpecificItems = (userRole) => {
    switch (userRole) {
      case "ADMIN":
        return [{ label: "Admin", href: "/admin" }];
      case "STAFF":
        return [{ label: "Staff", href: "/staff" }];
      case "CONSULTANT":
        return [{ label: "Consultant", href: "/consultant" }];
      default:
        return [];
    }
  };

  // All possible role navigation items (for styling check)
  const allRoleNavigationItems = [
    { label: "Admin", href: "/admin" },
    { label: "Staff", href: "/staff" },
    { label: "Consultant", href: "/consultant" },
  ];

  // Combine navigation items based on user role
  const roleSpecificItems = getRoleSpecificItems(user?.role);
  const navigationItems = [...baseNavigationItems, ...roleSpecificItems];

  return (
    <nav className="main-nav">
      <ul className="nav-list">
        {navigationItems.map((item, index) => {
          // Check if this is a role navigation item
          const isRoleItem = allRoleNavigationItems.some(
            (roleItem) => roleItem.href === item.href
          );

          return (
            <li
              key={index}
              className={`nav-item${item.dropdown ? " has-dropdown" : ""}${
                isRoleItem ? " admin-item" : ""
              }`}
            >
              <Link
                to={item.href}
                className={`nav-link${
                  location.pathname === item.href ? " active" : ""
                }${isRoleItem ? " admin-nav" : ""}`}
              >
                {item.label}
              </Link>
              {/* Dropdown for Dịch vụ */}
              {item.dropdown && item.label === "Dịch vụ" && (
                <ul className="dropdown-menu">
                  {serviceOptions.map((opt, idx) => (
                    <li key={idx}>
                      <Link to={opt.href} className="dropdown-link">
                        {opt.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {/* Removed Tin tức dropdown - now goes directly to /blog */}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
