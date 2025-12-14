import React, { useEffect, useState } from "react";
import { getNGOEcosystem } from "../services/api.js";
import "./EcosystemPartners.css";
import { FiUser, FiMapPin, FiPackage, FiClock, FiMail, FiBox } from "react-icons/fi";

const EcosystemPartners = () => {
  const [ecosystem, setEcosystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEcosystem = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNGOEcosystem();
        setEcosystem(data);
      } catch (err) {
        setError(err.message || "Failed to load ecosystem data");
        console.error("Ecosystem fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEcosystem();
  }, []);

  const formatDate = (date) => {
    if (!date || date === "No interaction") return "No interaction yet";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="ecosystem-container">
        <div className="ecosystem-header">
          <h3 className="ecosystem-title">Connected Farmers Overview</h3>
          <div className="ecosystem-stats">
            <div className="stat-chip skeleton"></div>
            <div className="stat-chip skeleton"></div>
          </div>
        </div>
        <div className="farmers-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="farmer-card-skeleton">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ecosystem-container">
        <div className="error-message">Warning: {error}</div>
      </div>
    );
  }

  if (!ecosystem || ecosystem.connectedFarmers.length === 0) {
    return (
      <div className="ecosystem-container">
        <div className="ecosystem-header">
          <h3 className="ecosystem-title">Connected Farmers Overview</h3>
        </div>
        <div className="empty-state">
          <p>No connected farmers yet.</p>
          <p className="empty-subtitle">
            Start sending requests to farmers to build your ecosystem.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ecosystem-container">
      <div className="ecosystem-header">
        <h3 className="ecosystem-title">Connected Farmers Overview</h3>
        <div className="ecosystem-stats">
          <div className="stat-chip">
            <span className="stat-value">
              {ecosystem.totalConnectedFarmers}
            </span>
            <span className="stat-label">Farmers</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">
              {ecosystem.totalAcceptedRequests}
            </span>
            <span className="stat-label">Requests</span>
          </div>
        </div>
      </div>

      <div className="farmers-grid">
        {ecosystem.connectedFarmers.map((farmer) => (
          <div key={farmer._id} className="farmer-card">
            <div className="farmer-card-header">
              <div className="farmer-avatar">
                <FiUser />
              </div>
              <div className="farmer-info-top">
                <h4 className="farmer-name">{farmer.name}</h4>
                <p className="farmer-village">
                  <FiMapPin size={12} /> {farmer.village}
                </p>
              </div>
            </div>

            <div className="farmer-stats">
              <div className="stat-item">
                <span className="stat-icon"><FiPackage size={14} /></span>
                <div className="stat-text">
                  <span className="stat-amount">
                    {farmer.totalCropsDonated}
                  </span>
                  <span className="stat-name">Crops Donated</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon"><FiBox size={14} /></span>
                <div className="stat-text">
                  <span className="stat-amount">{farmer.activeListing}</span>
                  <span className="stat-name">Active Listings</span>
                </div>
              </div>
            </div>

            <div className="farmer-footer">
              <div className="interaction-info">
                <FiClock size={13} />
                <span className="interaction-text">
                  Last: {formatDate(farmer.lastInteraction)}
                </span>
              </div>
              <a href={`mailto:${farmer.email}`} className="contact-btn">
                <FiMail size={14} /> Contact
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="ecosystem-insights">
        <h4 className="insights-title">Insights</h4>
        <ul className="insights-list">
          <li>
            You have{" "}
            <strong>
              {ecosystem.totalConnectedFarmers} active farmer partners
            </strong>
          </li>
          <li>
            <strong>
              {ecosystem.totalAcceptedRequests} successful requests
            </strong>{" "}
            in your ecosystem
          </li>
          <li>
            Average crops per farmer:{" "}
            <strong>
              {(
                ecosystem.connectedFarmers.reduce(
                  (sum, f) => sum + f.totalCropsDonated,
                  0
                ) / ecosystem.connectedFarmers.length
              ).toFixed(1)}
            </strong>
          </li>
          <li>
            Top contributor:{" "}
            <strong>
              {
                ecosystem.connectedFarmers.sort(
                  (a, b) => b.totalCropsDonated - a.totalCropsDonated
                )[0]?.name
              }
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EcosystemPartners;
