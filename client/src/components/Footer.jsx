import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

// 1. Import your logo from the assets folder
import logo from "../assets/cropshare-logo.png";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content-wrapper">
        <div className="footer-top">
          {/* Column 1: Logo and Tagline */}
          <div className="footer-col about-col">
            <Link to="/" className="footer-logo-link">
              {/* 2. Use the imported logo in an img tag */}
              <img
                src={logo}
                alt="CropShare Logo"
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-tagline">
              Connecting farmers and NGOs to reduce food waste and feed
              communities.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="footer-col">
            <h5>Platform</h5>
            <ul className="footer-links">
              <li>
                <Link to="/browse">Browse Crops</Link>
              </li>
              <li>
                <Link to="/about">Features</Link>
              </li>
              <li>
                <Link to="/about">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div className="footer-col">
            <h5>Support</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Help Center</Link>
              </li>
              <li>
                <Link to="/">Contact Us</Link>
              </li>
              <li>
                <Link to="/">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Links */}
          <div className="footer-col">
            <h5>Legal</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/">Terms of Service</Link>
              </li>
              <li>
                <Link to="/">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p>&copy; 2024 CropShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
