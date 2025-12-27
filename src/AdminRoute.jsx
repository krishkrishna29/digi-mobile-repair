import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!userProfile) {
    return <Navigate to="/login" />;
  }

  return userProfile.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;
