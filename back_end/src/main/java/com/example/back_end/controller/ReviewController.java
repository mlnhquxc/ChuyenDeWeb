package com.example.back_end.controller;

import com.example.back_end.entity.Review;
import com.example.back_end.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getAverageRatingByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(
            @RequestParam Integer userId,
            @RequestParam Long productId,
            @RequestParam Integer rating,
            @RequestParam String comment) {
        return ResponseEntity.ok(reviewService.createReview(userId, productId, rating, comment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long id,
            @RequestParam Integer rating,
            @RequestParam String comment) {
        return ResponseEntity.ok(reviewService.updateReview(id, rating, comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
} 