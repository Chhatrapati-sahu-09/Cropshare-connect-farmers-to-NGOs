import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCrop, uploadImage } from "../services/api.js";
// --- Map Imports ---
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix for default marker icon missing
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "./Form.css";

// Fix Leaflet Icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Helper Component to Handle Map Clicks ---
const LocationMarker = ({ setLocation, position }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={customIcon} />
  ) : null;
};

const CropForm = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    quantity: "",
    category: "Grains",
    description: "",
    image: "",
  });

  // Location State (Default: Center of India/Nagpur for view)
  const [location, setLocation] = useState({ lat: 21.1458, lng: 79.0882 });
  const [isLocationSelected, setIsLocationSelected] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle Map Click Update
  const handleMapClick = (latLng) => {
    setLocation(latLng);
    setIsLocationSelected(true);
  };

  // Get Current GPS Location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLoc);
          setIsLocationSelected(true);
        },
        () => alert("Could not get your location.")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLocationSelected) {
      setError("Please click on the map to select your farm location.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      // --- FORMAT DATA FOR BACKEND ---
      // MongoDB requires GeoJSON: { type: "Point", coordinates: [lng, lat] }
      const payload = {
        ...formData,
        image: imageUrl,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat], // Note: [Lng, Lat] order!
          address: "Custom Map Location",
        },
      };

      await addCrop(payload);

      setLoading(false);
      setSuccess("Crop added successfully! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard/my-listings");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setUploading(false);
      setError(err.message || "Failed to add crop.");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Add a New Crop Listing</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-group">
        <label htmlFor="title">Crop Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          type="text"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Grains">Grains</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Seeds">Seeds</option>
          <option value="Equipment">Equipment</option>
        </select>
      </div>

      {/* --- MAP SECTION --- */}
      <div className="form-group">
        <label>Farm Location (Click on map or use GPS)</label>
        <div style={{ marginBottom: "10px" }}>
          <button
            type="button"
            onClick={handleGetLocation}
            style={{ padding: "5px 10px", cursor: "pointer" }}
          >
            📍 Use My Current Location
          </button>
          <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
            Selected:{" "}
            {isLocationSelected
              ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
              : "None"}
          </span>
        </div>

        <div
          style={{
            height: "300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {/* Helper component to handle clicks */}
            <LocationMarker setLocation={handleMapClick} position={location} />
          </MapContainer>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image">Crop Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {uploading && (
          <small style={{ color: "blue" }}>Uploading image...</small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        ></textarea>
      </div>

      <button
        type="submit"
        className="form-button"
        disabled={loading || uploading}
      >
        {uploading
          ? "Uploading Image..."
          : loading
          ? "Submitting..."
          : "Submit Listing"}
      </button>
    </form>
  );
};

export default CropForm;
