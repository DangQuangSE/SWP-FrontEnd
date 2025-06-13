import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.css";

const Breadcrumb = ({ items }) => {
  const location = useLocation();
  return (
    <nav className="breadcrumb-nav" aria-label="breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, idx) => {
          const isActive = item.to && location.pathname === item.to;
          return (
            <li key={idx} className="breadcrumb-item">
              {item.to ? (
                <Link
                  to={item.to}
                  className={`breadcrumb-link${isActive ? " active" : ""}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
              {idx < items.length - 1 && (
                <span className="breadcrumb-separator">&#8250;</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;