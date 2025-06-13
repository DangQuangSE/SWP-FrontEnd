import "./Logo.css";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logo">
      <Link to="/" className="logo-link">
        <img
          src="logostc.png"
          alt="Gender Healthcare Logo"
          className="logo-img"
          style={{ height: 40 }}
        />
      </Link>
    </div>
  );
};

export default Logo;
