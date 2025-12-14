import React from "react";
import "./Home.css";

const HowItWorksSection = () => {
  return (
    <section className="how-it-works-section">
      <h2 className="section-heading">How It Works</h2>
      <p className="section-subheading">
        Getting started is simple. Follow these steps to make an impact.
      </p>
      <div className="how-it-works-container">
        <div className="how-it-works-column">
          <h3 className="how-it-works-column-title">For Farmers</h3>
          <p className="how-it-works-sub">
            Share your surplus crops with those in need.
          </p>
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong className="step-title">Create an Account</strong>
              <span className="step-desc">
                Sign up as a farmer with your farm details.
              </span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong className="step-title">List Your Crops</strong>
              <span className="step-desc">
                Add photos, quantities, and pickup information.
              </span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong className="step-title">Connect with NGOs</strong>
              <span className="step-desc">
                Receive requests and coordinate pickup.
              </span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong className="step-title">Track Your Impact</strong>
              <span className="step-desc">
                See statistics on crops donated and communities helped.
              </span>
            </div>
          </div>
        </div>
        <div className="how-it-works-column">
          <h3 className="how-it-works-column-title">For NGOs</h3>
          <p className="how-it-works-sub">
            Access fresh food for your community programs.
          </p>
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong className="step-title">Register Your NGO</strong>
              <span className="step-desc">
                Provide verification and organization details.
              </span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong className="step-title">Browse Available Crops</strong>
              <span className="step-desc">
                Use filters and map to find crops near you.
              </span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong className="step-title">Request Donations</strong>
              <span className="step-desc">
                Contact farmers directly through our messaging system.
              </span>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong className="step-title">Arrange Pickup</strong>
              <span className="step-desc">
                Coordinate logistics and collect the crops.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
