import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const serviceOptions = [
  { label: "Tư vấn sức khỏe giới tính ", href: "/services?type=tu-van" },
  { label: "Xét nghiệm STIs", href: "/services?type=stis" },
  { label: "Đăng kí khám bệnh", href: "/services?type=dangki" },
];

const Navigation = () => {
  const location = useLocation();
  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/" },
    { label: "Dịch vụ", href: "/blog", dropdown: true },
    { label: "Contact", href: "/contact" },
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
              className={`nav-link${
                location.pathname === item.href ? " active" : ""
              }`}
            >
              {item.label}
            </Link>
            {item.dropdown && (
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
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
