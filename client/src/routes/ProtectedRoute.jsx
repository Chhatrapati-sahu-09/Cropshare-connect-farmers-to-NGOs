import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // 1. ✅ Import from the new hooks file

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth(); // 2. This part remains the same

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;