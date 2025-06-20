package com.example.back_end.service.impl;

import com.example.back_end.dto.ProductDTO;
import com.example.back_end.dto.ProductDetailDTO;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.ProductImage;
import com.example.back_end.repositories.ProductRepository;
import com.example.back_end.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public ProductDetailDTO getProductDetailById(Long id) {
        return productRepository.findById(id)
                .map(this::convertToDetailDTO)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public Page<ProductDTO> getProductsByCategory(String categoryName, Pageable pageable) {
        return productRepository.findByCategory_Name(categoryName, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<ProductDTO> searchProducts(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                .map(this::convertToDTO);
    }

    private ProductDTO convertToDTO(Product product) {
        List<String> imageUrls = product.getProductImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryName(product.getCategory().getName())
                .imageUrls(imageUrls)
                .build();
    }

    private ProductDetailDTO convertToDetailDTO(Product product) {
        List<String> allImages = product.getProductImages().stream()
                .sorted((img1, img2) -> {
                    // Sắp xếp theo thứ tự: ảnh chính trước, sau đó theo display_order
                    if (img1.getIsPrimary() != null && img1.getIsPrimary()) return -1;
                    if (img2.getIsPrimary() != null && img2.getIsPrimary()) return 1;
                    return Integer.compare(
                        img1.getDisplayOrder() != null ? img1.getDisplayOrder() : 0,
                        img2.getDisplayOrder() != null ? img2.getDisplayOrder() : 0
                    );
                })
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        // Lấy ảnh chính (ảnh đầu tiên hoặc ảnh có is_primary = true)
        String mainImage = allImages.isEmpty() ? null : allImages.get(0);

        // Lấy tất cả ảnh làm danh sách ảnh (bao gồm cả ảnh chính)
        List<String> additionalImages = allImages;

        return ProductDetailDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .shortDescription(product.getShortDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .stock(product.getStock())
                .brand(product.getBrand())
                .model(product.getModel())
                .weight(product.getWeight())
                .dimensions(product.getDimensions())
                .color(product.getColor())
                .material(product.getMaterial())
                .warrantyPeriod(product.getWarrantyPeriod())
                .specifications(product.getSpecifications())
                .features(product.getFeatures())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .imageUrls(allImages)
                .mainImage(mainImage)
                .additionalImages(additionalImages)
                .active(product.getActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
} 