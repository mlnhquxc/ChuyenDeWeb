import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import { showToast } from '../utils/toast';

const VerifyOTP = ({ email, onBack, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã OTP 6 chữ số');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await authService.verifyOTP(email, otpValue);
      toast.success('Xác thực OTP thành công');
      onVerified(email, otpValue);
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.userMessage || 'Mã OTP không hợp lệ hoặc đã hết hạn');
      toast.error('Xác thực OTP thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Mã OTP mới đã được gửi đến email của bạn');
      setTimeLeft(300); // Reset timer to 5 minutes
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
          Xác thực OTP
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Nhập mã OTP đã được gửi đến email {email}
        </p>
        <div className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Mã OTP sẽ hết hạn sau: <span className={`${timeLeft < 60 ? 'text-red-500' : ''}`}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Mã OTP
          </label>
          <div className="flex justify-center gap-2 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition-colors duration-200"
                required
              />
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] ${(isLoading || otp.join('').length !== 6) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Xác thực"
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>
          
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoading || timeLeft > 270} // Disable resend for first 30 seconds
            className={`font-medium ${isLoading || timeLeft > 270 ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'}`}
          >
            Gửi lại mã OTP {timeLeft > 270 && `(${formatTime(timeLeft - 270)})`}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default VerifyOTP;