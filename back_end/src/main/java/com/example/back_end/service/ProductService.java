package com.example.back_end.service;

import com.example.back_end.dto.ProductDTO;
import com.example.back_end.dto.ProductDetailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<ProductDTO> getAllProducts(Pageable pageable);
    ProductDTO getProductById(Long id);
    ProductDetailDTO getProductDetailById(Long id);
    Page<ProductDTO> getProductsByCategory(String categoryName, Pageable pageable);
    Page<ProductDTO> searchProducts(String keyword, Pageable pageable);
} 