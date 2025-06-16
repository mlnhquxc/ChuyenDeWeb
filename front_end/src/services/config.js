// API Configuration
export const API_URL = 'http://localhost:8080/api';

// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update',
    CHANGE_PASSWORD: '/user/change-password',
    UPLOAD_AVATAR: '/user/upload-avatar',
  },

  // Product endpoints
  PRODUCT: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },

  // Cart endpoints
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: (productId) => `/cart/remove/${productId}`,
    CLEAR: '/cart/clear',
  },

  // Wishlist endpoints
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (productId) => `/wishlist/remove/${productId}`,
    CLEAR: '/wishlist/clear',
  },

  // Order endpoints
  ORDER: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CREATE: '/orders/create',
    CANCEL: (id) => `/orders/${id}/cancel`,
  },
};