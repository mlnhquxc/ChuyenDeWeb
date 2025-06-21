import { useEffect } from 'react';
import authService from '../services/authService';

const TokenCleaner = () => {
  useEffect(() => {
    console.log('TokenCleaner - Checking for expired tokens on app startup');
    // Clear expired tokens on app startup
    const wasCleared = authService.clearExpiredTokens();
    if (wasCleared) {
      console.log('Expired tokens cleared, user needs to login again');
      // Optionally redirect to login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default TokenCleaner;