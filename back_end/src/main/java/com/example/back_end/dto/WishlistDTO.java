package com.example.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistDTO {
    private Long id;
    private Integer userId;
    private String username;
    private List<WishlistItemDTO> items;
    private int totalItems;
}