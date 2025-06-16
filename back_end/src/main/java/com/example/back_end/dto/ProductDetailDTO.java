package com.example.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    private Long id;
    private String name;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private BigDecimal discountPercentage;
    private boolean onSale;
    private Integer stock;
    private boolean inStock;
    private String brand;
    private String model;
    private BigDecimal weight;
    private String dimensions;
    private String color;
    private String material;
    private Integer warrantyPeriod;
    private String specifications;
    private String features;
    private String categoryName;
    private Long categoryId;
    private List<ProductImageDTO> images;
    private String primaryImageUrl;
    private List<String> imageUrls;
    private String mainImage; // Ảnh chính
    private List<String> additionalImages; // Danh sách ảnh phụ (tối đa 3 ảnh)
    private List<ReviewDTO> reviews;
    private Double averageRating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductImageDTO {
        private Long id;
        private String imageUrl;
        private String altText;
        private Boolean isPrimary;
        private Integer displayOrder;
    }
} 