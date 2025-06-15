package com.example.back_end.service;

import com.example.back_end.dto.WishlistDTO;
import com.example.back_end.entity.User;

public interface WishlistService {
    WishlistDTO getWishlistByUser(User user);
    WishlistDTO addToWishlist(User user, Long productId);
    WishlistDTO removeFromWishlist(User user, Long productId);
    boolean isProductInWishlist(User user, Long productId);
    void clearWishlist(User user);
}