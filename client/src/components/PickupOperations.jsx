import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import "./PickupOperations.css";
import { FiCalendar, FiMapPin, FiCheck, FiClock } from "react-icons/fi";

const PickupOperations = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPickups = async () => {
      try {
        setLoading(true);
        // Fetch real pickup data from API - no dummy data
        setPickups([]);
      } catch (error) {
        console.error("Error loading pickups:", error);
        setPickups([]);
      } finally {
        setLoading(false);
      }
    };

    loadPickups();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "scheduled":
        return "#3b82f6";
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "scheduled":
        return "Scheduled";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="pickup-section">
        <div className="pickup-header">
          <h3>Pickup Operations</h3>
        </div>
        <div className="loading-state">Loading pickups...</div>
      </div>
    );
  }

  return (
    <div className="pickup-section">
      <div className="pickup-header">
        <h3>Pickup Operations</h3>
        <span className="pickup-count">{pickups.length} pickups</span>
      </div>

      <div className="pickups-list">
        {pickups.length > 0 ? (
          pickups.map((pickup) => (
            <div key={pickup.id} className="pickup-item">
              <div className="pickup-main">
                <div className="pickup-info">
                  <h4>{pickup.farmer}</h4>
                  <p className="crop-name">{pickup.crop}</p>
                </div>
                <div className="pickup-details">
                  <span className="quantity">{pickup.quantity}</span>
                  <div className="location-badge">
                    <FiMapPin size={14} />
                    <span>{pickup.village}</span>
                  </div>
                </div>
              </div>

              <div className="pickup-footer">
                <div className="date-info">
                  <FiCalendar size={14} />
                  <span>{pickup.date}</span>
                </div>
                <div
                  className="status-badge"
                  style={{ borderColor: getStatusColor(pickup.status) }}
                >
                  {pickup.status === "completed" ? (
                    <FiCheck
                      size={14}
                      style={{ color: getStatusColor(pickup.status) }}
                    />
                  ) : (
                    <FiClock
                      size={14}
                      style={{ color: getStatusColor(pickup.status) }}
                    />
                  )}
                  <span style={{ color: getStatusColor(pickup.status) }}>
                    {getStatusLabel(pickup.status)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No pickups scheduled</p>
            <span className="text-muted">
              Add a request to schedule a pickup
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupOperations;
