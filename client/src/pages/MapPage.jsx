import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { getCropsNearby } from "../services/api.js";
import { Link } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import CropCard from "../components/CropCard.jsx"; // We will re-use your CropCard!
import "./MapPage.css"; // We will create this new CSS file

// Blue Icon for "You are here" (User's Location)
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Red Icon for Farmers' Crops
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [crops, setCrops] = useState([]);
  const [distance, setDistance] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user's geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Unable to get your location. Using default.");
        setUserLocation({ lat: 21.1458, lng: 79.0882 }); // Fallback to Nagpur
      }
    );
  }, []);

  // Fetch nearby crops function
  const fetchNearby = useCallback(async () => {
    if (!userLocation) return;
    setLoading(true);
    try {
      const data = await getCropsNearby(
        userLocation.lat,
        userLocation.lng,
        distance
      );
      setCrops(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching nearby crops:", err);
      setError("Failed to load nearby crops");
    } finally {
      setLoading(false);
    }
  }, [userLocation, distance]);

  // Fetch nearby crops when user location or distance changes
  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  if (!userLocation) {
    return (
      <div className="map-page-loading">
        <Loader />
        <p>Getting your location...</p>
      </div>
    );
  }

  return (
    <div className="map-page-layout">
      {/* --- Left Column (Controls & Results) --- */}
      <div className="map-sidebar">
        <div className="controls-header">
          <h1>Find Crops Near You</h1>
          <div className="distance-controls">
            <label htmlFor="distance-slider">
              Search Radius: <strong>{distance} km</strong>
            </label>
            <input
              id="distance-slider"
              type="range"
              min="5"
              max="500"
              step="5"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="slider-pro"
            />
          </div>
          <div className="crop-count-pro">
            {loading ? "Searching..." : `Found ${crops.length} crops`}
          </div>
        </div>

        {/* --- Results List --- */}
        <div className="results-list">
          {error && <div className="error-message">{error}</div>}
          {!loading && crops.length === 0 && !error && (
            <p className="no-results">
              No crops found within {distance}km. Try increasing the radius.
            </p>
          )}
          {crops.map((crop) => (
            <div className="map-list-card" key={crop._id}>
              {/* We re-use the beautiful CropCard you already built! */}
              <CropCard crop={crop} />
            </div>
          ))}
        </div>
      </div>

      {/* --- Right Column (Map) --- */}
      <div className="map-main">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={10}
          scrollWheelZoom={true} // Allow scroll wheel zoom
          className="leaflet-map-pro"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Marker - Blue */}
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="popup-content">
                <strong>📍 You are here</strong>
              </div>
            </Popup>
          </Marker>

          {/* Search Radius Circle */}
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={distance * 1000} // meters
            pathOptions={{
              color: "#0d6efd",
              fillColor: "#0d6efd",
              fillOpacity: 0.1,
              weight: 2,
              dashArray: "5, 10",
            }}
          />

          {/* Crop Markers - Red */}
          {crops.map((crop) => (
            <Marker
              key={crop._id}
              position={[
                crop.location.coordinates[1], // Latitude
                crop.location.coordinates[0], // Longitude
              ]}
              icon={redIcon}
            >
              <Popup>
                <div className="popup-content">
                  <img
                    src={
                      crop.image ||
                      "https://placehold.co/100x50/e8f5e9/777?text=Crop"
                    }
                    alt={crop.title}
                    className="popup-image"
                  />
                  <strong>{crop.title}</strong>
                  <p>
                    Price: ₹{crop.price} | Qty: {crop.quantity}
                  </p>
                  <Link to={`/crop/${crop._id}`} className="btn-view-details">
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
