package com.example.back_end.controller;

import com.example.back_end.dto.UserDTO;
import com.example.back_end.dto.request.ChangePasswordRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.ChangePasswordResponse;
import com.example.back_end.entity.User;
import com.example.back_end.mapper.CustomUserMapper;
import com.example.back_end.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private CustomUserMapper userMapper;

    @PostMapping("/createUser")
    ApiResponse<UserDTO> createUser(@RequestBody @Valid UserCreationRequest request){
        User user = userService.createRequest(request);
        UserDTO userDTO = userMapper.toUserDTO(user);
        return ApiResponse.<UserDTO>builder()
                .code(200)
                .message("User created successfully")
                .result(userDTO)
                .build();
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<List<UserDTO>> getUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}", authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        
        List<User> users = userService.getUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(userMapper::toUserDTO)
                .collect(Collectors.toList());
        
        return ApiResponse.<List<UserDTO>>builder()
                .code(200)
                .message("Users retrieved successfully")
                .result(userDTOs)
                .build();
    }
    
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<UserDTO> getUserById(@PathVariable int userId) {
        User user = userService.findById(userId);
        UserDTO userDTO = userMapper.toUserDTO(user);
        
        return ApiResponse.<UserDTO>builder()
                .code(200)
                .message("User retrieved successfully")
                .result(userDTO)
                .build();
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    ApiResponse<UserDTO> getProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = userService.findByUsername(authentication.getName());
        UserDTO userDTO = userMapper.toUserDTO(user);
        
        return ApiResponse.<UserDTO>builder()
                .code(200)
                .message("Profile retrieved successfully")
                .result(userDTO)
                .build();
    }

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    ApiResponse<UserDTO> updateProfile(@RequestBody UserCreationRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = userService.updateProfile(authentication.getName(), request);
        UserDTO userDTO = userMapper.toUserDTO(user);
        
        return ApiResponse.<UserDTO>builder()
                .code(200)
                .message("Profile updated successfully")
                .result(userDTO)
                .build();
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    ApiResponse<ChangePasswordResponse> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        ChangePasswordResponse response = userService.changePassword(authentication.getName(), request);
        
        if (response.isSuccess()) {
            return ApiResponse.<ChangePasswordResponse>builder()
                    .code(200)
                    .message("Password changed successfully")
                    .result(response)
                    .build();
        } else {
            return ApiResponse.<ChangePasswordResponse>builder()
                    .code(400)
                    .message(response.getMessage())
                    .result(response)
                    .build();
        }
    }

    @PostMapping("/upload-avatar")
    @PreAuthorize("isAuthenticated()")
    ApiResponse<String> uploadAvatar(@RequestParam("avatar") MultipartFile file) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var avatarUrl = userService.uploadAvatar(authentication.getName(), file);
        
        return ApiResponse.<String>builder()
                .code(200)
                .message("Avatar uploaded successfully")
                .result(avatarUrl)
                .build();
    }
}
