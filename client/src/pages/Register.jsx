import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { registerUser } from '../services/api.js';
import { MdAgriculture } from 'react-icons/md';
import { FaBuilding } from 'react-icons/fa';

// --- Inline Styles for the New Design ---
const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' },
  header: { textAlign: 'center', marginBottom: '30px' },
  stepper: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' },
  stepCircle: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'white', backgroundColor: '#28a745', fontSize: '1.1rem' },
  stepLine: { width: '80px', height: '2px', backgroundColor: '#e0e0e0' },
  stepCircleInactive: { backgroundColor: '#cccccc' },
  subHeader: { textAlign: 'center', fontSize: '1.4rem', color: '#333', marginBottom: '30px' },
  roleCards: { display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '40px' },
  roleCard: { flex: 1, padding: '30px', border: '2px solid #e0e0e0', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: '#f9f9f9' },
  roleCardSelected: { borderColor: '#28a745', boxShadow: '0 0 15px rgba(40, 167, 69, 0.2)', backgroundColor: '#e8f5e9' },
  roleIcon: { fontSize: '3rem', color: '#28a745', marginBottom: '15px' },
  roleTitle: { fontWeight: 'bold', fontSize: '1.2rem', color: '#333', marginBottom: '5px' },
  roleDesc: { fontSize: '0.9rem', color: '#666' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' },
  input: { width: '100%', padding: '12px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', transition: 'background 0.3s' },
  buttonDisabled: { backgroundColor: '#cccccc', cursor: 'not-allowed' },
  error: { color: 'red', textAlign: 'center', marginBottom: '15px', fontSize: '0.95rem' },
  link: { marginTop: '20px', textAlign: 'center', color: '#555' },
  backButton: { background: 'none', border: '1px solid #cccccc', color: '#555', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', marginTop: '20px', transition: 'all 0.3s ease' },
};

const Register = () => {
  const [step, setStep] = useState(1); // 1: Choose Role, 2: Fill Details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '', // Will be 'farmer' or 'ngo'
    location: '',
    organizationName: '',
    ngoRegNumber: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    setStep(2); // Move to the next step
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = await registerUser(formData);
      login(userData, "cookie-token");
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create Your Account</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Join CropShare and start making a difference</p>

      {/* Stepper Indicator */}
      <div style={styles.stepper}>
        <div style={styles.stepCircle}>1</div>
        <div style={styles.stepLine}></div>
        <div style={{ ...styles.stepCircle, ...(step === 1 && styles.stepCircleInactive) }}>2</div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {step === 1 && (
        <>
          <h3 style={styles.subHeader}>Choose Your Role</h3>
          <div style={styles.roleCards}>
            <div
              style={{ ...styles.roleCard, ...(formData.role === 'farmer' && styles.roleCardSelected) }}
              onClick={() => handleRoleSelect('farmer')}
            >
              <MdAgriculture style={styles.roleIcon} role="img" aria-label="farmer" />
              <div style={styles.roleTitle}>I'm a Farmer</div>
              <div style={styles.roleDesc}>I have surplus crops to donate</div>
            </div>
            <div
              style={{ ...styles.roleCard, ...(formData.role === 'ngo' && styles.roleCardSelected) }}
              onClick={() => handleRoleSelect('ngo')}
            >
              <FaBuilding style={styles.roleIcon} role="img" aria-label="ngo" />
              <div style={styles.roleTitle}>I'm an NGO</div>
              <div style={styles.roleDesc}>I want to receive crop donations</div>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h3 style={styles.subHeader}>Your {formData.role === 'farmer' ? 'Farmer' : 'NGO'} Details</h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} minLength={6} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location (City)</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} style={styles.input} required />
          </div>

          {formData.role === 'ngo' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Organization Name</label>
                <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} style={styles.input} placeholder="e.g. Food For All Foundation" required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>NGO Reg. Number</label>
                <input type="text" name="ngoRegNumber" value={formData.ngoRegNumber} onChange={handleChange} style={styles.input} placeholder="e.g. NGO-882211" required />
              </div>
            </>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ ...styles.button, ...(loading && styles.buttonDisabled) }}
          >
            {loading ? 'Registering...' : 'Register Account'}
          </button>
          <button type="button" onClick={() => setStep(1)} style={styles.backButton}>
            ← Back to Role Selection
          </button>
        </form>
      )}

      <div style={styles.link}>
        <p>Already have an account? <Link to="/login" style={{ color: '#0d6efd', textDecoration: 'none' }}>Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;