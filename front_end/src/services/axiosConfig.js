import axios from 'axios';
import { API_URL } from '../config';
import authService from './authService';

console.log('Initializing axios with baseURL:', API_URL);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('=== REQUEST START ===');
    console.log('Request URL:', config.url);
    console.log('Request method:', config.method);
    console.log('Request data:', config.data);
    console.log('Request headers:', config.headers);
    console.log('=== REQUEST END ===');

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('=== RESPONSE START ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('=== RESPONSE END ===');
    return response;
  },
  async (error) => {
    console.error('=== ERROR START ===');
    const originalRequest = error.config;

    if (error.response) {
      console.error('Response error:', error.response.data);
      console.error('Response status:', error.response.status);

      // Handle 403 Forbidden error
      if (error.response.status === 403 && !originalRequest._retry) {
        if (isRefreshing) {
          try {
            const token = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await authService.refreshToken();
          const newToken = response.token;
          localStorage.setItem('token', newToken);
          
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          authService.logout();
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    console.error('=== ERROR END ===');
    return Promise.reject(error);
  }
);

export default axiosInstance;
