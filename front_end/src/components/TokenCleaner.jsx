import { useEffect } from 'react';
import authService from '../services/authService';

const TokenCleaner = () => {
  useEffect(() => {
    // Clear expired tokens on app startup
    const wasCleared = authService.clearExpiredTokens();
    if (wasCleared) {
      console.log('Expired tokens cleared, user needs to login again');
      // Optionally redirect to login page
      if (window.location.pathname !== '/auth' && window.location.pathname !== '/') {
        window.location.href = '/auth';
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default TokenCleaner;