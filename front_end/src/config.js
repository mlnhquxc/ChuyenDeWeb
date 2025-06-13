export const API_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    INTROSPECT: '/api/auth/introspect'
  },
  USER: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/update',
    CHANGE_PASSWORD: '/api/users/change-password',
    UPLOAD_AVATAR: '/api/users/upload-avatar'
  },
  PRODUCT: {
    LIST: '/api/products',
    DETAIL: (id) => `/api/products/${id}`,
    SEARCH: '/api/products/search',
    BY_CATEGORY: (category) => `/api/products/category/${category}`
  },
  ORDER: {
    LIST: '/api/orders',
    DETAIL: (id) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    CANCEL: (id) => `/api/orders/${id}/cancel`
  }
}; 