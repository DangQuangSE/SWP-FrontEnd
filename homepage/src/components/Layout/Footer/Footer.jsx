import React from "react";
import "./Footer.css";
import Logo from "../../UI/Logo/Logo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Logo />
            <p className="footer-description">
              Professional healthcare services for sexual and reproductive
              health.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/services">Services</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Services</h3>
              <ul>
                <li>
                  <a href="/services/consultation">Consultation</a>
                </li>
                <li>
                  <a href="/services/testing">Testing</a>
                </li>
                <li>
                  <a href="/services/treatment">Treatment</a>
                </li>
                <li>
                  <a href="/services/education">Education</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Contact Us</h3>
              <ul className="contact-info">
                <li>
                  <span className="icon">📍</span>
                  <span>123 Healthcare St., City</span>
                </li>
                <li>
                  <span className="icon">📞</span>
                  <span>+84 123 456 789</span>
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
