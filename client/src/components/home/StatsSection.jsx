import React from "react";
import "./Home.css";

const StatsSection = () => {
  return (
    <section className="stats-section">
      <div className="stat-card">
        <div className="stat-number">2,500+</div>
        <div className="stat-label">Tons of Crops Shared</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">850+</div>
        <div className="stat-label">Active Farmers</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">120+</div>
        <div className="stat-label">Partner NGOs</div>
      </div>
    </section>
  );
};

export default StatsSection;
