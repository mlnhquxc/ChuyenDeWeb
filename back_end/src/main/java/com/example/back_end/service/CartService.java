package com.example.back_end.service;

import com.example.back_end.entity.Cart;
import com.example.back_end.entity.CartItem;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repositories.CartRepository;
import com.example.back_end.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public Cart getCartByUserId(Integer userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createCart(userId));
    }

    @Transactional
    public Cart createCart(Integer userId) {
        User user = userService.findById(userId);
        Cart cart = Cart.builder()
                .user(user)
                .cartItems(new ArrayList<>())
                .build();
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart addToCart(Integer userId, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }
        
        Cart cart = getCartByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cart.getCartItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItemQuantity(Integer userId, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }
        
        Cart cart = getCartByUserId(userId);
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        cartItem.setQuantity(quantity);
        return cartRepository.save(cart);
    }
    
    @Transactional
    public Cart updateCartItemQuantityById(Integer userId, Long cartItemId, Integer quantity) {
        if (quantity <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }
        
        Cart cart = getCartByUserId(userId);
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        cartItem.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(Integer userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        boolean removed = cart.getCartItems().removeIf(item -> item.getProduct().getId().equals(productId));
        
        if (!removed) {
            throw new AppException(ErrorCode.ITEM_NOT_FOUND);
        }
        
        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(Integer userId) {
        Cart cart = getCartByUserId(userId);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
} 