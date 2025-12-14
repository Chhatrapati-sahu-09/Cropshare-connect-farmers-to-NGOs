import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useNotifications } from "../hooks/useNotifications.js";
import { FaBars, FaTimes, FaTh } from "react-icons/fa"; // Icons for menu and dashboard
import { changeLanguage } from "../utils/translate.js";
import "./Navbar.css"; // We will use this new CSS file

const Navbar = ({ logo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("preferredLanguage") || "en"
  );
  const { isLoggedIn, user, logout } = useAuth();
  const { unreadRequests, unreadMessages } = useNotifications();
  const navigate = useNavigate();

  // Combine notification counts
  const totalUnread = (unreadRequests || 0) + (unreadMessages || 0);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setCurrentLanguage(langCode);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMobileMenu();
  };

  return (
    <nav className="navbar-pro">
      <div className="navbar-pro-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo-link" onClick={closeMobileMenu}>
          {logo && (
            <img src={logo} alt="CropShare Logo" className="navbar-logo-img" />
          )}
        </Link>

        {/* Hamburger Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Menu Links */}
        <ul className={isMenuOpen ? "nav-menu-pro active" : "nav-menu-pro"}>
          {/* 👤 GUEST / 🤝 NGO Links */}
          {(!isLoggedIn || (isLoggedIn && user?.role === "ngo")) && (
            <>
              <li className="nav-item-pro">
                <Link
                  to="/browse"
                  className="nav-link-pro"
                  onClick={closeMobileMenu}
                >
                  Browse Crops
                </Link>
              </li>
              <li className="nav-item-pro">
                <Link
                  to="/map"
                  className="nav-link-pro"
                  onClick={closeMobileMenu}
                >
                  Map
                </Link>
              </li>
            </>
          )}

          {/* 👨‍🌾 FARMER Links */}
          {isLoggedIn && user?.role === "farmer" && (
            <>
              <li className="nav-item-pro">
                <Link
                  to="/dashboard/add-crop"
                  className="nav-link-pro"
                  onClick={closeMobileMenu}
                >
                  Add Crop
                </Link>
              </li>
              <li className="nav-item-pro">
                <Link
                  to="/dashboard/my-listings"
                  className="nav-link-pro"
                  onClick={closeMobileMenu}
                >
                  My Crops
                </Link>
              </li>
              <li className="nav-item-pro">
                <Link
                  to="/dashboard/donate"
                  className="nav-link-pro"
                  onClick={closeMobileMenu}
                >
                  Donate Now
                </Link>
              </li>
            </>
          )}

          {/* Common Links for Everyone */}
          <li className="nav-item-pro">
            <Link
              to="/about"
              className="nav-link-pro"
              onClick={closeMobileMenu}
            >
              How It Works
            </Link>
          </li>

          {/* Mobile-only buttons */}
          <li className="nav-buttons-mobile">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="nav-btn-mobile"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="nav-btn-mobile primary"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="nav-btn-mobile"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <button
                  className="nav-btn-mobile primary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </li>
        </ul>

        {/* Desktop-Only Buttons */}
        <div className="nav-buttons-desktop">
          {/* Hidden container for Google Translate widget (used programmatically) */}
          <div id="google_translate_element" style={{ display: 'none' }} />
          {/* Language Buttons */}
          <div className="language-buttons">
            <button
              onClick={() => handleLanguageChange("hi")}
              className={`lang-btn ${currentLanguage === "hi" ? "active" : ""}`}
              title="हिंदी"
            >
              हिंदी
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`lang-btn ${currentLanguage === "en" ? "active" : ""}`}
              title="English"
            >
              EN
            </button>
          </div>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link-signin-pro">
                Sign In
              </Link>
              <Link to="/register" className="nav-btn-pro primary">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-btn-pro dashboard-btn-pro">
                <FaTh /> Dashboard
                {totalUnread > 0 && (
                  <span className="nav-notification-badge-pro">
                    {totalUnread}
                  </span>
                )}
              </Link>
              <button className="nav-btn-pro primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
