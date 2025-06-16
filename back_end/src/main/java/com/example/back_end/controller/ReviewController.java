package com.example.back_end.controller;

import com.example.back_end.dto.ReviewDTO;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Review;
import com.example.back_end.mapper.ReviewMapper;
import com.example.back_end.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {
    private final ReviewService reviewService;
    private final ReviewMapper reviewMapper;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getReviewsByProductId(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(reviewMapper::toReviewDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.<List<ReviewDTO>>builder()
                .code(200)
                .message("Reviews retrieved successfully")
                .result(reviewDTOs)
                .build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getReviewsByUserId(@PathVariable Integer userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(reviewMapper::toReviewDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.<List<ReviewDTO>>builder()
                .code(200)
                .message("Reviews retrieved successfully")
                .result(reviewDTOs)
                .build());
    }

    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<ApiResponse<Double>> getAverageRatingByProductId(@PathVariable Long productId) {
        Double averageRating = reviewService.getAverageRatingByProductId(productId);
        
        return ResponseEntity.ok(ApiResponse.<Double>builder()
                .code(200)
                .message("Average rating retrieved successfully")
                .result(averageRating)
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(@RequestBody Map<String, Object> requestBody) {
        Integer userId = Integer.valueOf(requestBody.get("userId").toString());
        Long productId = Long.valueOf(requestBody.get("productId").toString());
        Integer rating = Integer.valueOf(requestBody.get("rating").toString());
        String comment = requestBody.get("comment").toString();
        
        Review review = reviewService.createReview(userId, productId, rating, comment);
        ReviewDTO reviewDTO = reviewMapper.toReviewDTO(review);
        
        return ResponseEntity.ok(ApiResponse.<ReviewDTO>builder()
                .code(200)
                .message("Review created successfully")
                .result(reviewDTO)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewDTO>> updateReview(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestBody) {
        Integer rating = Integer.valueOf(requestBody.get("rating").toString());
        String comment = requestBody.get("comment").toString();
        
        Review review = reviewService.updateReview(id, rating, comment);
        ReviewDTO reviewDTO = reviewMapper.toReviewDTO(review);
        
        return ResponseEntity.ok(ApiResponse.<ReviewDTO>builder()
                .code(200)
                .message("Review updated successfully")
                .result(reviewDTO)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Review deleted successfully")
                .result(null)
                .build());
    }
} 