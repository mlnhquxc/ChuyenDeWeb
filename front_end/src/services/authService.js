import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config';

const TOKEN_KEY = 'token';
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

      // Handle the API response structure: { code, result: "message", message: "..." }
      const { result } = response.data;
      if (result) {
        // For email verification flow, we don't store tokens immediately
        return { result, message: response.data.message };
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

  // Clear expired tokens and force fresh login
  clearExpiredTokens() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('Clearing expired token');
        this.logout();
        return true; // Token was expired and cleared
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      this.logout();
      return true; // Token was invalid and cleared
    }
    
    return false; // Token is still valid
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
    
    if (!token || !user) {
      return false;
    }
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token has expired, clearing storage');
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      // If we can't parse the token, consider it invalid
      this.logout();
      return false;
    }
    
    return true;
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
  },

  async forgotPassword(email) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Forgot password request for:', email);
      }
      const response = await axiosInstance.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Forgot password response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Forgot password error:', error);
      } else {
        console.error('Forgot password request failed:', error.message || 'Unknown error');
      }
      
      const errorMessage = error.response?.data?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },

  async verifyOTP(email, otp) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Verify OTP request for:', { email, otp });
      }
      const response = await axiosInstance.post(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Verify OTP response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Verify OTP error:', error);
      } else {
        console.error('OTP verification failed:', error.message || 'Unknown error');
      }
      
      const errorMessage = error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },

  async resetPassword(email, otp, newPassword) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Reset password request for:', { email, otp });
      }
      const response = await axiosInstance.post(ENDPOINTS.AUTH.RESET_PASSWORD, { 
        email, 
        otp, 
        newPassword 
      });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Reset password response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Reset password error:', error);
      } else {
        console.error('Password reset failed:', error.message || 'Unknown error');
      }
      
      const errorMessage = error.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },

  async resendVerification(data) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Resend verification request for:', data.email);
      }
      const response = await axiosInstance.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, data);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Resend verification response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Resend verification error:', error);
      } else {
        console.error('Resend verification failed:', error.message || 'Unknown error');
      }
      
      const errorMessage = error.response?.data?.message || 'Không thể gửi lại email xác thực. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },

  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Change password request');
      }
      const response = await axiosInstance.put(ENDPOINTS.USER.CHANGE_PASSWORD, { 
        currentPassword, 
        newPassword, 
        confirmPassword 
      });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Change password response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Change password error:', error);
      } else {
        console.error('Password change failed:', error.message || 'Unknown error');
      }
      
      const errorMessage = error.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  }
};

export default authService;