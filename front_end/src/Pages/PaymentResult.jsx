import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import paymentService from '../services/paymentService';
import { showToast } from '../utils/toast';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get('status');
    const txnRef = urlParams.get('txnRef');
    const message = urlParams.get('message');

    if (status === 'error') {
      setPaymentStatus('error');
      setError(message || 'Có lỗi xảy ra trong quá trình thanh toán');
      return;
    }

    if (txnRef) {
      fetchPaymentStatus(txnRef);
    } else {
      setPaymentStatus('error');
      setError('Không tìm thấy thông tin giao dịch');
    }
  }, [location]);

  const fetchPaymentStatus = async (txnRef) => {
    try {
      const response = await paymentService.getPaymentStatus(txnRef);
      if (response.result) {
        setPaymentData(response.result);
        setPaymentStatus(response.result.status.toLowerCase());
        
        if (response.result.status === 'SUCCESS') {
          showToast.success('Thanh toán thành công!');
        } else if (response.result.status === 'FAILED') {
          showToast.error('Thanh toán thất bại!');
        }
      } else {
        setPaymentStatus('error');
        setError('Không thể lấy thông tin giao dịch');
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setPaymentStatus('error');
      setError('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <FaSpinner className="animate-spin text-6xl text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Đang xử lý kết quả thanh toán...
            </h1>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-6">
              Giao dịch của bạn đã được xử lý thành công
            </p>
            
            {paymentData && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold mb-4">Thông tin giao dịch</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium">{paymentData.txnRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(paymentData.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium">{paymentData.paymentMethod || 'VnPay'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium">{paymentData.bankCode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {formatDateTime(paymentData.paymentDate)}
                    </span>
                  </div>
                  {paymentData.transactionNo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã GD ngân hàng:</span>
                      <span className="font-medium">{paymentData.transactionNo}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem đơn hàng
              </button>
              <button
                onClick={() => navigate('/store')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Thanh toán thất bại!
            </h1>
            <p className="text-gray-600 mb-6">
              Giao dịch của bạn không thể hoàn thành
            </p>
            
            {paymentData && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold mb-4">Thông tin giao dịch</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium">{paymentData.txnRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-medium">
                      {formatCurrency(paymentData.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lý do:</span>
                    <span className="font-medium text-red-600">
                      {paymentData.responseCode === '24' ? 'Giao dịch bị hủy' : 'Lỗi thanh toán'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {formatDateTime(paymentData.createdDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/payment')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại thanh toán
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Quay lại giỏ hàng
              </button>
            </div>
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Có lỗi xảy ra!
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'Không thể xử lý kết quả thanh toán'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kiểm tra đơn hàng
              </button>
              <button
                onClick={() => navigate('/store')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;