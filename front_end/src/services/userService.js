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
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(
          `${API_URL}${ENDPOINTS.USER.UPLOAD_AVATAR}`,
          formData,
          {
            headers: {
              ...getAuthHeader(),
              'Content-Type': 'multipart/form-data',
            },
          }
      );
      return response.data;
    } catch (error) {
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