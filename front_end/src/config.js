export const API_URL = 'http://localhost:8080';

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        REFRESH_TOKEN: '/api/auth/refresh-token',
        INTROSPECT: '/api/auth/introspect',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        VERIFY_OTP: '/api/auth/verify-otp',
        RESET_PASSWORD: '/api/auth/reset-password'
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
        MY_ORDERS: '/api/orders/my-orders',
        DETAIL: (id) => `/api/orders/${id}`,
        BY_NUMBER: (orderNumber) => `/api/orders/number/${orderNumber}`,
        CREATE: '/api/orders',
        CREATE_FROM_CART: '/api/orders/create-from-cart',
        CANCEL: (id) => `/api/orders/${id}/cancel`,
        UPDATE_STATUS: (id) => `/api/orders/${id}/status`,
        UPDATE_TRACKING: (id) => `/api/orders/${id}/tracking`
    },
    WISHLIST: {
        GET: '/api/wishlist',
        ADD: '/api/wishlist/add',
        REMOVE: (productId) => `/api/wishlist/remove/${productId}`,
        CLEAR: '/api/wishlist/clear'
    },
    CART: {
        GET: '/api/cart',
        ADD: '/api/cart/add',
        UPDATE: '/api/cart/update',
        REMOVE: (productId) => `/api/cart/remove/${productId}`,
        CLEAR: '/api/cart/clear'
    }
};