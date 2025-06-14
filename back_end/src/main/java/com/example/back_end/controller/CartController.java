package com.example.back_end.controller;

import com.example.back_end.dto.CartDTO;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Cart;
import com.example.back_end.mapper.CartMapper;
import com.example.back_end.service.CartService;
import com.example.back_end.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    private final CartService cartService;
    private final UserService userService;
    private final CartMapper cartMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDTO>> getCart(@AuthenticationPrincipal User userPrincipal) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        Cart cart = cartService.getCartByUserId(user.getId());
        CartDTO cartDTO = cartMapper.toCartDTO(cart);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .code(200)
                .message("Cart retrieved successfully")
                .result(cartDTO)
                .build());
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartDTO>> addToCart(
            @AuthenticationPrincipal User userPrincipal,
            @RequestBody Map<String, Object> requestBody) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        Long productId = Long.valueOf(requestBody.get("productId").toString());
        Integer quantity = Integer.valueOf(requestBody.get("quantity").toString());
        Cart cart = cartService.addToCart(user.getId(), productId, quantity);
        CartDTO cartDTO = cartMapper.toCartDTO(cart);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .code(200)
                .message("Product added to cart")
                .result(cartDTO)
                .build());
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDTO>> updateCartItemQuantity(
            @AuthenticationPrincipal User userPrincipal,
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Object> requestBody) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        Integer quantity = Integer.valueOf(requestBody.get("quantity").toString());
        Cart cart = cartService.updateCartItemQuantity(user.getId(), cartItemId, quantity);
        CartDTO cartDTO = cartMapper.toCartDTO(cart);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .code(200)
                .message("Cart item updated")
                .result(cartDTO)
                .build());
    }
    
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartDTO>> updateCartItem(
            @AuthenticationPrincipal User userPrincipal,
            @RequestBody Map<String, Object> requestBody) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        
        // Check if cartItemId is provided in the request body
        Long cartItemId = null;
        if (requestBody.containsKey("cartItemId") && requestBody.get("cartItemId") != null) {
            cartItemId = Long.valueOf(requestBody.get("cartItemId").toString());
        } else if (requestBody.containsKey("id") && requestBody.get("id") != null) {
            // Try alternative field name
            cartItemId = Long.valueOf(requestBody.get("id").toString());
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.<CartDTO>builder()
                    .code(400)
                    .message("Cart item ID is required")
                    .result(null)
                    .build());
        }
        
        // Check if quantity is provided in the request body
        Integer quantity = null;
        if (requestBody.containsKey("quantity") && requestBody.get("quantity") != null) {
            quantity = Integer.valueOf(requestBody.get("quantity").toString());
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.<CartDTO>builder()
                    .code(400)
                    .message("Quantity is required")
                    .result(null)
                    .build());
        }
        
        Cart cart = cartService.updateCartItemQuantityById(user.getId(), cartItemId, quantity);
        CartDTO cartDTO = cartMapper.toCartDTO(cart);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .code(200)
                .message("Cart item updated")
                .result(cartDTO)
                .build());
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<CartDTO>> removeFromCart(
            @AuthenticationPrincipal User userPrincipal,
            @PathVariable Long productId) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        Cart cart = cartService.removeFromCart(user.getId(), productId);
        CartDTO cartDTO = cartMapper.toCartDTO(cart);
        return ResponseEntity.ok(ApiResponse.<CartDTO>builder()
                .code(200)
                .message("Product removed from cart")
                .result(cartDTO)
                .build());
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal User userPrincipal) {
        com.example.back_end.entity.User user = userService.findByUsername(userPrincipal.getUsername());
        cartService.clearCart(user.getId());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Cart cleared successfully")
                .result(null)
                .build());
    }
} 