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
        
        console.log('AuthContext - Token from localStorage:', token ? 'Token exists' : 'No token');
        console.log('AuthContext - User from localStorage:', userStr ? 'User exists' : 'No user');
        
        if (token && userStr) {
          try {
            // Kiểm tra token có hợp lệ không
            const isTokenValid = authService.isTokenValid(token);
            console.log('AuthContext - Is token valid:', isTokenValid);
            
            if (!isTokenValid) {
              console.log('AuthContext - Token is invalid or expired, logging out');
              authService.logout(false);
              setUser(null);
              setIsAuthenticated(false);
              setLoading(false);
              return;
            }
            
            const currentUser = JSON.parse(userStr);
            console.log('AuthContext - Valid authentication found');
            console.log('AuthContext - User:', currentUser?.username);
            
            setUser(currentUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('AuthContext - Error parsing user data:', error);
            authService.logout(false);
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
      console.log('AuthContext - Storage change detected');
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          // Kiểm tra token có hợp lệ không
          const isTokenValid = authService.isTokenValid(token);
          console.log('AuthContext - Is token valid on storage change:', isTokenValid);
          
          if (!isTokenValid) {
            console.log('AuthContext - Token is invalid or expired on storage change');
            authService.logout(false);
            setUser(null);
            setIsAuthenticated(false);
            return;
          }
          
          const currentUser = JSON.parse(userStr);
          console.log('AuthContext - User from storage change:', currentUser?.username);
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('AuthContext - Error parsing user data on storage change:', error);
          authService.logout(false);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('AuthContext - No valid auth data on storage change');
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    // Lắng nghe sự kiện storage change
    window.addEventListener('storage', handleStorageChange);
    
    // Lắng nghe sự kiện auth-state-changed
    const handleAuthStateChanged = () => {
      console.log('AuthContext - Auth state changed event received');
      handleStorageChange();
    };
    window.addEventListener('auth-state-changed', handleAuthStateChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-state-changed', handleAuthStateChanged);
    };
  }, []);

  const login = async (credentials) => {
    console.log('AuthContext - Attempting login with credentials:', credentials);
    
    try {
      // Gọi API đăng nhập
      const response = await authService.login(credentials);
      console.log('AuthContext - Login response:', response);
      
      if (response && response.authenticated) {
        console.log('AuthContext - Login successful, updating state with user:', response.user);
        
        // Đảm bảo user và token được lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        
        // Cập nhật state
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Kích hoạt sự kiện storage để các component khác biết có sự thay đổi
        window.dispatchEvent(new Event('auth-state-changed'));
        
        // Kiểm tra state sau khi cập nhật
        console.log('AuthContext - State updated:', {
          user: response.user,
          isAuthenticated: true
        });
        
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

  const logout = async (redirectToHome = true) => {
    try {
      console.log('AuthContext - Attempting logout...');
      await authService.logout();
      console.log('AuthContext - Logout successful, clearing user state');
      
      // Cập nhật state
      setUser(null);
      setIsAuthenticated(false);
      
      // Kích hoạt sự kiện để cập nhật UI
      window.dispatchEvent(new Event('auth-state-changed'));
      
      // Chỉ chuyển hướng nếu được yêu cầu
      if (redirectToHome) {
        console.log('AuthContext - Redirecting to home page');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('AuthContext - Logout error:', error.message || 'Unknown error');
      
      // Cập nhật state
      setUser(null);
      setIsAuthenticated(false);
      
      // Kích hoạt sự kiện để cập nhật UI
      window.dispatchEvent(new Event('auth-state-changed'));
      
      // Chỉ chuyển hướng nếu được yêu cầu
      if (redirectToHome) {
        console.log('AuthContext - Redirecting to home page after error');
        window.location.href = '/';
      }
    }
  };

  const updateUser = (userData) => {
    console.log('AuthContext - Updating user data:', userData);
    
    // Đảm bảo userData là một object hợp lệ
    if (!userData || typeof userData !== 'object') {
      console.error('AuthContext - Invalid user data:', userData);
      return;
    }
    
    // Tạo một bản sao của userData để tránh tham chiếu
    const userDataCopy = JSON.parse(JSON.stringify(userData));
    
    // Cập nhật state
    setUser(userDataCopy);
    
    // Lưu vào localStorage
    try {
      localStorage.setItem('user', JSON.stringify(userDataCopy));
    } catch (error) {
      console.error('AuthContext - Error saving user data to localStorage:', error);
    }
    
    // Kích hoạt sự kiện để cập nhật UI
    try {
      window.dispatchEvent(new Event('auth-state-changed'));
    } catch (error) {
      console.error('AuthContext - Error dispatching event:', error);
    }
    
    console.log('AuthContext - User data updated and saved to localStorage');
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