import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        console.log('AuthContext - Initializing authentication...');
        
        // Kiểm tra token và user trong localStorage
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const currentUser = JSON.parse(userStr);
            console.log('AuthContext - Valid authentication found');
            console.log('AuthContext - User:', currentUser?.username);
            
            setUser(currentUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('AuthContext - Error parsing user data:', error);
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('AuthContext - No valid authentication found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('AuthContext - Error initializing auth:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const currentUser = JSON.parse(userStr);
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('AuthContext - Error parsing user data:', error);
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials) => {
    console.log('AuthContext - Attempting login with credentials:', credentials);
    
    try {
      const response = await authService.login(credentials);
      console.log('AuthContext - Login response:', response);
      
      if (response && response.authenticated) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
      
      // Nếu không có lỗi nhưng không xác thực thành công
      console.warn('AuthContext - Login failed but no error thrown');
      return null;
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      
      // Kiểm tra nếu lỗi là tài khoản chưa kích hoạt
      if (error.code === 'ACCOUNT_NOT_ACTIVATED') {
        console.warn('AuthContext - Account not activated:', error.email);
      } else {
        console.error('AuthContext - Login error details:', {
          message: error.message,
          userMessage: error.userMessage,
          response: error.response?.data
        });
      }
      
      // Ném lỗi để component xử lý
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response && response.authenticated) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async (redirectToAuth = true) => {
    try {
      console.log('AuthContext - Attempting logout...');
      await authService.logout();
      console.log('AuthContext - Logout successful, clearing user state');
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Chỉ chuyển hướng nếu được yêu cầu
      if (redirectToAuth) {
        console.log('AuthContext - Redirecting to auth page');
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('AuthContext - Logout error:', error.message || 'Unknown error');
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Chỉ chuyển hướng nếu được yêu cầu
      if (redirectToAuth) {
        console.log('AuthContext - Redirecting to auth page after error');
        window.location.href = '/auth';
      }
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log('AuthContext - Current state:', { user, isAuthenticated });
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};