import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const serviceOptions = [
  { label: "Tư vấn sức khỏe giới tính ", href: "/services?type=tu-van" },
  { label: "Xét nghiệm STIs", href: "/appointment" },
  { label: "Đăng kí khám bệnh", href: "/services?type=dangki" },
];

const blogOptions = [
  { label: "Tin Y tế", href: "/tin-y-te" },
  { label: "Tin dịch vụ", href: "/tin-dich-vu" },
  { label: "Y học thường thức", href: "/y-hoc-thuong-thuc" },
];

const Navigation = () => {
  const location = useLocation();
  const navigationItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tin tức", href: "/blog", dropdown: true },
    { label: "Dịch vụ", href: "/services", dropdown: true },
    { label: "Liên hệ", href: "/contact" },
  ];

  return (
    <nav className="main-nav">
      <ul className="nav-list">
        {navigationItems.map((item, index) => (
          <li
            key={index}
            className={`nav-item${item.dropdown ? " has-dropdown" : ""}`}
          >
            <Link
              to={item.href}
              className={`nav-link${location.pathname === item.href ? " active" : ""}`}
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
            {/* Dropdown for Tin tức */}
            {item.dropdown && item.label === "Tin tức" && (
              <ul className="dropdown-menu">
                {blogOptions.map((opt, idx) => (
                  <li key={idx}>
                    <Link
                      to={opt.href}
                      className={`dropdown-link${location.pathname === opt.href ? " active" : ""}`}
                    >
                      {opt.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;