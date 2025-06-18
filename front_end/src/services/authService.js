import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const authService = {
  async login(credentials) {
    try {
      console.log('authService - Login attempt with:', credentials);
      
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('authService - Login response:', response);

      if (!response || !response.data) {
        const error = new Error('Invalid response from server');
        error.userMessage = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
        throw error;
      }

      // Handle the API response structure: { code, result: { token, authenticated, user } }
      const { result } = response.data;
      if (!result) {
        const error = new Error('Invalid response structure from server');
        error.userMessage = 'Định dạng phản hồi không hợp lệ. Vui lòng thử lại sau.';
        throw error;
      }

      const { token, user, authenticated } = result;
      
      if (!token || !user) {
        const error = new Error('Missing token or user data');
        error.userMessage = 'Thông tin đăng nhập không hợp lệ. Vui lòng thử lại.';
        throw error;
      }
      
      // Kiểm tra trạng thái kích hoạt tài khoản
      // Trong MySQL, active có thể là 0 hoặc 1
      if (user.active === 0 || user.active === false) {
        // Tài khoản chưa được kích hoạt
        const error = new Error('Tài khoản chưa được kích hoạt');
        error.code = 'ACCOUNT_NOT_ACTIVATED';
        error.email = user.email;
        error.username = user.username;
        error.userMessage = 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.';
        throw error;
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { accessToken: token, user, authenticated };
    } catch (error) {
      // Xóa token và user khỏi localStorage nếu đăng nhập thất bại
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      console.error('authService - Login error:', error);
      console.error('Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });

      // Nếu lỗi là tài khoản chưa kích hoạt, trả về lỗi đặc biệt
      if (error.code === 'ACCOUNT_NOT_ACTIVATED') {
        throw error;
      }

      // Đối với lỗi đăng nhập, không cần thử refresh token
      // Chỉ cần trả về lỗi để component xử lý
      console.log('authService - Login failed with status:', error.response?.status);
      
      // Không thực hiện refresh token cho lỗi đăng nhập
      // Không thực hiện chuyển hướng tự động
      
      // Xử lý các lỗi cụ thể từ backend
      if (error.response?.data) {
        const backendError = error.response.data;
        
        // Nếu backend trả về mã lỗi và thông báo cụ thể
        if (backendError.code && backendError.message) {
          error.userMessage = backendError.message;
        } 
        // Nếu backend trả về thông báo lỗi
        else if (backendError.message) {
          error.userMessage = backendError.message;
        }
      }
      
      // Nếu không có thông báo lỗi cụ thể, sử dụng thông báo mặc định
      if (!error.userMessage) {
        error.userMessage = error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập và thử lại.';
      }
      
      throw error;
    }
  },

  async register(userData) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Register attempt with:', userData);
      }
      
      // Đặt trạng thái active thành 0 để yêu cầu kích hoạt qua email
      const userDataWithActivation = {
        ...userData,
        active: 0  // Sử dụng 0 thay vì false để phù hợp với MySQL
      };
      
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, userDataWithActivation);
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Register response:', response.data);
      }

      // Handle the API response structure: { code, result: { token, authenticated, user } }
      const { result } = response.data;
      if (result && result.user) {
        const { token, user, authenticated } = result;
        
        // Không lưu token và user vào localStorage vì tài khoản chưa được kích hoạt
        // Thay vào đó, chỉ trả về thông tin để hiển thị thông báo
        return { 
          user, 
          needsActivation: true,
          email: userData.email,
          message: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.'
        };
      }
      return null;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Register error:', error);
      } else {
        console.error('Registration failed:', error.message || 'Unknown error');
      }

      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },
  
  async activateAccount(token) {
    try {
      console.log('authService - Activate account with token:', token.substring(0, 20) + '...');
      
      // Gửi token để kích hoạt tài khoản, chuyển active từ 0 thành 1
      const response = await axiosInstance.post(ENDPOINTS.AUTH.ACTIVATE_ACCOUNT, { token });
      
      console.log('authService - Activate account response:', response.data);
      
      // Kiểm tra nếu response.data không có code hoặc result, thêm thông tin mặc định
      if (response.data && !response.data.code && !response.data.result) {
        // Giả định rằng nếu không có lỗi HTTP thì kích hoạt thành công
        response.data = {
          code: 0,
          result: { activated: true },
          message: 'Account activated successfully'
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('authService - Activate account error:', error);
      console.error('Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      // Nếu lỗi là do backend trả về (có response)
      if (error.response) {
        // Nếu status là 400 nhưng tài khoản đã được kích hoạt (có thể là đã kích hoạt trước đó)
        if (error.response.status === 400 && 
            (error.response.data?.message?.includes('already activated') || 
             error.response.data?.message?.includes('đã được kích hoạt'))) {
          // Trả về kết quả thành công giả
          return {
            code: 0,
            result: { activated: true },
            message: 'Account already activated'
          };
        }
      }
      
      const errorMessage = error.response?.data?.message || 'Kích hoạt tài khoản thất bại. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },
  
  async checkActivationStatus(email) {
    try {
      console.log('authService - Checking activation status for email:', email);
      
      const response = await axiosInstance.post(ENDPOINTS.AUTH.CHECK_ACTIVATION, { email });
      
      console.log('authService - Check activation response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('authService - Check activation error:', error);
      
      const errorMessage = error.response?.data?.message || 'Kiểm tra trạng thái kích hoạt thất bại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },
  
  async resendActivation(email) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Resend activation email to:', email);
      }
      
      const response = await axiosInstance.post(ENDPOINTS.AUTH.RESEND_ACTIVATION, { email });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('authService - Resend activation response:', response.data);
      }
      
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('authService - Resend activation error:', error);
      } else {
        console.error('Resend activation failed:', error.message || 'Unknown error');
      }
      
      const errorMessage = error.response?.data?.message || 'Gửi lại email kích hoạt thất bại. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },

  logout() {
    console.log('authService - Logging out, removing token and user from localStorage');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return true; // Trả về true để biết đã logout thành công
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
      console.log('authService - Verify OTP request for:', { email, otp });
      
      const response = await axiosInstance.post(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
      
      console.log('authService - Verify OTP response:', response.data);
      
      // Kiểm tra cấu trúc phản hồi
      if (response.data && response.data.code === 400) {
        // Nếu backend trả về lỗi với code 400
        const error = new Error(response.data.message || 'Mã OTP không hợp lệ');
        error.userMessage = response.data.message;
        throw error;
      }
      
      return response.data;
    } catch (error) {
      console.error('authService - Verify OTP error:', error);
      console.error('Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  },

  async resetPassword(email, otp, newPassword) {
    try {
      console.log('authService - Reset password request for:', { email, otp });
      
      const response = await axiosInstance.post(ENDPOINTS.AUTH.RESET_PASSWORD, { 
        email, 
        otp, 
        newPassword 
      });
      
      console.log('authService - Reset password response:', response.data);
      
      // Kiểm tra cấu trúc phản hồi
      if (response.data) {
        // Nếu backend trả về code 0 hoặc result.success là true, coi như thành công
        if (response.data.code === 0 || (response.data.result && response.data.result.success)) {
          return {
            code: 0,
            result: { success: true },
            message: response.data.message || 'Password reset successfully'
          };
        }
        
        // Nếu backend trả về code khác 0, coi như lỗi
        if (response.data.code !== 0) {
          const error = new Error(response.data.message || 'Reset password failed');
          error.userMessage = response.data.message;
          throw error;
        }
      }
      
      // Nếu không có cấu trúc phản hồi rõ ràng, giả định thành công
      return {
        code: 0,
        result: { success: true },
        message: 'Password reset successfully'
      };
    } catch (error) {
      console.error('authService - Reset password error:', error);
      console.error('Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      
      // Nếu lỗi là do backend trả về (có response)
      if (error.response && error.response.data) {
        // Nếu backend trả về thông báo thành công trong message hoặc result.success là true
        if (
          (error.response.data.message && error.response.data.message.toLowerCase().includes('success')) ||
          (error.response.data.result && error.response.data.result.success)
        ) {
          console.log('authService - Backend reported success despite HTTP error');
          return {
            code: 0,
            result: { success: true },
            message: 'Password reset successfully'
          };
        }
      }
      
      const errorMessage = error.response?.data?.message || error.userMessage || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
      error.userMessage = errorMessage;
      throw error;
    }
  }
};

export default authService;