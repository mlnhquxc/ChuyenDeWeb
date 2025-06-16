import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config.js';

console.log('Config import - ENDPOINTS:', ENDPOINTS);
console.log('Config import - WISHLIST ENDPOINTS:', ENDPOINTS?.WISHLIST);

const wishlistService = {
  getWishlist: async () => {
    try {
      console.log('Getting wishlist');
      console.log('WISHLIST GET endpoint:', ENDPOINTS?.WISHLIST?.GET);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.WISHLIST.GET is undefined
      const endpoint = ENDPOINTS?.WISHLIST?.GET || '/api/wishlist';
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error getting wishlist:', error);
      throw error.response?.data || error;
    }
  },

  addToWishlist: async (productId) => {
    try {
      console.log('Adding to wishlist, productId:', productId);
      console.log('WISHLIST ADD endpoint:', ENDPOINTS?.WISHLIST?.ADD);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.WISHLIST.ADD is undefined
      const endpoint = ENDPOINTS?.WISHLIST?.ADD || '/api/wishlist/add';
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.post(endpoint, { productId });
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error.response?.data || error;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      console.log('Removing from wishlist, productId:', productId);
      console.log('WISHLIST REMOVE endpoint function:', ENDPOINTS?.WISHLIST?.REMOVE);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.WISHLIST.REMOVE is undefined
      const endpoint = ENDPOINTS?.WISHLIST?.REMOVE ? 
        ENDPOINTS.WISHLIST.REMOVE(productId) : 
        `/api/wishlist/remove/${productId}`;
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error.response?.data || error;
    }
  },

  clearWishlist: async () => {
    try {
      console.log('Clearing wishlist');
      console.log('WISHLIST CLEAR endpoint:', ENDPOINTS?.WISHLIST?.CLEAR);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.WISHLIST.CLEAR is undefined
      const endpoint = ENDPOINTS?.WISHLIST?.CLEAR || '/api/wishlist/clear';
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error.response?.data || error;
    }
  }
};

export default wishlistService;