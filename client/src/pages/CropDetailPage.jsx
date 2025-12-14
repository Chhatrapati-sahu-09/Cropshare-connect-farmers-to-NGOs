import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCropById, makeRequest } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";
import Loader from "../components/Loader.jsx";
import { FaMapPin } from "react-icons/fa";
import "./CropDetailPage.css"; // We will replace this file

const CropDetailPage = () => {
  const { id } = useParams(); // Get crop ID from URL
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null); // For 'Contact' button

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setLoading(true);
        const data = await getCropById(id);
        setCrop(data);
      } catch (err) {
        setError(err.message || "Failed to fetch crop.");
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  const handleContactFarmer = async () => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not logged in
      return;
    }

    setRequestStatus({ loading: true, error: null, success: null });
    try {
      await makeRequest(id);
      setRequestStatus({
        loading: false,
        success: "Request sent successfully!",
        error: null,
      });
    } catch (err) {
      setRequestStatus({
        loading: false,
        error: err.message || "Failed to send request.",
        success: null,
      });
    }
  };

  // Helper function to render the button
  const renderContactButton = () => {
    if (!isLoggedIn) {
      return (
        <button className="contact-button" onClick={handleContactFarmer}>
          Login to Request Crop
        </button>
      );
    }
    if (user.role === "farmer") {
      return (
        <button className="contact-button disabled" disabled>
          Farmers cannot make requests
        </button>
      );
    }
    return (
      <button
        className="contact-button"
        onClick={handleContactFarmer}
        disabled={requestStatus?.loading || requestStatus?.success}
      >
        {requestStatus?.loading
          ? "Sending..."
          : requestStatus?.success
            ? "Request Sent!"
            : "Request This Crop"}
      </button>
    );
  };

  if (loading)
    return (
      <div className="page-loader-container">
        <Loader />
      </div>
    );
  if (error)
    return <div className="page-container error-container">Error: {error}</div>;
  if (!crop) return <div className="page-container">Crop not found.</div>;

  // --- New JSX Structure ---
  return (
    <div className="page-container">
      <div className="detail-card-pro">
        {/* Left Column: Image */}
        <div className="detail-image-wrapper">
          <img
            src={
              crop.image ||
              "https://placehold.co/600x600/e8f5e9/777?text=No+Image"
            }
            alt={crop.title}
            className="detail-image"
          />
          <span className="detail-tag">{crop.category}</span>
        </div>

        {/* Right Column: Info */}
        <div className="detail-info-wrapper">
          <h1 className="detail-title">{crop.title}</h1>

          {/* Farmer Info */}
          <div className="detail-farmer-info">
            <div className="farmer-avatar-pro">
              {(crop.farmerId?.name || "A")[0].toUpperCase()}
            </div>
            <div className="farmer-details">
              <span className="farmer-name-pro">
                {crop.farmerId?.name || "Anonymous Farmer"}
              </span>
              <span className="farmer-location-pro">
                <FaMapPin /> {crop.location?.address || "Location not set"}
              </span>
            </div>
          </div>

          <hr className="detail-divider" />

          {/* Stats Grid */}
          <div className="detail-stats-grid">
            <div className="stat-item">
              <span className="stat-label">Price</span>
              <span className="stat-value">₹{crop.price}</span>

            </div>
            <div className="stat-item">
              <span className="stat-label">Quantity</span>
              <span className="stat-value">{crop.quantity}</span>
            </div>
          </div>

          {/* Description */}
          <h3 className="detail-section-title">Description</h3>
          <p className="detail-description">{crop.description}</p>

          <hr className="detail-divider" />

          {/* Action Area */}
          <div className="detail-action-area">
            {renderContactButton()}
            {requestStatus?.error && (
              <p className="status-message error">{requestStatus.error}</p>
            )}
            {requestStatus?.success && (
              <p className="status-message success">{requestStatus.success}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetailPage;
