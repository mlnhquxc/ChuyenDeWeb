import axios from 'axios';
import { API_URL, ENDPOINTS } from '../config';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const userService = {
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}${ENDPOINTS.USER.PROFILE}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axios.put(
          `${API_URL}${ENDPOINTS.USER.UPDATE_PROFILE}`,
          userData,
          { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await axios.put(
          `${API_URL}${ENDPOINTS.USER.CHANGE_PASSWORD}`,
          passwordData,
          { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadAvatar: async (file) => {
    try {
      console.log('userService - Uploading avatar file:', file.name, file.type, file.size);
      
      const formData = new FormData();
      formData.append('avatar', file);

      // Log FormData (for debugging)
      for (let pair of formData.entries()) {
        console.log('userService - FormData entry:', pair[0], pair[1]);
      }

      const uploadUrl = `${API_URL}${ENDPOINTS.USER.UPLOAD_AVATAR}`;
      console.log('userService - Sending request to:', uploadUrl);
      
      const response = await axios.post(
          uploadUrl,
          formData,
          {
            headers: {
              ...getAuthHeader(),
              'Content-Type': 'multipart/form-data',
            },
          }
      );
      
      console.log('userService - Upload response:', response.data);
      
      // Kiểm tra response
      if (response.data && response.data.result && response.data.result.avatarUrl) {
        const avatarUrl = response.data.result.avatarUrl;
        console.log('userService - Avatar URL from response:', avatarUrl);
        
        // Kiểm tra xem URL có phải là đường dẫn tương đối không
        if (avatarUrl.startsWith('/')) {
          console.log('userService - Relative URL detected');
        } else {
          console.log('userService - Absolute URL detected');
        }
      } else {
        console.error('userService - Invalid response format:', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('userService - Upload error:', error);
      console.error('userService - Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      throw error.response?.data || error;
    }
  },

  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}${ENDPOINTS.ORDER.LIST}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  checkUploads: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/check-uploads`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  fixAvatarUrls: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/fix-avatar-urls`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await axios.get(
          `${API_URL}${ENDPOINTS.ORDER.DETAIL(orderId)}`,
          { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(
          `${API_URL}${ENDPOINTS.ORDER.CREATE}`,
          orderData,
          { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await axios.put(
          `${API_URL}${ENDPOINTS.ORDER.CANCEL(orderId)}`,
          {},
          { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default userService;