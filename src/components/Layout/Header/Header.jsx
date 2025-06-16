import React, { useEffect, useRef } from "react";
import MainHeader from "./MainHeader";
import "./Header.css";

const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      if (window.scrollY > 20) {
        headerRef.current.classList.add("scrolled");
      } else {
        console.log("first");

        headerRef.current.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header ref={headerRef} className="header">
      <MainHeader />
    </header>
  );
};

export default Header;
