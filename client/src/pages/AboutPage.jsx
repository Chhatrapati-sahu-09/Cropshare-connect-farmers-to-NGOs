import React from 'react';
import { Link } from 'react-router-dom';

// Simple styles for the About page
const styles = {
  container: {
    maxWidth: '900px',
    margin: '20px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '15px',
  },
  tagline: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '40px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#198754', // Green
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '10px',
    marginBottom: '15px',
  },
  text: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: '#343a40',
  },
  row: {
    display: 'flex',
    gap: '30px',
    marginTop: '20px',
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#0d6efd', // Blue
  },
  button: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 25px',
    backgroundColor: '#0d6efd',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  }
};

const AboutPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🌾 About CropShare</h1>
      <p style={styles.tagline}>Connecting Surplus with Need. Reducing food waste, one donation at a time.</p>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Mission</h2>
        <p style={styles.text}>
          Every year, tons of surplus crops go to waste on farms while communities nearby struggle with food insecurity.
          CropShare was built to solve this problem. We are a non-profit digital platform that connects generous farmers
          directly with registered NGOs and food banks.
        </p>
        <p style={styles.text}>
          Our goal is simple: **Get surplus food to the people who need it most, fast.**
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.row}>
          <div style={styles.column}>
            <h3 style={styles.columnTitle}>For Farmers (Donors) 👨‍🌾</h3>
            <p style={styles.text}>
              Have surplus crops? Don't let them go to waste.
              <br />
              1. **Post a Crop:** Quickly list what you have available (it's free).
              <br />
              2. **Find an NGO:** Browse our directory of verified NGOs in your area.
              <br />
              3. **Connect:** Offer your donation directly via secure chat to arrange pickup.
            </p>
          </div>
          <div style={styles.column}>
            <h3 style={styles.columnTitle}>For NGOs (Receivers) 🏢</h3>
            <p style={styles.text}>
              Need a steady supply of fresh produce?
              <br />
              1. **Get Verified:** Register your organization to build trust.
              <br />
              2. **Browse Listings:** Search our map and listings for crops near you.
              <br />
              3. **Request & Chat:** Send a request to a farmer and coordinate logistics in real-time.
            </p>
          </div>
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Join Us</h2>
        <p style={styles.text}>
          Whether you are a farmer with food to share or an NGO working to feed your community, you can make a real difference.
        </p>
        <Link to="/register" style={styles.button}>
          Get Started Now
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;