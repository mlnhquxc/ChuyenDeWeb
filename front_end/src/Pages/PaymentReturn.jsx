import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import cartService from '../services/cartService';

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [paymentInfo, setPaymentInfo] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const responseCode = urlParams.get('vnp_ResponseCode');
    const transactionStatus = urlParams.get('vnp_TransactionStatus');
    const amount = urlParams.get('vnp_Amount');
    const orderInfo = urlParams.get('vnp_OrderInfo');
    const txnRef = urlParams.get('vnp_TxnRef');
    const bankCode = urlParams.get('vnp_BankCode');
    const payDate = urlParams.get('vnp_PayDate');

    // Set payment info
    setPaymentInfo({
      amount: amount ? parseInt(amount) / 100 : 0,
      orderInfo: decodeURIComponent(orderInfo || ''),
      txnRef,
      bankCode,
      payDate: payDate ? formatPayDate(payDate) : '',
    });

    // Check payment status
    if (responseCode === '00' && transactionStatus === '00') {
      setPaymentStatus('success');
      // Don't clear cart immediately, let backend handle it
      // Cart will be cleared when user navigates away or after a longer delay
    } else {
      setPaymentStatus('failed');
    }
  }, [location.search]);

  // Clear cart after a longer delay to ensure backend has processed the order
  useEffect(() => {
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        clearCartAfterPayment();
      }, 30000); // Clear cart after 30 seconds

      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  const clearCartAfterPayment = async () => {
    try {
      await cartService.clearCart();
      // Also clear localStorage cart if exists
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error clearing cart after payment:', error);
      // Still clear localStorage even if API call fails
      localStorage.removeItem('cart');
    }
  };

  const formatPayDate = (dateString) => {
    if (!dateString || dateString.length !== 14) return '';
    
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleContinueShopping = () => {
    if (paymentStatus === 'success') {
      clearCartAfterPayment();
    }
    navigate('/');
  };

  const handleViewOrders = () => {
    if (paymentStatus === 'success') {
      clearCartAfterPayment();
    }
    navigate('/profile/orders');
  };

  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Đang xử lý kết quả thanh toán...
          </h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Status Icon */}
          <div className="text-center mb-8">
            {paymentStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-green-600 mb-2">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600">
                  Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                  Thanh toán thất bại!
                </h1>
                <p className="text-gray-600">
                  Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                </p>
              </motion.div>
            )}
          </div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Chi tiết thanh toán
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-medium text-gray-800">{paymentInfo.txnRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(paymentInfo.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thông tin đơn hàng:</span>
                <span className="font-medium text-gray-800">{paymentInfo.orderInfo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-medium text-gray-800">{paymentInfo.bankCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium text-gray-800">{paymentInfo.payDate}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {paymentStatus === 'success' ? (
              <>
                <button
                  onClick={handleViewOrders}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Xem đơn hàng
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Tiếp tục mua sắm
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Quay lại giỏ hàng
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Tiếp tục mua sắm
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentReturn;