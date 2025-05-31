"use client";

import { useState, useEffect } from "react";
import "./Header.css";
import MainHeader from "./MainHeader";
import SubHeader from "./SubHeader";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <MainHeader />
      <SubHeader />
    </header>
  );
};

export default Header;
