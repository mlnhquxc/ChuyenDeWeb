package com.example.back_end.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cấu hình đường dẫn tĩnh cho việc truy cập các file đã upload
        String path = "file:" + System.getProperty("user.dir") + File.separator + uploadDir + File.separator;
        System.out.println("Configuring resource handler for uploads. Path: " + path);
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(path)
                .setCachePeriod(0) // Disable caching
                .resourceChain(false); // Disable resource chain
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}