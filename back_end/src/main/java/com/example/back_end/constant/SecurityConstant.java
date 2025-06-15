package com.example.back_end.constant;

public class SecurityConstant {
    public static final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/**",
            "/api/products/**",
            "/api/categories/**",
            "/api/brands/**",
            "/error"
    };
    
    public static final String[] ADMIN_ENDPOINTS = {
            "/api/admin/**"
    };
    
    public static final String[] USER_ENDPOINTS = {
            "/api/user/**",
            "/api/cart/**",
            "/api/wishlist/**",
            "/api/orders/**"
    };
} 