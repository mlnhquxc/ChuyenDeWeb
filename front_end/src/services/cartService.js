import axios from 'axios';
import { API_URL } from '../config';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const cartService = {
  getCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      const response = await axios.post(
          `${API_URL}/cart/add`,
          { productId, quantity },
          { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await axios.put(
          `${API_URL}/cart/update/${cartItemId}`,
          { quantity },
          { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/remove/${cartItemId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getWishlist: async () => {
    try {
      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addToWishlist: async (productId) => {
    try {
      const response = await axios.post(
          `${API_URL}/wishlist/add`,
          { productId },
          { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/wishlist/remove/${productId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default cartService;