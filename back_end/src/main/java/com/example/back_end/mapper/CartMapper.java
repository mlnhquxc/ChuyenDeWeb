package com.example.back_end.mapper;

import com.example.back_end.dto.CartDTO;
import com.example.back_end.dto.CartItemDTO;
import com.example.back_end.entity.Cart;
import com.example.back_end.entity.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartDTO toCartDTO(Cart cart) {
        if (cart == null) {
            return null;
        }

        List<CartItemDTO> cartItemDTOs = cart.getCartItems() != null 
            ? cart.getCartItems().stream()
                .map(this::toCartItemDTO)
                .collect(Collectors.toList())
            : List.of();

        BigDecimal totalPrice = cartItemDTOs.stream()
            .map(CartItemDTO::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = cartItemDTOs.stream()
            .mapToInt(CartItemDTO::getQuantity)
            .sum();

        return CartDTO.builder()
            .id(cart.getId())
            .userId(cart.getUser().getId())
            .username(cart.getUser().getUsername())
            .items(cartItemDTOs)
            .totalPrice(totalPrice)
            .totalItems(totalItems)
            .build();
    }

    public CartItemDTO toCartItemDTO(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }

        BigDecimal subtotal = cartItem.getProduct().getPrice()
            .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        return CartItemDTO.builder()
            .id(cartItem.getId())
            .productId(cartItem.getProduct().getId())
            .productName(cartItem.getProduct().getName())
            .productImage(cartItem.getProduct().getImage())
            .productPrice(cartItem.getProduct().getPrice())
            .quantity(cartItem.getQuantity())
            .subtotal(subtotal)
            .build();
    }
}