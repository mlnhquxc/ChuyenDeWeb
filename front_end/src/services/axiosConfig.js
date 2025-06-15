import axios from 'axios';
import {API_URL} from '../config';
import authService from './authService';

if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing axios with baseURL:', API_URL);
}

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000 // Add a reasonable timeout
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
        if (process.env.NODE_ENV !== 'production') {
            console.log('=== REQUEST START ===');
            console.log('Request URL:', config.url);
            console.log('Request method:', config.method);
            console.log('Request data:', config.data);
            console.log('Request headers:', config.headers);
            console.log('=== REQUEST END ===');
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error.message || 'Unknown error');
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('=== RESPONSE START ===');
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            console.log('=== RESPONSE END ===');
        }
        return response;
    },
    async (error) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error('=== ERROR START ===');
        }
        const originalRequest = error.config;
        // No retry if the request already failed after a retry or doesn't have a config
        if (!originalRequest || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (error.response) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('Response error:', error.response.data);
                console.error('Response status:', error.response.status);
            }

            // Handle 403 Forbidden error
            if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
                // If already refreshing, queue this request
                if (isRefreshing) {
                    try {
                        const token = await new Promise((resolve, reject) => {
                            failedQueue.push({resolve, reject});
                        });
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    } catch (err) {
                        // If token refresh failed for a queued request, redirect to login
                        if (err.response?.status === 401 || err.response?.status === 403) {
                            authService.logout();
                            window.location.href = '/auth';
                        }
                        return Promise.reject(err);
                    }
                }

                // Mark this request as retried to prevent infinite loops
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Attempt to refresh the token
                    const response = await authService.refreshToken();
                    if (!response || !response.token) {
                        throw new Error('Token refresh failed - no token returned');
                    }
                    const newToken = response.token;
                    localStorage.setItem('token', newToken);

                    // Process any queued requests with the new token
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If token refresh fails, reject all queued requests
                    processQueue(refreshError, null);
                    // Log the user out and redirect to login page
                    authService.logout();
                    window.location.href = '/auth';
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network error - no response received');

            // Add a user-friendly message
            error.userMessage = 'Network error. Please check your connection and try again.';
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message || 'Unknown error');

            // Add a user-friendly message
            error.userMessage = 'An unexpected error occurred. Please try again.';
        }
        if (process.env.NODE_ENV !== 'production') {
            console.error('=== ERROR END ===');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;