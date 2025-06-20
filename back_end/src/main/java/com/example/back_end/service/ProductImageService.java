package com.example.back_end.service;

import com.example.back_end.entity.Product;
import com.example.back_end.entity.ProductImage;
import com.example.back_end.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductImageService {

    private final FileUploadService fileUploadService;
    private final ProductRepository productRepository;

    public List<String> uploadProductImages(Long productId, List<MultipartFile> files) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<String> imageUrls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            try {
                String imageUrl = fileUploadService.uploadProductImage(file, productId.toString());
                imageUrls.add(imageUrl);
                
                // Create ProductImage entity
                ProductImage productImage = new ProductImage();
                productImage.setProduct(product);
                productImage.setImageUrl(imageUrl);
                
                // Add to product's images list
                if (product.getProductImages() == null) {
                    product.setProductImages(new ArrayList<>());
                }
                product.getProductImages().add(productImage);
                
            } catch (Exception e) {
                log.error("Failed to upload image for product {}: {}", productId, e.getMessage());
            }
        }
        
        productRepository.save(product);
        log.info("Successfully uploaded {} images for product {}", imageUrls.size(), productId);
        
        return imageUrls;
    }

    public void deleteProductImage(Long productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Remove from database
        product.getProductImages().removeIf(img -> img.getImageUrl().equals(imageUrl));
        productRepository.save(product);

        // Delete from storage
        fileUploadService.deleteImage(imageUrl);
        
        log.info("Successfully deleted image {} for product {}", imageUrl, productId);
    }
}