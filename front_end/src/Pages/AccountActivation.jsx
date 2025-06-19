import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { showToast } from '../utils/toast';

const AccountActivation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activationStatus, setActivationStatus] = useState('waiting'); // 'waiting', 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Lấy token kích hoạt từ URL
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');
    
    if (!tokenFromUrl) {
      setActivationStatus('error');
      setErrorMessage('Không tìm thấy mã kích hoạt. Vui lòng kiểm tra lại liên kết kích hoạt.');
      return;
    }
    
    setToken(tokenFromUrl);
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
    
    // Không tự động kích hoạt, chờ người dùng nhấn nút
    setActivationStatus('waiting');
  }, [location.search]);
  
  const handleActivateAccount = async () => {
    try {
      setActivationStatus('processing');
      
      if (!token) {
        setActivationStatus('error');
        setErrorMessage('Không tìm thấy mã kích hoạt. Vui lòng kiểm tra lại liên kết kích hoạt.');
        return;
      }
      
      // Gọi API kích hoạt tài khoản
      const response = await authService.activateAccount(token);
      
      console.log('Activation response:', response); // Debug log
      
      // Kiểm tra cấu trúc phản hồi từ backend
      if (response && (response.code === 0 || response.code === 'SUCCESS' || (response.result && response.result.activated))) {
        setActivationStatus('success');
        showToast.success('Tài khoản đã được kích hoạt thành công!');
      } else {
        setActivationStatus('error');
        setErrorMessage('Kích hoạt tài khoản thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Account activation error:', error);
      
      // Nếu có email, kiểm tra xem tài khoản đã được kích hoạt chưa
      if (email) {
        try {
          // Gọi API kiểm tra trạng thái kích hoạt
          const checkResponse = await authService.checkActivationStatus(email);
          console.log('Check activation response:', checkResponse);
          
          if (checkResponse && checkResponse.result && checkResponse.result.activated) {
            // Nếu tài khoản đã được kích hoạt, hiển thị thành công
            setActivationStatus('success');
            showToast.success('Tài khoản đã được kích hoạt thành công!');
            return;
          }
        } catch (checkError) {
          console.error('Error checking activation status:', checkError);
        }
      }
      
      setActivationStatus('error');
      setErrorMessage(error.userMessage || 'Kích hoạt tài khoản thất bại. Vui lòng thử lại sau.');
    }
  };
  
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-200">
        {activationStatus === 'waiting' && (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">Kích hoạt tài khoản</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {email ? `Bạn đang kích hoạt tài khoản cho email: ${email}` : 'Bạn đang kích hoạt tài khoản của mình.'}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Nhấn nút bên dưới để hoàn tất quá trình kích hoạt tài khoản.
            </p>
            <button
              onClick={handleActivateAccount}
              className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Kích hoạt tài khoản
            </button>
          </div>
        )}
        
        {activationStatus === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-4 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-400 mx-auto"></div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">Đang kích hoạt tài khoản...</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Vui lòng đợi trong giây lát.</p>
          </div>
        )}
        
        {activationStatus === 'success' && (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">Kích hoạt tài khoản thành công!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Tài khoản của bạn đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập và sử dụng dịch vụ của chúng tôi.
            </p>
            <button
              onClick={handleGoToLogin}
              className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}
        
        {activationStatus === 'error' && (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">Kích hoạt tài khoản thất bại</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {errorMessage}
            </p>
            <button
              onClick={handleGoToLogin}
              className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountActivation;