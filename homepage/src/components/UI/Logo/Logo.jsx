import "./Logo.css";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logo">
      <Link to="/" className="logo-link">
        <span className="logo-icon">♀</span>
        <div className="logo-text">
          <span className="logo-main">Gender Healthcare</span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
