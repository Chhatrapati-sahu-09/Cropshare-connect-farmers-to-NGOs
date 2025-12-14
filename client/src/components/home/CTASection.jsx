import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const CTASection = () => {
  return (
    <section className="cta-section">
      <h2 className="cta-title">Ready to Make a Difference?</h2>
      <p className="section-subheading" style={{ color: "#555" }}>
        Join thousands of farmers and NGOs already using CropShare to reduce
        food waste and fight hunger in their communities.
      </p>
      <div className="cta-buttons">
        <Link to="/register" className="cta-btn-primary">
          Sign Up Now
        </Link>
        <Link to="/login" className="cta-btn-outline">
          Sign In
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
