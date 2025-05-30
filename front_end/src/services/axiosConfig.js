import axios from 'axios';
import { API_URL } from '../config';

console.log('Initializing axios with baseURL:', API_URL);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

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
  (error) => {
    console.error('=== ERROR START ===');
    if (error.response) {
      console.error('Response error:', error.response.data);
      console.error('Response status:', error.response.status);
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
