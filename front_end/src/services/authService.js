import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config';

const authService = {
  async login(credentials) {
    try {
      console.log('Login attempt with:', credentials);
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('Login response:', response.data);
      
      if (response.data.result) {
        const { token, user } = response.data.result;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data.result;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 403) {
        try {
          const refreshResponse = await this.refreshToken();
          if (refreshResponse) {
            const retryResponse = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
            if (retryResponse.data.result) {
              const { token, user } = retryResponse.data.result;
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              return retryResponse.data.result;
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
        const { token, user } = response.data.result;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
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
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
