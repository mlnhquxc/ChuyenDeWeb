package com.example.back_end.mapper;

import com.example.back_end.dto.ReviewDTO;
import com.example.back_end.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewDTO toReviewDTO(Review review) {
        if (review == null) {
            return null;
        }

        return ReviewDTO.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .username(review.getUser().getUsername())
                .userAvatar(review.getUser().getAvatar())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getReviewDate())
                .updatedAt(review.getReviewDate()) // Using reviewDate for both since there's no separate updatedAt field
                .build();
    }
}