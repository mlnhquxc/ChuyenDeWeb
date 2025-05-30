import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config';

const authService = {
  async login(credentials) {
    try {
      console.log('Login attempt with:', credentials);
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('Login response:', response.data);
      
      if (response.data.result) {
        localStorage.setItem('token', response.data.result.token);
        localStorage.setItem('user', JSON.stringify(response.data.result.user));
        return response.data.result;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      console.log('=== REGISTER REQUEST START ===');
      console.log('Request URL:', ENDPOINTS.AUTH.REGISTER);
      console.log('Request data:', userData);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
      });
      
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, userData);
      console.log('=== REGISTER REQUEST END ===');
      console.log('Register response:', response.data);
      
      if (response.data.result) {
        localStorage.setItem('token', response.data.result.token);
        localStorage.setItem('user', JSON.stringify(response.data.result.user));
        return response.data.result;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.error('=== REGISTER ERROR START ===');
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      console.error('=== REGISTER ERROR END ===');
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async refreshToken() {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REFRESH_TOKEN);
      if (response.data.result) {
        localStorage.setItem('token', response.data.result.token);
        return response.data.result;
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
