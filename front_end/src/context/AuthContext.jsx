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
    if (process.env.NODE_ENV !== 'production') {
      console.log('AuthContext - Attempting login with credentials:', credentials);
    }
    try {
      const response = await authService.login(credentials);
      if (process.env.NODE_ENV !== 'production') {
        console.log('AuthContext - Login response:', response);
      }
      if (response && response.authenticated) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
      return null;
    } catch (error) {
      console.error('AuthContext - Login error:', error.message || 'Unknown error');
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

  const logout = async () => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('AuthContext - Attempting logout...');
      }
      await authService.logout();
      if (process.env.NODE_ENV !== 'production') {
        console.log('AuthContext - Logout successful, clearing user state');
      }
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/auth';
    } catch (error) {
      console.error('AuthContext - Logout error:', error.message || 'Unknown error');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/auth';
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