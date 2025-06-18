package com.example.back_end.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class FileStorageConfig {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(uploadDir);
            System.out.println("Initializing upload directory: " + path.toAbsolutePath());
            
            if (!Files.exists(path)) {
                System.out.println("Creating upload directory: " + path.toAbsolutePath());
                Files.createDirectories(path);
                System.out.println("Upload directory created successfully");
            } else {
                System.out.println("Upload directory already exists");
                
                // Kiểm tra nội dung thư mục
                System.out.println("Checking upload directory contents:");
                try (var stream = Files.list(path)) {
                    stream.forEach(file -> {
                        try {
                            System.out.println("  - " + file.getFileName() + " (" + Files.size(file) + " bytes)");
                        } catch (IOException e) {
                            System.out.println("  - " + file.getFileName() + " (error getting size)");
                        }
                    });
                }
            }
            
            // Ensure the directory is writable
            if (!Files.isWritable(path)) {
                System.out.println("WARNING: Upload directory is not writable: " + path.toAbsolutePath());
            } else {
                System.out.println("Upload directory is writable");
            }
            
            // Kiểm tra URL cấu hình
            System.out.println("Upload URL configured as: " + System.getProperty("app.upload.url", "Not set in system properties"));
        } catch (Exception e) {
            System.err.println("Could not initialize upload directory: " + e.getMessage());
            e.printStackTrace();
        }
    }
}