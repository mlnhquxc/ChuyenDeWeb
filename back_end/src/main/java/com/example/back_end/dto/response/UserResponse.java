package com.example.back_end.dto.response;

import com.example.back_end.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer id;
    private String username;
    private String email;
    private String fullname;
    private String phone;
    private String address;
    private String avatar;
    private Set<Role> roles;
} 