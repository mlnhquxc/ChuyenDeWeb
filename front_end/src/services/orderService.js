import axiosInstance from './axiosConfig';
import { ENDPOINTS } from '../config.js';

const orderService = {
  // Get user's orders with pagination
  getMyOrders: async (page = 0, size = 10, sortBy = 'orderDate', sortDir = 'desc') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir
      });
      
      const response = await axiosInstance.get(`/api/orders/my-orders?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error.response?.data || error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error.response?.data || error;
    }
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await axiosInstance.get(`/api/orders/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order by number:', error);
      throw error.response?.data || error;
    }
  },

  // Create order from cart
  createOrderFromCart: async (orderData) => {
    try {
      const response = await axiosInstance.post('/api/orders/create-from-cart', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error.response?.data || error;
    }
  },

  // Create order directly from products (Buy Now functionality)Add commentMore actions
  createDirectOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/api/orders/create-direct', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating direct order:', error);
      throw error.response?.data || error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    try {
      const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
      const response = await axiosInstance.put(`/api/orders/${orderId}/cancel${params}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error.response?.data || error;
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error.response?.data || error;
    }
  },

  // Update tracking number (admin only)
  updateTrackingNumber: async (orderId, trackingNumber) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/tracking?trackingNumber=${trackingNumber}`);
      return response.data;
    } catch (error) {
      console.error('Error updating tracking number:', error);
      throw error.response?.data || error;
    }
  }
};

export default orderService;