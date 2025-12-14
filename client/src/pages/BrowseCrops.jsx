import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllCrops } from "../services/api.js";
import CropCard from "../components/CropCard.jsx";
import Loader from "../components/Loader.jsx";
import { FaSearch, FaMapPin, FaFilter } from "react-icons/fa";
import "./BrowseCrops.css";

const BrowseCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "all",
    location: "all",
  });

  useEffect(() => {
    const fetchAllCrops = async () => {
      try {
        setLoading(true);
        const data = await getAllCrops(filters);
        setCrops(data);
      } catch (err) {
        setError(err.message || "Failed to fetch crops.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAllCrops();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Browse Available Crops</h1>
          <p className="page-subtitle">
            Find fresh surplus crops from farmers near you
          </p>
        </div>

        {/* Filters */}
        <div className="filters-grid">
          <div className="filter-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              name="searchTerm"
              placeholder="Search crops, farmers, or locations..."
              className="search-input"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>
          <select
            name="category"
            className="filter-select"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="all">All Categories</option>
            <option value="Grains">Grains</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Seeds">Seeds</option>
          </select>
          <select
            name="location"
            className="filter-select"
            value={filters.location}
            onChange={handleFilterChange}
          >
            <option value="all">All Locations</option>
            <option value="Punjab, India">Punjab</option>
            <option value="Haryana, India">Haryana</option>
            <option value="Delhi, India">Delhi</option>
          </select>
        </div>

        {/* Sub-filters and Count */}
        <div className="sub-filter-bar">
          <button className="sub-filter-btn">
            <FaFilter className="sub-filter-icon" />
            More Filters
          </button>
          <Link to="/map" className="sub-filter-btn">
            <FaMapPin className="sub-filter-icon" />
            Map View
          </Link>
          <div className="crop-count">
            {loading ? "Loading..." : `${crops.length} crops available`}
          </div>
        </div>

        {/* Crops Grid */}
        <div className="browse-content">
          {loading && <Loader />}
          {error && <div className="error-alert">{error}</div>}
          {!loading && !error && (
            <div className="crops-grid-final">
              {crops.length === 0 ? (
                <p className="no-crops-final">No crops match your filters.</p>
              ) : (
                crops.map((crop) => <CropCard key={crop._id} crop={crop} />)
              )}
            </div>
          )}
        </div>

        {/* Load More Button */}
        <div className="load-more-container">
          <button className="load-more-btn">Load More Crops</button>
        </div>
      </div>
    </div>
  );
};

export default BrowseCrops;
