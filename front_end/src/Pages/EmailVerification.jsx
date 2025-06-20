import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import axiosInstance from '../services/axiosConfig';
import { ENDPOINTS } from '../config';
import { showToast } from '../utils/toast';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasVerified, setHasVerified] = useState(false); // Prevent multiple requests

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token xác thực không hợp lệ.');
      setIsLoading(false);
      return;
    }

    // Only verify once
    if (!hasVerified) {
      verifyEmail(token);
    }
  }, [searchParams]); // Remove hasVerified from dependency to avoid infinite loop

  const verifyEmail = async (token) => {
    // Prevent multiple calls
    if (hasVerified) return;
    
    try {
      setIsLoading(true);
      setHasVerified(true);
      const response = await axiosInstance.get(`${ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`);
      
      // Kiểm tra response status và code để xác định thành công
      if (response.status === 200 && response.data && response.data.code === 0) {
        setStatus('success');
        setMessage(response.data.result);
        
        // Kiểm tra nếu là trường hợp email đã được xác thực trước đó
        if (response.data.result.includes('đã được xác thực trước đó')) {
          showToast.info('Email đã được xác thực trước đó.');
        } else {
          showToast.success('Email đã được xác thực thành công!');
        }
        
        // Chuyển hướng về trang đăng nhập sau 3 giây
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Trường hợp response có data nhưng không thành công
        setStatus('error');
        const errorMessage = response.data?.message || 'Xác thực email thất bại.';
        setMessage(errorMessage);
        showToast.error(errorMessage);
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setStatus('error');
      
      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Xác thực email thất bại. Vui lòng thử lại.';
      
      if (error.response) {
        // Server trả về response với error status
        const { status, data } = error.response;
        
        if (status === 400 && data?.message) {
          // Lỗi từ backend (như TOKEN_EXPIRED, INVALID_TOKEN, etc.)
          errorMessage = data.message;
        } else if (status === 500) {
          errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau.';
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      setMessage(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="mb-6">
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <FaSpinner className="text-6xl text-indigo-600 dark:text-indigo-400" />
            </motion.div>
          )}
          
          {!isLoading && status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
            </motion.div>
          )}
          
          {!isLoading && status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <FaTimesCircle className="text-6xl text-red-500 mx-auto" />
            </motion.div>
          )}
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isLoading && 'Đang xác thực email...'}
            {!isLoading && status === 'success' && 'Xác thực thành công!'}
            {!isLoading && status === 'error' && 'Xác thực thất bại'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>

        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {status === 'success' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Bạn sẽ được chuyển hướng về trang đăng nhập trong 3 giây...
                </p>
                <button
                  onClick={handleGoToLogin}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Đăng nhập ngay
                </button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <button
                  onClick={handleGoToLogin}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Quay lại đăng nhập
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nếu bạn gặp vấn đề, vui lòng liên hệ với bộ phận hỗ trợ.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EmailVerification;