package com.example.back_end.controller;

import com.example.back_end.dto.WishlistDTO;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.WishlistService;
import com.example.back_end.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {
    private final WishlistService wishlistService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<WishlistDTO>> getWishlist(@AuthenticationPrincipal User userPrincipal) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        WishlistDTO wishlistDTO = wishlistService.getWishlistByUser(user);
        return ResponseEntity.ok(ApiResponse.<WishlistDTO>builder()
                .code(200)
                .message("Wishlist retrieved successfully")
                .result(wishlistDTO)
                .build());
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<WishlistDTO>> addToWishlist(
            @AuthenticationPrincipal User userPrincipal,
            @RequestBody Map<String, Object> requestBody) {
        if (!requestBody.containsKey("productId")) {
            return ResponseEntity.badRequest().body(ApiResponse.<WishlistDTO>builder()
                    .code(400)
                    .message("Product ID is required")
                    .result(null)
                    .build());
        }

        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        Long productId = Long.valueOf(requestBody.get("productId").toString());
        WishlistDTO wishlistDTO = wishlistService.addToWishlist(user, productId);
        return ResponseEntity.ok(ApiResponse.<WishlistDTO>builder()
                .code(200)
                .message("Product added to wishlist")
                .result(wishlistDTO)
                .build());
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<WishlistDTO>> removeFromWishlist(
            @AuthenticationPrincipal User userPrincipal,
            @PathVariable Long productId) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        WishlistDTO wishlistDTO = wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok(ApiResponse.<WishlistDTO>builder()
                .code(200)
                .message("Product removed from wishlist")
                .result(wishlistDTO)
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