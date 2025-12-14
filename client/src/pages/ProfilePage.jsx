import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { getUserProfile, updateUserProfile } from "../services/api.js";
import {
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    farmAddress: "",
    about: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        setFormData({
          name: data.name || "",
          location: data.location || "",
          phone: data.phone || "",
          farmAddress: data.farmAddress || "",
          about: data.about || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await updateUserProfile(formData);
      setProfile(updatedUser);
      login(updatedUser, "cookie-token");
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      location: profile?.location || "",
      phone: profile?.phone || "",
      farmAddress: profile?.farmAddress || "",
      about: profile?.about || "",
    });
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const userInitials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="profile-container">
      {/* Success/Error Messages */}
      {error && <div className="profile-alert error">{error}</div>}
      {success && <div className="profile-alert success">{success}</div>}

      {/* ===== SECTION 1: READ-ONLY PROFILE INFO ===== */}
      <section className="profile-info-section">
        <div className="profile-header-card">
          {/* Avatar */}
          <div className="profile-avatar-large">{userInitials}</div>

          {/* Main Info */}
          <div className="profile-main-info">
            <h1 className="profile-name">{profile?.name}</h1>
            <div className="profile-badge">
              <FaUser /> {user?.role === "farmer" ? "Farmer" : "NGO"}
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="profile-edit-btn"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Info Grid */}
        <div className="profile-info-grid">
          {/* Location */}
          <div className="profile-info-item">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="info-content">
              <span className="info-label">Village/City</span>
              <span className="info-value">
                {profile?.location || "Not specified"}
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="profile-info-item">
            <div className="info-icon">
              <FaPhone />
            </div>
            <div className="info-content">
              <span className="info-label">Phone</span>
              <span className="info-value">
                {profile?.phone || "Not specified"}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="profile-info-item">
            <div className="info-icon verified">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <span className="info-label">Email (Verified)</span>
              <span className="info-value">{profile?.email}</span>
            </div>
          </div>

          {/* Farm Address */}
          <div className="profile-info-item">
            <div className="info-icon">
              <FaMapPin />
            </div>
            <div className="info-content">
              <span className="info-label">Farm Address</span>
              <span className="info-value">
                {profile?.farmAddress || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        {profile?.about && (
          <div className="profile-about-section">
            <h3>About</h3>
            <p>{profile.about}</p>
          </div>
        )}
      </section>

      {/* ===== SECTION 2: EDIT FORM ===== */}
      {isEditing && (
        <section className="profile-edit-section">
          <h2>Edit Your Profile</h2>
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            {/* Location Field */}
            <div className="form-group">
              <label htmlFor="location">Village/City</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Nagpur, Maharashtra"
              />
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>

            {/* Farm Address Field */}
            <div className="form-group">
              <label htmlFor="farmAddress">Farm Address</label>
              <input
                type="text"
                id="farmAddress"
                name="farmAddress"
                value={formData.farmAddress}
                onChange={handleChange}
                placeholder="Your complete farm address"
              />
            </div>

            {/* About Field */}
            <div className="form-group">
              <label htmlFor="about">About You</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell us about your farm..."
                rows="4"
              />
            </div>

            {/* Buttons */}
            <div className="form-buttons">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default ProfilePage;
