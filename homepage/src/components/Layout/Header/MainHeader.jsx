"use client";
import "./MainHeader.css";
import Logo from "../../UI/Logo/Logo";
import Navigation from "./Navigation";
import AuthButtons from "./AuthButtons";

const MainHeader = () => {
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
