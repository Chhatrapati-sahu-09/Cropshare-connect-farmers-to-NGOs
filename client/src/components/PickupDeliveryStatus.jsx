import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { getReceivedRequests } from "../services/api.js";
import "./PickupDeliveryStatus.css";
import {
  FiTruck,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const PickupDeliveryStatus = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPickups = async () => {
      try {
        setLoading(true);
        const requests = await getReceivedRequests().catch(() => []);

        // Filter and format accepted requests for pickup display
        const pickupData = requests
          .filter((req) => req.status === "accepted")
          .map((req) => ({
            id: req._id,
            cropName: req.cropId?.title || "Unknown crop",
            ngoName:
              req.buyerId?.organizationName || req.buyerId?.name || "NGO",
            pickupDate: new Date(req.createdAt).toLocaleDateString("en-IN"),
            pickupTime: "10:00 AM - 2:00 PM", // Default time window
            status: getRandomStatus(), // Simulated status
            location: req.buyerId?.location || "Location pending",
          }))
          .slice(0, 5); // Show only latest 5

        setPickups(pickupData);
      } catch (error) {
        console.error("Error loading pickups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "farmer") {
      loadPickups();
    }
  }, [user]);

  const getRandomStatus = () => {
    const statuses = ["arriving", "completed", "awaiting-approval"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "arriving":
        return <FiTruck />;
      case "completed":
        return <FiCheckCircle />;
      case "awaiting-approval":
        return <FiAlertCircle />;
      default:
        return <FiClock />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "arriving":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "awaiting-approval":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "arriving":
        return "Arriving";
      case "completed":
        return "Completed";
      case "awaiting-approval":
        return "Awaiting Approval";
      default:
        return "Pending";
    }
  };

  if (loading) {
    return (
      <div className="pickup-status-section">
        <div className="ps-header">
          <h3>Pickup & Delivery Status</h3>
        </div>
        <div className="ps-loading">Loading pickups...</div>
      </div>
    );
  }

  if (pickups.length === 0) {
    return (
      <div className="pickup-status-section">
        <div className="ps-header">
          <h3>Pickup & Delivery Status</h3>
        </div>
        <div className="ps-empty">
          <p>No active pickups</p>
          <span>Accepted requests will appear here</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pickup-status-section">
      <div className="ps-header">
        <h3>Pickup & Delivery Status</h3>
        <span className="ps-count">{pickups.length} upcoming</span>
      </div>

      <div className="pickups-timeline">
        {pickups.map((pickup) => (
          <div key={pickup.id} className="pickup-card">
            <div className="pickup-status-badge">
              <div
                className="status-icon"
                style={{ color: getStatusColor(pickup.status) }}
              >
                {getStatusIcon(pickup.status)}
              </div>
              <span
                className="status-label"
                style={{ color: getStatusColor(pickup.status) }}
              >
                {getStatusLabel(pickup.status)}
              </span>
            </div>

            <div className="pickup-details">
              <h4 className="crop-title">{pickup.cropName}</h4>
              <p className="ngo-name">{pickup.ngoName}</p>

              <div className="details-grid">
                <div className="detail-item">
                  <FiClock size={14} />
                  <div>
                    <span className="label">Pickup Date</span>
                    <span className="value">{pickup.pickupDate}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <FiClock size={14} />
                  <div>
                    <span className="label">Pickup Time</span>
                    <span className="value">{pickup.pickupTime}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <FiMapPin size={14} />
                  <div>
                    <span className="label">Location</span>
                    <span className="value">{pickup.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickupDeliveryStatus;
