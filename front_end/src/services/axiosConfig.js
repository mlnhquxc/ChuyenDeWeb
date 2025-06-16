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
    timeout: 10000

});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            // Handle 401 Unauthorized error
            if (error.response.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    // If token refresh is in progress, queue the request
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return axiosInstance(originalRequest);
                        })
                        .catch(err => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Attempt to refresh the token
                    const response = await authService.refreshToken();
                    if (!response || !response.accessToken) {
                        throw new Error('Token refresh failed - no token returned');
                    }
                    const newToken = response.accessToken;

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

            // Handle 403 Forbidden error
            if (error.response.status === 403) {
                authService.logout();
                window.location.href = '/auth';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;