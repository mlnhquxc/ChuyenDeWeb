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
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        // Lấy ảnh chính (ảnh đầu tiên)
        String mainImage = allImages.isEmpty() ? null : allImages.get(0);

        // Lấy cả 3 ảnh làm ảnh phụ
        List<String> additionalImages = allImages;

        return ProductDetailDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryName(product.getCategory().getName())
                .imageUrls(allImages)
                .mainImage(mainImage)
                .additionalImages(additionalImages)
                .build();
    }
} 