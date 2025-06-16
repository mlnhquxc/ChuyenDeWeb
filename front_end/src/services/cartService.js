import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config.js';

console.log('Config import - ENDPOINTS:', ENDPOINTS);
console.log('Config import - CART ENDPOINTS:', ENDPOINTS?.CART);

const cartService = {
  getCart: async () => {
    try {
      console.log('Getting cart');
      console.log('CART GET endpoint:', ENDPOINTS?.CART?.GET);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.CART.GET is undefined
      const endpoint = ENDPOINTS?.CART?.GET || '/api/cart';
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error.response?.data || error;
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      console.log('Adding to cart, productId:', productId, 'quantity:', quantity);
      console.log('CART ADD endpoint:', ENDPOINTS?.CART?.ADD);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.CART.ADD is undefined
      const endpoint = ENDPOINTS?.CART?.ADD || '/api/cart/add';
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.post(endpoint, { productId, quantity });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error.response?.data || error;
    }
  },

  updateCartItem: async (cartItemId, quantity) => {
    try {
      console.log('Updating cart item, cartItemId:', cartItemId, 'quantity:', quantity);
      console.log('CART UPDATE endpoint:', ENDPOINTS?.CART?.UPDATE);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.CART.UPDATE is undefined
      const endpoint = ENDPOINTS?.CART?.UPDATE || '/api/cart/update';
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.put(endpoint, { cartItemId, quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error.response?.data || error;
    }
  },

  removeFromCart: async (productId) => {
    try {
      console.log('Removing from cart, productId:', productId);
      console.log('CART REMOVE endpoint function:', ENDPOINTS?.CART?.REMOVE);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.CART.REMOVE is undefined
      const endpoint = ENDPOINTS?.CART?.REMOVE ? 
        ENDPOINTS.CART.REMOVE(productId) : 
        `/api/cart/remove/${productId}`;
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error.response?.data || error;
    }
  },

  clearCart: async () => {
    try {
      console.log('Clearing cart');
      console.log('CART CLEAR endpoint:', ENDPOINTS?.CART?.CLEAR);
      
      // Fallback to hardcoded endpoint if ENDPOINTS.CART.CLEAR is undefined
      const endpoint = ENDPOINTS?.CART?.CLEAR || '/api/cart/clear';
      console.log('Using endpoint:', endpoint);
      
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error.response?.data || error;
    }
  }
};

export default cartService;