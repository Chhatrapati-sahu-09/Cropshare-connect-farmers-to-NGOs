import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useNotifications } from "../hooks/useNotifications.js";
import "./DashboardLayout.css"; // We will update this file next

// Import your logo (make sure it's in client/src/assets/)
import logo from "../assets/cropshare-logo.png";

// Import Icons
import {
  FaTh,
  FaPlusSquare,
  FaBoxOpen,
  FaHandHoldingHeart,
  FaInbox,
  FaSearch,
  FaBuilding,
  FaPaperPlane,
  FaComments,
  FaUserCircle,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user } = useAuth();
  const { unreadRequests, unreadMessages } = useNotifications();

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        {/* Logo at the top */}
        <Link to="/" className="sidebar-logo-link">
          <img src={logo} alt="CropShare Logo" className="sidebar-logo-img" />
        </Link>

        <nav className="dashboard-nav">
          <ul>
            {/* Common Links (Everyone sees these) */}
            <li>
              <NavLink
                to="/dashboard"
                end // 'end' ensures this only matches /dashboard, not other links
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <FaTh className="nav-icon" /> Overview
              </NavLink>
            </li>

            {/* 🧑‍🌾 FARMER LINKS (Only Farmers see these) */}
            {user?.role === "farmer" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/add-crop"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    <FaPlusSquare className="nav-icon" /> Add New Crop
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-listings"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    <FaBoxOpen className="nav-icon" /> My Listings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/donate"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    <FaHandHoldingHeart className="nav-icon" /> Donate Now
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/requests"
                    className={({ isActive }) =>
                      "nav-link sidebar-link-with-badge" +
                      (isActive ? " active" : "")
                    }
                  >
                    <div className="sidebar-link-content">
                      <FaInbox className="nav-icon" /> Incoming Requests
                    </div>
                    {unreadRequests > 0 && (
                      <span className="notification-badge">
                        {unreadRequests}
                      </span>
                    )}
                  </NavLink>
                </li>
              </>
            )}

            {/* 🏢 NGO LINKS (Only NGOs see these) */}
            {user?.role === "ngo" && (
              <>
                <li>
                  <NavLink
                    to="/browse"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    <FaSearch className="nav-icon" /> Find Donations
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/ngo-profile"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    <FaBuilding className="nav-icon" /> My Org Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/my-requests"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    <FaPaperPlane className="nav-icon" /> Sent Requests
                  </NavLink>
                </li>
              </>
            )}

            {/* Common Links Again */}
            <li>
              <NavLink
                to="/dashboard/messages"
                className={({ isActive }) =>
                  "nav-link sidebar-link-with-badge" +
                  (isActive ? " active" : "")
                }
              >
                <div className="sidebar-link-content">
                  <FaComments className="nav-icon" /> Messages
                </div>
                {unreadMessages > 0 && (
                  <span className="notification-badge">{unreadMessages}</span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                <FaUserCircle className="nav-icon" /> Manage Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
