package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "wishlists")
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "wishlist", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WishlistItem> wishlistItems = new ArrayList<>();

    // Helper methods
    public void addItem(WishlistItem item) {
        wishlistItems.add(item);
        if (item != null) {
            item.setWishlist(this);
        }
    }

    public void removeItem(WishlistItem item) {
        wishlistItems.remove(item);
        if (item != null) {
            item.setWishlist(null);
        }
    }
}