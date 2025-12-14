import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "./Home.css";

// 1. Import your image
// (Assuming this component is in 'src/components/home' and the image is in 'src/assets')
import heroVisual from "../../assets/Gemini_Generated_Image_k8tmbpk8tmbpk8tm.png";

const HeroSection = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="hero-section">
      <div className="hero-left">
        <h1 className="hero-headline">
          Empowering Farmers. Supporting NGOs. Reducing Waste.
        </h1>
        <p className="hero-text">
          CropShare connects local farmers with verified NGOs to distribute
          surplus crops responsibly and efficiently.
        </p>
        <div className="hero-buttons">
          <Link
            to={
              isLoggedIn && user?.role === "farmer"
                ? "/dashboard/donate"
                : "/register"
            }
            className="hero-btn hero-btn-primary"
          >
            Get Started (Farmer)
          </Link>
          <Link to="/browse" className="hero-btn hero-btn-outline">
            Browse Donations (NGO)
          </Link>
        </div>
      </div>
      <div className="hero-right">
        {/* 2. Replace the placeholder div with an img tag */}
        <img
          src={heroVisual}
          alt="Farmer and NGO sharing crops"
          className="hero-image"
        />
      </div>
    </section>
  );
};

export default HeroSection;
