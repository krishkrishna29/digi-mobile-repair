
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const DeliveryRoute = ({ children }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile.role !== 'delivery') {
    // Redirect to their respective dashboards if they land here by mistake
    if (userProfile.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default DeliveryRoute;
