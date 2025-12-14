import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaMapPin, FaCalendarAlt } from "react-icons/fa";
import "./CropCard.css";

const CropCard = ({ crop }) => {
  const farmerName = crop.farmerId?.name || "Anonymous Farmer";
  const farmerInitials =
    farmerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "??";
  const cropDescription = crop.description || "No description provided.";
  const location = crop.location?.address || "Location not set";

  const getPostedDate = (dateString) => {
    if (!dateString) return "recently";
    const date = new Date(dateString);
    const diffTime = Math.abs(new Date() - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="card-pro">
      {/* Image Section */}
      <div className="card-image-wrapper-pro">
        <img
          src={
            crop.image ||
            "https://placehold.co/400x300/e8f5e9/777?text=No+Image"
          }
          alt={crop.title}
          className="card-image-pro"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/400x300/e8f5e9/777?text=No+Image";
          }}
        />
        <button className="card-heart-pro" aria-label="Save to favorites">
          <FaHeart />
        </button>
        <span className="card-tag-pro">{crop.category}</span>
      </div>

      {/* Content Section */}
      <div className="card-body-pro">
        <div className="card-header-pro">
          <h3 className="card-title-pro">{crop.title}</h3>
          <div className="card-farmer-pro">
            <div className="card-avatar-pro">{farmerInitials}</div>
            <span>{farmerName}</span>
          </div>
        </div>

        <p className="card-description-pro">
          {cropDescription.substring(0, 100)}
          {cropDescription.length > 100 ? "..." : ""}
        </p>

        {/* Info Grid */}
        <div className="card-info-pro">
          <div className="card-info-line">
            <span className="card-info-label">Quantity:</span>
            <span className="info-value-pro">{crop.quantity}</span>
          </div>
          <div className="card-info-line">
            <span className="card-info-label">Price:</span>
            <span className="info-value-pro">₹{crop.price}</span>
          </div>
          <div className="card-info-line">
            <span className="card-info-label">Location:</span>
            <span className="info-value-pro">{location}</span>
          </div>
          <div className="card-info-distance">
            <FaMapPin /> {crop.distance || "Not available"}
          </div>
        </div>

        <div className="card-posted-pro">
          <FaCalendarAlt />
          <span>Posted {getPostedDate(crop.createdAt)}</span>
        </div>

        <div className="card-buttons-pro">
          <Link to={`/crop/${crop._id}`} className="card-btn-pro primary">
            Request
          </Link>
          <Link to={`/crop/${crop._id}`} className="card-btn-pro outline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CropCard;
