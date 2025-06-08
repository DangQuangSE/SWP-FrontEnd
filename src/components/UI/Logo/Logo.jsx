import "./Logo.css";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="logo">
      <Link to="/" className="logo-link">
        <img
          src="https://cdn.discordapp.com/attachments/1373906364270645271/1380195143763755008/logo-removebg-preview.png?ex=6842fe65&is=6841ace5&hm=4309c3321baf494e67d2538de7e22d953fd26b5a086667afed8d16adb5bdf694&"
          alt="Gender Healthcare Logo"
          className="logo-img"
          style={{ height: 40 }}
        />
      </Link>
    </div>
  );
};

export default Logo;
