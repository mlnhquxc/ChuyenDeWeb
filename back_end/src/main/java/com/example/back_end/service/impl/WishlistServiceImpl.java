package com.example.back_end.service.impl;

import com.example.back_end.dto.WishlistDTO;
import com.example.back_end.dto.WishlistItemDTO;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.User;
import com.example.back_end.entity.Wishlist;
import com.example.back_end.entity.WishlistItem;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repositories.ProductRepository;
import com.example.back_end.repositories.WishlistItemRepository;
import com.example.back_end.repositories.WishlistRepository;
import com.example.back_end.service.WishlistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;

    @Override
    public WishlistDTO getWishlistByUser(User user) {
        Wishlist wishlist = getOrCreateWishlist(user);
        return convertToDTO(wishlist);
    }

    @Override
    @Transactional
    public WishlistDTO addToWishlist(User user, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Check if product is already in wishlist
        if (wishlistItemRepository.existsByWishlistAndProduct(wishlist, product)) {
            return convertToDTO(wishlist);
        }

        // Add product to wishlist
        WishlistItem wishlistItem = WishlistItem.builder()
                .wishlist(wishlist)
                .product(product)
                .addedDate(LocalDateTime.now())
                .build();

        wishlistItemRepository.save(wishlistItem);
        wishlist.getWishlistItems().add(wishlistItem);

        return convertToDTO(wishlist);
    }

    @Override
    @Transactional
    public WishlistDTO removeFromWishlist(User user, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Find and remove the wishlist item
        WishlistItem wishlistItem = wishlistItemRepository.findByWishlistAndProduct(wishlist, product)
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        wishlist.getWishlistItems().remove(wishlistItem);
        wishlistItemRepository.delete(wishlistItem);

        return convertToDTO(wishlist);
    }

    @Override
    public boolean isProductInWishlist(User user, Long productId) {
        Wishlist wishlist = wishlistRepository.findByUser(user).orElse(null);
        if (wishlist == null) {
            return false;
        }

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return false;
        }

        return wishlistItemRepository.existsByWishlistAndProduct(wishlist, product);
    }

    @Override
    @Transactional
    public void clearWishlist(User user) {
        Wishlist wishlist = wishlistRepository.findByUser(user).orElse(null);
        if (wishlist != null) {
            wishlist.getWishlistItems().clear();
            wishlistItemRepository.deleteAll(wishlist.getWishlistItems());
        }
    }

    private Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUser(user)
                .orElseGet(() -> {
                    Wishlist newWishlist = Wishlist.builder()
                            .user(user)
                            .wishlistItems(new ArrayList<>())
                            .build();
                    return wishlistRepository.save(newWishlist);
                });
    }

    private WishlistDTO convertToDTO(Wishlist wishlist) {
        List<WishlistItemDTO> itemDTOs = wishlist.getWishlistItems().stream()
                .map(item -> {
                    // Get the first product image URL, or use the simple image field as fallback
                    String productImage = null;
                    if (item.getProduct().getProductImages() != null && !item.getProduct().getProductImages().isEmpty()) {
                        productImage = item.getProduct().getProductImages().get(0).getImageUrl();
                    } else if (item.getProduct().getImage() != null) {
                        productImage = item.getProduct().getImage();
                    }
                    
                    return WishlistItemDTO.builder()
                            .id(item.getId())
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .productImage(productImage)
                            .productPrice(item.getProduct().getPrice())
                            .build();
                })
                .collect(Collectors.toList());

        return WishlistDTO.builder()
                .id(wishlist.getId())
                .userId(wishlist.getUser().getId())
                .username(wishlist.getUser().getUsername())
                .items(itemDTOs)
                .totalItems(itemDTOs.size())
                .build();
    }
}