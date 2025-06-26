"use client";
import "./MainHeader.css";
import Logo from "../../../assets/Logo";
import Navigation from "./Navigation";
import AuthButtons from "./AuthButtons";

const MainHeader = () => {
  // Ví dụ notifications demo, bạn có thể truyền props hoặc lấy từ redux, context...

  return (
    <div className="main-header">
      <div className="container main-header-container">
        <div className="header-section logo-section">
          <Logo />
        </div>

        <div className="header-section nav-section">
          <Navigation />
        </div>

        <div className="header-section auth-section">
          <AuthButtons />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
