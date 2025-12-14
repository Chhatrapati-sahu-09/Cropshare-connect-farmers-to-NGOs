import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { getUserProfile, updateUserProfile } from "../services/api.js";

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  formGroup: { marginBottom: "15px" },
  label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
  input: { width: "100%", padding: "8px", boxSizing: "border-box" },
  textarea: {
    width: "100%",
    padding: "8px",
    height: "100px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0d6efd",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  success: { color: "green", marginBottom: "15px" },
};

const NGOProfilePage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    organizationName: "",
    missionStatement: "",
    capacity: "",
    requiredCrops: "", // Managed as comma-separated string
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      setFormData({
        organizationName: data.organizationName || "",
        missionStatement: data.missionStatement || "",
        capacity: data.capacity || "",
        // Convert Array ["Rice", "Wheat"] -> String "Rice, Wheat"
        requiredCrops: data.requiredCrops ? data.requiredCrops.join(", ") : "",
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert String "Rice, Wheat" -> Array ["Rice", "Wheat"]
      const cropsArray = formData.requiredCrops.split(",").map((s) => s.trim());

      const updatedUser = await updateUserProfile({
        ...formData,
        requiredCrops: cropsArray,
      });

      login(updatedUser, "cookie-token");
      setSuccess("Organization details updated!");
    } catch {
      alert("Failed to update");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>🏢 Organization Profile</h2>
      <p>Tell farmers about your NGO and what you need.</p>
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Organization Name</label>
          <input
            style={styles.input}
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mission Statement</label>
          <textarea
            style={styles.textarea}
            name="missionStatement"
            value={formData.missionStatement}
            onChange={handleChange}
            placeholder="We feed 500 children daily..."
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Storage/Pickup Capacity</label>
          <input
            style={styles.input}
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="e.g. Can pickup 500kg via truck"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Current Needs (Comma separated)</label>
          <input
            style={styles.input}
            name="requiredCrops"
            value={formData.requiredCrops}
            onChange={handleChange}
            placeholder="Rice, Wheat, Tomatoes"
          />
        </div>

        <button style={styles.button} type="submit">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default NGOProfilePage;
