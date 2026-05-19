import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isTeacher } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'teacher' && !isTeacher) {
    return <Navigate to="/evaluaciones" replace />;
  }

  if (requiredRole === 'teacher' && !isTeacher) {
    return <Navigate to="/juegos" replace />;
  }

  return children;
};

export default ProtectedRoute;
