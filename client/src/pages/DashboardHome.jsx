import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBox,
  FiUsers,
  FiFeather,
  FiTrendingUp,
  FiExternalLink,
} from "react-icons/fi";

import "../styles/DashboardHome.css";

import {
  getMyCrops,
  getUnreadRequestCount,
  getUnreadMessageCount,
  getAllNGOs,
  getAllCrops,
  getSentRequests,
} from "../services/api.js";

import { useAuth } from "../hooks/useAuth.js";

import WeatherCard from "../components/WeatherCard.jsx";
import QuickStats from "../components/QuickStats.jsx";
import CropHealthAlerts from "../components/CropHealthAlerts.jsx";
import PickupDeliveryStatus from "../components/PickupDeliveryStatus.jsx";
import CropFreshnessReminder from "../components/CropFreshnessReminder.jsx";
import EcosystemPartners from "../components/EcosystemPartners.jsx";
import PickupOperations from "../components/PickupOperations.jsx";

const DashboardHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState([
    {
      id: 1,
      labelTop: "Your",
      labelBottom: "Listings",
      value: "-",
      chip: "",
      icon: <FiBox />,
      accent: "#0d6efd",
    },
    {
      id: 2,
      labelTop: "Unread",
      labelBottom: "Messages",
      value: "-",
      chip: "",
      icon: <FiTrendingUp />,
      accent: "#f59e0b",
    },
    {
      id: 3,
      labelTop: "Pending",
      labelBottom: "Requests",
      value: "-",
      chip: "",
      icon: <FiFeather />,
      accent: "#059669",
    },
    {
      id: 4,
      labelTop: "Active",
      labelBottom: "NGOs",
      value: "-",
      chip: "",
      icon: <FiUsers />,
      accent: "#8b5cf6",
    },
  ]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const unreadMsg = await getUnreadMessageCount().catch(() => ({
          count: 0,
        }));

        if (user?.role === "farmer") {
          const [myCrops, unreadReq, ngos] = await Promise.all([
            getMyCrops().catch(() => []),
            getUnreadRequestCount().catch(() => ({ count: 0 })),
            getAllNGOs().catch(() => []),
          ]);

          if (!mounted) return;

          setMetrics([
            {
              id: 1,
              labelTop: "Your",
              labelBottom: "Listings",
              value: String(myCrops.length || 0),
              chip: "live",
              icon: <FiBox />,
              accent: "#0d6efd",
            },
            {
              id: 2,
              labelTop: "Unread",
              labelBottom: "Messages",
              value: String(unreadMsg.count ?? 0),
              chip: unreadMsg.count ? "+ new" : "all read",
              icon: <FiTrendingUp />,
              accent: "#f59e0b",
            },
            {
              id: 3,
              labelTop: "Pending",
              labelBottom: "Requests",
              value: String(unreadReq.count ?? 0),
              chip: unreadReq.count ? "attention" : "none",
              icon: <FiFeather />,
              accent: "#059669",
            },
            {
              id: 4,
              labelTop: "Active",
              labelBottom: "NGOs",
              value: String(ngos.length || 0),
              chip: "+ ecosystem",
              icon: <FiUsers />,
              accent: "#8b5cf6",
            },
          ]);
        } else {
          // NGO dashboard
          const [sent, crops, ngos] = await Promise.all([
            getSentRequests().catch(() => []),
            getAllCrops({}).catch(() => []),
            getAllNGOs().catch(() => []),
          ]);

          if (!mounted) return;

          setMetrics([
            {
              id: 1,
              labelTop: "Your",
              labelBottom: "Sent Requests",
              value: String(sent.length || 0),
              chip: sent.length ? "active" : "none",
              icon: <FiFeather />,
              accent: "#059669",
            },
            {
              id: 2,
              labelTop: "Unread",
              labelBottom: "Messages",
              value: String(unreadMsg.count ?? 0),
              chip: unreadMsg.count ? "+ new" : "all read",
              icon: <FiTrendingUp />,
              accent: "#f59e0b",
            },
            {
              id: 3,
              labelTop: "Available",
              labelBottom: "Crops",
              value: String(crops.length || 0),
              chip: "+ listings",
              icon: <FiBox />,
              accent: "#0d6efd",
            },
            {
              id: 4,
              labelTop: "Active",
              labelBottom: "NGOs",
              value: String(ngos.length || 0),
              chip: "network",
              icon: <FiUsers />,
              accent: "#8b5cf6",
            },
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className="dash-home">
      {/* Header */}
      <div className="dash-home-header">
        <div>
          <h2 className="dash-title">Dashboard Overview</h2>
          <p className="dash-subtitle">
            Welcome back, here's what's happening with your crops today.
          </p>
        </div>
        <div className="dash-actions">
          <Link to="#" className="btn-ghost">
            <FiExternalLink />
            <span>View Reports</span>
          </Link>
          <Link to="/dashboard/add-crop" className="btn-primary">
            <span>Add New Crop</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dash-stats-grid">
        {metrics.map((m) => (
          <div key={m.id} className="stat-card">
            <div className="stat-card-top">
              <div
                className="icon-wrap"
                style={{ backgroundColor: `${m.accent}16`, color: m.accent }}
              >
                {m.icon}
              </div>
            </div>
            <div className="stat-label">
              <div>{m.labelTop}</div>
              <div className="muted">{m.labelBottom}</div>
            </div>
            <div className="stat-value">{loading ? "—" : m.value}</div>
            {!loading && <div className="stat-chip">{m.chip}</div>}
          </div>
        ))}
      </div>

      {/* Farmer Sections */}
      {user?.role === "farmer" && (
        <>
          <WeatherCard />
          <QuickStats />
          <CropHealthAlerts />
          <PickupDeliveryStatus />
          <CropFreshnessReminder />
        </>
      )}

      {/* Quick Links */}
      <div className="dash-links-grid" style={{ marginTop: 12 }}>
        {user?.role === "farmer" ? (
          <>
            <Link to="/dashboard/my-listings" className="btn-ghost">
              Manage Listings
            </Link>
            <Link to="/dashboard/requests" className="btn-ghost">
              Incoming Requests
            </Link>
            <Link to="/dashboard/messages" className="btn-ghost">
              Messages
            </Link>
            <Link to="/dashboard/add-crop" className="btn-ghost">
              Add New Crop
            </Link>
          </>
        ) : (
          <>
            <Link to="/browse" className="btn-ghost">
              Browse Marketplace
            </Link>
            <Link to="/dashboard/my-requests" className="btn-ghost">
              Sent Requests
            </Link>
            <Link to="/dashboard/messages" className="btn-ghost">
              Messages
            </Link>
            <Link to="/dashboard/ngo-profile" className="btn-ghost">
              My Org Profile
            </Link>
          </>
        )}
      </div>

      {/* NGO Sections */}
      {user?.role === "ngo" && (
        <div className="ngo-ecosystem-sections">
          <EcosystemPartners />
          <PickupOperations />
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
