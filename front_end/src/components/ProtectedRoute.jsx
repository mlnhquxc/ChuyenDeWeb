import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading nếu đang kiểm tra trạng thái xác thực
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Nếu không xác thực, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    console.log('ProtectedRoute - User not authenticated, redirecting to login');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Nếu đã xác thực, hiển thị nội dung
  return children;
};

export default ProtectedRoute;