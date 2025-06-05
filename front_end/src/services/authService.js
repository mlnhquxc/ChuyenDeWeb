import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config';

const authService = {
  async login(credentials) {
    try {
      console.log('authService - Login attempt with:', credentials);
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('authService - Login response:', response.data);
      
      if (response.data && response.data.result) {
        const { token, user } = response.data.result;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { ...response.data.result, authenticated: true };
      }
      return null;
    } catch (error) {
      console.error('authService - Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (error.response?.status === 403) {
        try {
          const refreshResponse = await this.refreshToken();
          if (refreshResponse) {
            const retryResponse = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
            if (retryResponse.data.result) {
              const { token, user } = retryResponse.data.result;
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              return { ...retryResponse.data.result, authenticated: true };
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      throw error;
    }
  },

  async register(userData) {
    try {
      console.log('authService - Register attempt with:', userData);
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, userData);
      console.log('authService - Register response:', response.data);
      
      const result = response.data.result;
      if (result && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { ...result, authenticated: true };
      }
      return null;
    } catch (error) {
      console.error('authService - Register error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async refreshToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axiosInstance.post(ENDPOINTS.AUTH.REFRESH_TOKEN, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.result) {
        const newToken = response.data.result.token;
        localStorage.setItem('token', newToken);
        return response.data.result;
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('authService - Error getting current user:', error);
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  }
};

export default authService;
