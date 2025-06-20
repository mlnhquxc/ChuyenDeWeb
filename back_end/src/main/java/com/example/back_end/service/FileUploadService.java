package com.example.back_end.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileUploadService {

    private final Cloudinary cloudinary;

    @Value("${file.upload.strategy:hybrid}")
    private String uploadStrategy;

    public String uploadAvatar(MultipartFile file, String username) {
        validateFile(file);
        
        switch (uploadStrategy.toLowerCase()) {
            case "cloudinary":
                return uploadToCloudinary(file, username);
            case "local":
                return uploadToLocal(file);
            case "hybrid":
            default:
                return uploadHybrid(file, username);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }

        // Check file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }
    }

    private String uploadToCloudinary(MultipartFile file, String username) {
        try {
            // Create unique public_id for the image
            String publicId = "avatars/" + username + "_" + System.currentTimeMillis();
            
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "tech_shop/avatars",
                "resource_type", "image",
                "width", 300,
                "height", 300,
                "crop", "fill",
                "gravity", "face",
                "quality", "auto",
                "format", "webp"
            );

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String cloudinaryUrl = (String) uploadResult.get("secure_url");
            
            log.info("Successfully uploaded avatar to Cloudinary: {}", cloudinaryUrl);
            return cloudinaryUrl;
            
        } catch (IOException e) {
            log.error("Failed to upload to Cloudinary: {}", e.getMessage());
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private String uploadToLocal(MultipartFile file) {
        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file to filesystem
            String uploadDir = "uploads/avatars/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            File destFile = new File(dir.getAbsolutePath() + File.separator + filename);
            file.transferTo(destFile);
            
            String localUrl = "/uploads/avatars/" + filename;
            log.info("Successfully uploaded avatar locally: {}", localUrl);
            return localUrl;
            
        } catch (IOException e) {
            log.error("Failed to upload locally: {}", e.getMessage());
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private String uploadHybrid(MultipartFile file, String username) {
        try {
            // Try Cloudinary first
            String cloudinaryUrl = uploadToCloudinary(file, username);
            
            // Also save locally as backup
            try {
                uploadToLocal(file);
                log.info("Successfully created local backup for avatar");
            } catch (Exception e) {
                log.warn("Failed to create local backup, but Cloudinary upload succeeded: {}", e.getMessage());
            }
            
            return cloudinaryUrl;
            
        } catch (Exception e) {
            log.warn("Cloudinary upload failed, falling back to local storage: {}", e.getMessage());
            // Fallback to local storage
            return uploadToLocal(file);
        }
    }

    public String uploadProductImage(MultipartFile file, String productId) {
        validateFile(file);
        
        try {
            String publicId = "products/" + productId + "_" + System.currentTimeMillis();
            
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "tech_shop/products",
                "resource_type", "image",
                "width", 800,
                "height", 600,
                "crop", "fill",
                "quality", "auto",
                "format", "webp"
            );

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String cloudinaryUrl = (String) uploadResult.get("secure_url");
            
            log.info("Successfully uploaded product image to Cloudinary: {}", cloudinaryUrl);
            return cloudinaryUrl;
            
        } catch (IOException e) {
            log.error("Failed to upload product image: {}", e.getMessage());
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }

        try {
            // Extract public_id from Cloudinary URL
            if (imageUrl.contains("cloudinary.com")) {
                String[] parts = imageUrl.split("/");
                String publicIdWithExtension = parts[parts.length - 1];
                String publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
                
                // Find the folder part
                for (int i = 0; i < parts.length; i++) {
                    if (parts[i].equals("tech_shop")) {
                        publicId = "tech_shop/" + parts[i + 1] + "/" + publicId;
                        break;
                    }
                }
                
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Successfully deleted image from Cloudinary: {}", publicId);
            }
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary: {}", e.getMessage());
        }
    }
}