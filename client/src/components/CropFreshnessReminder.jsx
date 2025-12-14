import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { getMyCrops } from "../services/api.js";
import "./CropFreshnessReminder.css";
import { FiAlertTriangle, FiClock, FiTrendingDown } from "react-icons/fi";

const CropFreshnessReminder = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Perishable crops that need freshness monitoring
  const perishableCrops = [
    "Tomatoes",
    "Potatoes",
    "Onions",
    "Lettuce",
    "Spinach",
    "Carrots",
    "Cucumber",
    "Cabbage",
    "Broccoli",
    "Bell Pepper",
    "Fruits",
    "Vegetables",
  ];

  const calculateDaysOld = (createdAt) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getReminders = (daysOld, cropName, category) => {
    const reminders = [];

    // Check if crop is perishable
    const isPerishable = perishableCrops.some(
      (p) =>
        cropName.toLowerCase().includes(p.toLowerCase()) ||
        category.toLowerCase().includes(p.toLowerCase())
    );

    if (!isPerishable) return reminders;

    // Freshness reminders based on days old
    if (daysOld === 2) {
      reminders.push({
        type: "freshness",
        severity: "low",
        message: `Your crop '${cropName}' was added ${daysOld} days ago — update freshness or quantity`,
        icon: <FiClock />,
      });
    }

    if (daysOld >= 6) {
      reminders.push({
        type: "age",
        severity: "medium",
        message: `Your stored ${cropName.toLowerCase()} is ${daysOld} days old — consider notifying NGOs`,
        icon: <FiTrendingDown />,
      });
    }

    if (daysOld >= 10) {
      reminders.push({
        type: "critical",
        severity: "high",
        message: `⚠️ URGENT: Your ${cropName.toLowerCase()} is ${daysOld} days old — take action immediately`,
        icon: <FiAlertTriangle />,
      });
    }

    return reminders;
  };

  useEffect(() => {
    const loadReminders = async () => {
      try {
        setLoading(true);
        const crops = await getMyCrops().catch(() => []);

        const allReminders = [];

        crops.forEach((crop) => {
          const daysOld = calculateDaysOld(crop.createdAt);
          const cropReminders = getReminders(
            daysOld,
            crop.title,
            crop.category
          );

          cropReminders.forEach((reminder) => {
            allReminders.push({
              id: `${crop._id}-${reminder.type}`,
              ...reminder,
              daysOld,
            });
          });
        });

        // Sort by severity (high first)
        const severityOrder = { high: 0, medium: 1, low: 2 };
        allReminders.sort(
          (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
        );

        setReminders(allReminders);
      } catch (error) {
        console.error("Error loading freshness reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "farmer") {
      loadReminders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="freshness-section">
        <div className="freshness-header">
          <h3>Crop Freshness Reminder</h3>
        </div>
        <div className="freshness-loading">Loading reminders...</div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="freshness-section">
        <div className="freshness-header">
          <h3>Crop Freshness Reminder</h3>
        </div>
        <div className="freshness-empty">
          <p>All crops are fresh!</p>
          <span>Your crops are within safe storage time</span>
        </div>
      </div>
    );
  }

  return (
    <div className="freshness-section">
      <div className="freshness-header">
        <h3>Crop Freshness Reminder</h3>
        <span className="reminder-count">{reminders.length} reminders</span>
      </div>

      <div className="reminders-list">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`reminder-item reminder-${reminder.severity}`}
          >
            <div className="reminder-icon">{reminder.icon}</div>

            <div className="reminder-content">
              <p className="reminder-message">{reminder.message}</p>
            </div>

            <div className="reminder-action">
              <span className={`action-badge action-${reminder.severity}`}>
                {reminder.daysOld} days old
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="freshness-tips">
        <h4>💡 Quick Tips</h4>
        <ul>
          <li>Store vegetables in cool, dark places</li>
          <li>Keep crops away from direct sunlight</li>
          <li>Update quantity when crops are consumed</li>
          <li>Notify NGOs before crops expire</li>
        </ul>
      </div>
    </div>
  );
};

export default CropFreshnessReminder;
