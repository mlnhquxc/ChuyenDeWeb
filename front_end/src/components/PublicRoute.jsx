import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Hiển thị loading trong khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Nếu user đã đăng nhập, redirect về home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập, hiển thị component (trang login/register)
  return children;
};

export default PublicRoute;