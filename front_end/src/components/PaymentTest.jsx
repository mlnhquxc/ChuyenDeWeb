import React, { useState } from 'react';
import paymentService from '../services/paymentService';
import { showToast } from '../utils/toast';

const PaymentTest = () => {
  const [amount, setAmount] = useState(10000);
  const [loading, setLoading] = useState(false);

  const handleTestPayment = async () => {
    setLoading(true);
    try {
      const paymentData = {
        orderId: null,
        amount: amount,
        orderInfo: `Test thanh toán ${amount} VND`,
        userId: 1 // Test user ID
      };

      const response = await paymentService.createPayment(paymentData);
      
      if (response.result && response.result.paymentUrl) {
        showToast.success('Tạo thanh toán thành công! Đang chuyển hướng...');
        setTimeout(() => {
          paymentService.redirectToVnPay(response.result.paymentUrl);
        }, 1000);
      } else {
        showToast.error('Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Payment test failed:', error);
      showToast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLegacyTest = async () => {
    setLoading(true);
    try {
      const response = await paymentService.createPaymentLegacy(amount, null, 1);
      
      if (response.result && response.result.paymentUrl) {
        showToast.success('Tạo thanh toán thành công! Đang chuyển hướng...');
        setTimeout(() => {
          paymentService.redirectToVnPay(response.result.paymentUrl);
        }, 1000);
      } else {
        showToast.error('Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Payment test failed:', error);
      showToast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Test VnPay Integration</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Số tiền (VND)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1000"
          step="1000"
        />
      </div>

      <div className="space-y-3">
        <button
          onClick={handleTestPayment}
          disabled={loading || amount < 1000}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang xử lý...' : 'Test Payment API (POST)'}
        </button>

        <button
          onClick={handleLegacyTest}
          disabled={loading || amount < 1000}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang xử lý...' : 'Test Legacy API (GET)'}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>• Số tiền tối thiểu: 1,000 VND</p>
        <p>• Môi trường: Sandbox</p>
        <p>• Thẻ test: 9704198526191432198</p>
        <p>• Tên: NGUYEN VAN A</p>
        <p>• Ngày hết hạn: 07/15</p>
        <p>• Mật khẩu OTP: 123456</p>
      </div>
    </div>
  );
};

export default PaymentTest;