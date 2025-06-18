import { useEffect } from 'react';
import authService from '../services/authService';

const TokenCleaner = () => {
  useEffect(() => {
    console.log('TokenCleaner - Checking for expired tokens on app startup');
    // Clear expired tokens on app startup
    const wasCleared = authService.clearExpiredTokens();
    if (wasCleared) {
      console.log('TokenCleaner - Expired tokens cleared, user needs to login again');
      // Không tự động chuyển hướng đến trang đăng nhập
      // Để người dùng có thể tiếp tục duyệt trang với tư cách khách
    } else {
      console.log('TokenCleaner - No expired tokens found');
    }
  }, []);

  return null; // This component doesn't render anything
};

export default TokenCleaner;