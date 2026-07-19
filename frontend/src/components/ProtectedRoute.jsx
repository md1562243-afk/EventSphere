import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, role: currentRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={`/login/${role.toLowerCase()}`} replace />;
  }
  if (currentRole !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
