import React from "react";
import {
  FaMapMarkerAlt,
  FaSeedling,
  FaComments,
  FaChartLine,
  FaBell,
  FaUsers,
} from "react-icons/fa";
import "./Home.css";

const Feature = ({ icon, title, text }) => (
  <div className="feature-card">
    <div className="feature-icon-container">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-text">{text}</p>
  </div>
);

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <h2 className="section-heading">Why Choose CropShare?</h2>
      <p className="section-subheading">
        Our platform makes it simple for farmers and NGOs to connect and make a
        difference.
      </p>
      <div className="features-grid">
        <Feature
          icon={<FaSeedling className="feature-icon" />}
          title="Easy Listing"
          text="Farmers can quickly list surplus crops with photos, quantities, and pickup details."
        />
        <Feature
          icon={<FaMapMarkerAlt className="feature-icon" />}
          title="Location-Based Search"
          text="NGOs can find available crops nearby using our interactive map and filter system."
        />
        <Feature
          icon={<FaComments className="feature-icon" />}
          title="Direct Communication"
          text="Built-in messaging system enables seamless coordination between farmers and NGOs."
        />
        <Feature
          icon={<FaChartLine className="feature-icon" />}
          title="Impact Tracking"
          text="Monitor your contributions with detailed statistics and see the difference you make."
        />
        <Feature
          icon={<FaBell className="feature-icon" />}
          title="Real-Time Updates"
          text="Get instant notifications about new listings, requests, and donation confirmations."
        />
        <Feature
          icon={<FaUsers className="feature-icon" />}
          title="Verified Community"
          text="All users are verified to ensure trust and accountability in every transaction."
        />
      </div>
    </section>
  );
};

export default FeaturesSection;
