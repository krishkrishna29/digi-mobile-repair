import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

//  console.log('AdminRoute check:', { currentUser, userRole });

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return userRole === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;
