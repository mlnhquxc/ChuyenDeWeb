import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

const authService = {
  async login(credentials) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Login attempt with:', credentials);
      }
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Login response:', response);
      }

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      // Handle the API response structure: { code, result: { token, authenticated, user } }
      const { result } = response.data;
      if (!result) {
        throw new Error('Invalid response structure from server');
      }

      const { token, user, authenticated } = result;
      
      if (!token || !user) {
        throw new Error('Missing token or user data');
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { accessToken: token, user, authenticated };
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Login error:', error);
      } else {
        console.error('Login failed:', error.message || 'Unknown error');
      }

      if (error.response?.status === 403) {
        try {
          const refreshResponse = await this.refreshToken();
          if (refreshResponse) {
            const retryResponse = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
            if (retryResponse?.data?.result) {
              const { token, user, authenticated } = retryResponse.data.result;
              localStorage.setItem(TOKEN_KEY, token);
              localStorage.setItem(USER_KEY, JSON.stringify(user));
              return { accessToken: token, user, authenticated };
            }
          }
        } catch (refreshError) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Token refresh failed:', refreshError);
          }
        }
      }
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.';
      error.userMessage = errorMessage;
      throw error;
    }
  },

  async register(userData) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Register attempt with:', userData);
      }
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, userData);
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Register response:', response.data);
      }

      // Handle the API response structure: { code, result: { token, authenticated, user } }
      const { result } = response.data;
      if (result && result.user) {
        const { token, user, authenticated } = result;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return { accessToken: token, user, authenticated: authenticated || true };
      }
      return null;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Register error:', error);
      } else {
        console.error('Registration failed:', error.message || 'Unknown error');
      }

      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      error.userMessage = errorMessage;
      throw error;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async refreshToken() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axiosInstance.post(ENDPOINTS.AUTH.REFRESH_TOKEN, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.result && response.data.result.token) {
        const newToken = response.data.result.token;
        localStorage.setItem(TOKEN_KEY, newToken);
        return { accessToken: newToken };
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    return !!(token && user);
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('authService - Error getting current user:', error);
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
};

export default authService;