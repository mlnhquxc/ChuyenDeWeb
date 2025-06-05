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
        const currentUser = authService.getCurrentUser();
        const token = localStorage.getItem('token');
        if (currentUser && token) {
          console.log('AuthContext - Initializing with user:', currentUser);
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          console.log('AuthContext - No user found during initialization');
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
      const currentUser = authService.getCurrentUser();
      const token = localStorage.getItem('token');
      if (currentUser && token) {
        setUser(currentUser);
        setIsAuthenticated(true);
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
      return null;
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response && response.authenticated) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext - Attempting logout...');
      await authService.logout();
      console.log('AuthContext - Logout successful, clearing user state');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/auth';
    } catch (error) {
      console.error('AuthContext - Logout error:', error);
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

  console.log('AuthContext - Current state:', { user, isAuthenticated });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};