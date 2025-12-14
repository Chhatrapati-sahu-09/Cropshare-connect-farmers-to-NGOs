import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllNGOs } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import { FaMapPin, FaFire, FaArrowRight } from "react-icons/fa";
import "./DonatePage.css";

const DonatePage = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const data = await getAllNGOs();
        setNgos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  if (loading) return <Loader />;

  const getNGOInitials = (ngo) => {
    const name = ngo.organizationName || ngo.name || "NGO";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="donate-container">
      {/* Header Section */}
      <section className="donate-header">
        <div className="header-icon">👐</div>
        <h1>Donate to NGOs</h1>
        <p className="header-description">
          Find organizations near you and offer your crops directly to make a
          real impact
        </p>
      </section>

      {/* NGOs Grid */}
      <section className="donate-grid-section">
        {ngos.length === 0 ? (
          <div className="empty-donate-state">
            <div className="empty-icon">🏢</div>
            <h3>No NGOs Found</h3>
            <p>Check back soon for participating organizations</p>
          </div>
        ) : (
          <div className="ngo-grid">
            {ngos.map((ngo) => {
              const initials = getNGOInitials(ngo);
              return (
                <div key={ngo._id} className="ngo-card">
                  {/* Header with Avatar */}
                  <div className="ngo-card-header">
                    <div className="ngo-avatar">{initials}</div>
                    <div className="ngo-title-section">
                      <h3 className="ngo-name">
                        {ngo.organizationName || ngo.name}
                      </h3>
                      <div className="ngo-location">
                        <FaMapPin />
                        <span>{ngo.location || "Location N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Needs Section */}
                  <div className="ngo-needs-section">
                    <div className="needs-label">
                      <span>Needs:</span>
                    </div>
                    <div className="ngo-crops-tags">
                      {ngo.requiredCrops && ngo.requiredCrops.length > 0 ? (
                        ngo.requiredCrops.map((crop, idx) => (
                          <span key={idx} className="crop-tag">
                            {crop}
                          </span>
                        ))
                      ) : (
                        <span className="crops-welcome">
                          Any donations welcome
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Call-to-Action Button */}
                  <Link
                    to={`/dashboard/chat/${ngo._id}`}
                    className="donate-button"
                  >
                    <span>Offer Donation</span>
                    <FaArrowRight />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default DonatePage;
