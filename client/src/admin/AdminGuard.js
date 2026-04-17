import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminGuard = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default AdminGuard;
