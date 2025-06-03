import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = localStorage.getItem('token');
        if (currentUser && token) {
          console.log('AuthContext - Initializing with user:', currentUser);
          setUser(currentUser);
        } else {
          console.log('AuthContext - No user found during initialization');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext - Error initializing auth:', error);
        setUser(null);
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
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext - Attempting login with credentials:', credentials);
      const response = await authService.login(credentials);
      console.log('AuthContext - Login response:', response);
      
      if (response && response.authenticated) {
        console.log('AuthContext - Setting user data:', response.user);
        setUser(response.user);
        return response;
      }
      return null;
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      setUser(null);
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
      window.location.href = '/auth';
    } catch (error) {
      console.error('AuthContext - Logout error:', error);
      setUser(null);
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
    isAuthenticated: !!user
  };

  console.log('AuthContext - Current state:', { user, isAuthenticated: !!user });

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