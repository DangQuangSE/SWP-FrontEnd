import React from "react";
import "./Footer.css";
import Logo from "../../../assets/Logo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Logo className="logo" />
            <p className="footer-description">
              Professional healthcare services for sexual and reproductive
              health.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Tin tức</h3>
              <ul>
                <li>
                  <Link to="/tin-y-te">Tin Y tế </Link>
                </li>
                <li>
                  <Link to="/tin-dich-vu">Tin Dịch vụ</Link>
                </li>
                <li>
                  <Link to="/y-hoc-thuong-thuc">Y học thường thức</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Dịch vụ</h3>
              <ul>
                <li>
                  <Link to="/services?type=tu-van">Tư vấn sức khỏe</Link>
                </li>
                <li>
                  <Link to="/appointment">Xét nghiệm STIs</Link>
                </li>
                <li>
                  <Link to="/services?type=dangki">Đăng kí khám </Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Liên hệ</h3>
              <ul className="contact-info">
                <li>
                  <span className="icon">📍</span>
                  <span>
                    Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP.
                    Thủ Đức, TP. Hồ Chí Minh
                  </span>
                </li>
                <li>
                  <span className="icon">📞</span>s<span>+84 123 456 789</span>
                </li>
                <li>
                  <span className="icon">✉️</span>
                  <span>info@genderhealthcare.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Gender Healthcare. All rights
            reserved.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">
              FB
            </a>
            <a href="#" className="social-link">
              TW
            </a>
            <a href="#" className="social-link">
              IG
            </a>
            <a href="#" className="social-link">
              YT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
