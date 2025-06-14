package com.example.back_end.mapper;

import com.example.back_end.dto.UserDTO;
import com.example.back_end.entity.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CustomUserMapper {
    
    public UserDTO toUserDTO(User user) {
        if (user == null) {
            return null;
        }
        
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullname(user.getFullname())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatar(user.getAvatar())
                .active(user.getActive())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toSet()))
                .build();
    }
}