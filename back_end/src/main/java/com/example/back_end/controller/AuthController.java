package com.example.back_end.controller;

import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.service.TokenStorageService;
import com.example.back_end.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.User;
import com.example.back_end.exception.AppException;

import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {
    private final UserService userService;
    private final TokenStorageService tokenStorageService;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> register(@RequestBody @Valid UserCreationRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        try {
            com.example.back_end.entity.User user = userService.createRequest(request);
            log.info("User created successfully");
            
            var userResponse = userService.getUserMapper().toUserResponse(user);
            
            AuthenticationResponse authResponse = AuthenticationResponse.builder()
                    .authenticated(true)
                    .user(userResponse)
                    .build();
            
            log.info("Registration successful for user: {}", user.getEmail());
            return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                    .result(authResponse)
                    .message("Registration successful")
                    .build());
        } catch (AppException e) {
            log.error("Registration failed: {}", e.getErrorCode().getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<AuthenticationResponse>builder()
                            .message(e.getErrorCode().getMessage())
                            .build());
        } catch (Exception e) {
            log.error("Unexpected error during registration: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<AuthenticationResponse>builder()
                            .message("An unexpected error occurred")
                            .build());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody Map<String, String> credentials) {
        log.info("Received login request for username: {}", credentials.get("username"));
        try {
            // Xóa token cũ nếu có
            tokenStorageService.removeToken(credentials.get("username"));
            
            // Tạo token mới
            AuthenticationResponse response = userService.login(credentials.get("username"), credentials.get("password"));
            
            // Lưu token mới vào storage
            tokenStorageService.storeToken(credentials.get("username"), response.getToken());
            
            log.info("Login successful for username: {}", credentials.get("username"));
            return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                    .code(0)
                    .result(response)
                    .build());
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(401)
                    .body(ApiResponse.<AuthenticationResponse>builder()
                            .code(401)
                            .message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token) {
        try {
            String username = userService.validateToken(token.substring(7));
            tokenStorageService.removeToken(username);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .message("Logout successful")
                    .build());
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Void>builder()
                            .message("Logout failed")
                            .build());
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> refreshToken(@RequestHeader("Authorization") String token) {
        try {
            log.info("Received refresh token request");
            
            AuthenticationResponse response = userService.refreshToken(token);
            
            // Update token in storage using username from the response
            tokenStorageService.storeToken(response.getUser().getUsername(), response.getToken());
            
            log.info("Token refresh successful for user: {}", response.getUser().getUsername());
            return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                    .code(0)
                    .result(response)
                    .build());
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(401)
                    .body(ApiResponse.<AuthenticationResponse>builder()
                            .code(401)
                            .message("Token refresh failed")
                            .build());
        }
    }

    @PostMapping("/introspect")
    public ResponseEntity<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        IntrospectResponse response = userService.introspect(request);
        return ResponseEntity.ok(ApiResponse.<IntrospectResponse>builder()
                .result(response)
                .build());
    }
}
