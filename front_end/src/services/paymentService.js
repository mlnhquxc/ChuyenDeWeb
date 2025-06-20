import axiosInstance from './axiosConfig';

const paymentService = {
  // Tạo payment URL
  createPayment: async (paymentData) => {
    try {
      const response = await axiosInstance.post('/payment/create', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Tạo payment URL (legacy method)
  createPaymentLegacy: async (amount, orderId = null, userId = null) => {
    try {
      const params = new URLSearchParams();
      params.append('amount', amount);
      if (orderId) params.append('orderId', orderId);
      if (userId) params.append('userId', userId);

      const response = await axiosInstance.get(`/payment/vnpay?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Lấy trạng thái payment
  getPaymentStatus: async (txnRef) => {
    try {
      const response = await axiosInstance.get(`/payment/status/${txnRef}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },

  // Lấy danh sách payment của user
  getUserPayments: async (userId) => {
    try {
      const response = await axiosInstance.get(`/payment/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  },

  // Redirect đến VnPay
  redirectToVnPay: (paymentUrl) => {
    window.location.href = paymentUrl;
  }
};

export default paymentService;