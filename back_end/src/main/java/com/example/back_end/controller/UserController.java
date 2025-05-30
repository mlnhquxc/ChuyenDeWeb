package com.example.back_end.controller;

import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.User;
import com.example.back_end.service.UserService;
import com.nimbusds.jose.proc.SecurityContext;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
@Slf4j

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/createUser")
    ApiResponse<User> createUser(@RequestBody @Valid UserCreationRequest request){
        ApiResponse<User> response = new ApiResponse<>();
        response.setResult(userService.createRequest(request));
        return response;
    }
    @GetMapping
    List<User> getUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}",authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return userService.getUsers(); }
    @GetMapping("/{userId}")
    User getUserById(@PathVariable int userId) { return userService.findById(userId); }

    @GetMapping("/profile")
    ApiResponse<User> getProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = userService.findByEmail(authentication.getName());
        return ApiResponse.<User>builder().result(user).build();
    }

    @PutMapping("/update")
    ApiResponse<User> updateProfile(@RequestBody UserCreationRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var user = userService.updateProfile(authentication.getName(), request);
        return ApiResponse.<User>builder().result(user).build();
    }

    @PutMapping("/change-password")
    ApiResponse<Void> changePassword(@RequestBody Map<String, String> passwords) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        userService.changePassword(authentication.getName(), passwords.get("oldPassword"), passwords.get("newPassword"));
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/upload-avatar")
    ApiResponse<String> uploadAvatar(@RequestParam("avatar") MultipartFile file) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var avatarUrl = userService.uploadAvatar(authentication.getName(), file);
        return ApiResponse.<String>builder().result(avatarUrl).build();
    }
}
