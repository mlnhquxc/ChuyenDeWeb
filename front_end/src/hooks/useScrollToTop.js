import { useEffect } from 'react';

/**
 * Custom hook to scroll to top
 * @param {boolean} smooth - Whether to use smooth scrolling (default: true)
 * @param {Array} dependencies - Dependencies to trigger scroll (default: [])
 */
export const useScrollToTop = (smooth = true, dependencies = []) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
  }, dependencies);
};

/**
 * Function to manually scroll to top
 * @param {boolean} smooth - Whether to use smooth scrolling (default: true)
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? 'smooth' : 'instant'
  });
};

export default useScrollToTop;