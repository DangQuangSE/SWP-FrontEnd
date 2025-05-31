"use client";
import "./Navigation.css";

const Navigation = () => {
  const navigationItems = [
    { label: "Home", href: "/", active: true },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="main-nav">
      <ul className="nav-list">
        {navigationItems.map((item, index) => (
          <li key={index} className="nav-item">
            <a
              href={item.href}
              className={`nav-link ${item.active ? "active" : ""}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
