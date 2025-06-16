package com.example.back_end.mapper;

import com.example.back_end.dto.WishlistDTO;
import com.example.back_end.dto.WishlistItemDTO;
import com.example.back_end.entity.Wishlist;
import com.example.back_end.entity.WishlistItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class WishlistMapper {

    public WishlistDTO toWishlistDTO(Wishlist wishlist) {
        if (wishlist == null) {
            return null;
        }

        List<WishlistItemDTO> wishlistItemDTOs = wishlist.getWishlistItems() != null 
            ? wishlist.getWishlistItems().stream()
                .map(this::toWishlistItemDTO)
                .collect(Collectors.toList())
            : List.of();

        int totalItems = wishlistItemDTOs.size();

        return WishlistDTO.builder()
            .id(wishlist.getId())
            .userId(wishlist.getUser().getId())
            .username(wishlist.getUser().getUsername())
            .items(wishlistItemDTOs)
            .totalItems(totalItems)
            .build();
    }

    public WishlistItemDTO toWishlistItemDTO(WishlistItem wishlistItem) {
        if (wishlistItem == null) {
            return null;
        }

        // Lấy ảnh đầu tiên từ danh sách ảnh của sản phẩm
        String productImage = wishlistItem.getProduct().getProductImages().isEmpty() 
            ? wishlistItem.getProduct().getImage() // Fallback to old image field if no product images
            : wishlistItem.getProduct().getProductImages().get(0).getImageUrl();

        return WishlistItemDTO.builder()
            .id(wishlistItem.getId())
            .productId(wishlistItem.getProduct().getId())
            .productName(wishlistItem.getProduct().getName())
            .productImage(productImage)
            .productPrice(wishlistItem.getProduct().getPrice())
            .build();
    }
} 