package com.example.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String categoryName;
    private List<String> imageUrls;
    private String mainImage; // Ảnh chính
    private List<String> additionalImages; // Danh sách ảnh phụ (tối đa 3 ảnh)
} 