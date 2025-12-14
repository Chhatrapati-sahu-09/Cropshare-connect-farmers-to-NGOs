import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import {
  getMyCrops,
  getReceivedRequests,
  getSentRequests,
} from "../services/api.js";
import "./QuickStats.css";
import { FiTrendingUp, FiBox, FiCheckCircle, FiUsers } from "react-icons/fi";

const QuickStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCropsUploaded: 0,
    totalCropsDonated: 0,
    totalCropsSold: 0,
    totalNGOsConnected: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        // Fetch crops
        const crops = await getMyCrops().catch(() => []);
        const totalUploaded = crops.length;

        // Fetch received requests (from farmers perspective)
        const receivedRequests = await getReceivedRequests().catch(() => []);

        // Count donated crops (accepted requests from NGOs)
        const donated = receivedRequests.filter(
          (req) => req.status === "accepted"
        ).length;

        // Count connected NGOs (unique buyers from accepted requests)
        const connectedNGOs = new Set(
          receivedRequests
            .filter((req) => req.status === "accepted")
            .map((req) => req.buyerId)
        ).size;

        // Sold crops - crops with price and accepted requests (if selling is enabled)
        const sold = crops.filter(
          (crop) => crop.price && crop.price > 0
        ).length;

        // Calculate earnings (sum of prices of donated crops)
        // Note: This is a basic calculation - in production, track actual transactions
        const earnings = receivedRequests
          .filter((req) => req.status === "accepted")
          .reduce((total, req) => {
            const crop = crops.find((c) => c._id === req.cropId);
            return total + (crop?.price || 0);
          }, 0);

        setStats({
          totalCropsUploaded: totalUploaded,
          totalCropsDonated: donated,
          totalCropsSold: sold,
          totalNGOsConnected: connectedNGOs,
          earnings: earnings,
        });
      } catch (error) {
        console.error("Error loading statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "farmer") {
      loadStats();
    }
  }, [user]);

  const statCards = [
    {
      id: 1,
      label: "Crops Uploaded",
      value: stats.totalCropsUploaded,
      icon: <FiBox />,
      color: "#0d6efd",
      bgColor: "#0d6efd15",
    },
    {
      id: 2,
      label: "Crops Donated",
      value: stats.totalCropsDonated,
      icon: <FiCheckCircle />,
      color: "#10b981",
      bgColor: "#10b98115",
    },
    {
      id: 3,
      label: "NGOs Connected",
      value: stats.totalNGOsConnected,
      icon: <FiUsers />,
      color: "#8b5cf6",
      bgColor: "#8b5cf615",
    },
    {
      id: 4,
      label: "Earnings",
      value: `₹${stats.earnings.toLocaleString()}`,
      icon: <FiTrendingUp />,
      color: "#f59e0b",
      bgColor: "#f59e0b15",
      subtext: "from donations",
    },
  ];

  if (loading) {
    return (
      <div className="quick-stats-section">
        <div className="stats-loading">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="quick-stats-section">
      <div className="stats-header">
        <h3>Quick Statistics</h3>
        <span className="stats-subtitle">Your farming activity</span>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <div
            key={stat.id}
            className="stat-box"
          >
            <div className="stat-top">
              <div
                className="stat-icon"
                style={{ backgroundColor: stat.bgColor, color: stat.color }}
              >
                {stat.icon}
              </div>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-bottom">
              <div className="stat-value">{stat.value}</div>
              {stat.subtext && (
                <div className="stat-subtext">{stat.subtext}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
