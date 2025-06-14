package com.example.back_end.controller;

import com.example.back_end.dto.WishlistDTO;
import com.example.back_end.dto.request.AddToWishlistRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.UserService;
import com.example.back_end.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<WishlistDTO>> getWishlist(@AuthenticationPrincipal User userPrincipal) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        WishlistDTO wishlist = wishlistService.getWishlistByUser(user);
        return ResponseEntity.ok(ApiResponse.<WishlistDTO>builder()
                .code(200)
                .message("Wishlist retrieved successfully")
                .result(wishlist)
                .build());
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<WishlistDTO>> addToWishlist(
            @AuthenticationPrincipal User userPrincipal,
            @Valid @RequestBody AddToWishlistRequest request) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        WishlistDTO wishlist = wishlistService.addToWishlist(user, request.getProductId());
        return ResponseEntity.ok(ApiResponse.<WishlistDTO>builder()
                .code(200)
                .message("Product added to wishlist")
                .result(wishlist)
                .build());
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<WishlistDTO>> removeFromWishlist(
            @AuthenticationPrincipal User userPrincipal,
            @PathVariable Long productId) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        WishlistDTO wishlist = wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok(ApiResponse.<WishlistDTO>builder()
                .code(200)
                .message("Product removed from wishlist")
                .result(wishlist)
                .build());
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkProductInWishlist(
            @AuthenticationPrincipal User userPrincipal,
            @PathVariable Long productId) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        boolean isInWishlist = wishlistService.isProductInWishlist(user, productId);
        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                .code(200)
                .message("Product check completed")
                .result(isInWishlist)
                .build());
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearWishlist(@AuthenticationPrincipal User userPrincipal) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        wishlistService.clearWishlist(user);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Wishlist cleared successfully")
                .result(null)
                .build());
    }
}