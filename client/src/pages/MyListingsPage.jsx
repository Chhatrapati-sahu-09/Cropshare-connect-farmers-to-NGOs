import React, { useState, useEffect } from "react";
// 1. Import deleteCrop
import { getMyCrops, deleteCrop } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import "./MyListingsPage.css";

const MyListingsPage = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const data = await getMyCrops();
        setCrops(data);
      } catch (err) {
        setError(err.message || "Failed to fetch crops.");
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  // 2. Add the new handleDelete function
  const handleDelete = async (cropId) => {
    // Ask for confirmation
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await deleteCrop(cropId);
        // 3. Update the UI by removing the deleted crop from the state
        setCrops(crops.filter((crop) => crop._id !== cropId));
      } catch (err) {
        setError(err.message || "Failed to delete crop.");
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-alert">{error}</div>;

  return (
    <div className="my-listings-container">
      <h2>My Crop Listings</h2>
      {crops.length === 0 ? (
        <p>You have not added any crops yet.</p>
      ) : (
        <table className="listings-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr key={crop._id}>
                <td>{crop.title}</td>
                <td>₹{crop.price}</td>
                <td>{crop.quantity}</td>
                <td>
                  <span className={`status status-${crop.status}`}>
                    {crop.status}
                  </span>
                </td>
                <td>
                  {/* 4. Add the onClick handler to the button */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(crop._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyListingsPage;
