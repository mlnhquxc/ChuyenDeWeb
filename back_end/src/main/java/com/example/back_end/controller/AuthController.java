package com.example.back_end.controller;

import com.example.back_end.dto.request.ChangePasswordRequest;
import com.example.back_end.dto.request.ForgotPasswordRequest;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.ResetPasswordRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.request.VerifyOtpRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.ChangePasswordResponse;
import com.example.back_end.dto.response.ForgotPasswordResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.dto.response.ResetPasswordResponse;
import com.example.back_end.dto.response.VerifyOtpResponse;
import com.example.back_end.service.TokenStorageService;
import com.example.back_end.service.UserService;
import com.example.back_end.service.EmailVerificationService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.back_end.exception.AppException;
import com.example.back_end.entity.User;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {
    private final UserService userService;
    private final TokenStorageService tokenStorageService;
    private final EmailVerificationService emailVerificationService;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody @Valid UserCreationRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        try {
            com.example.back_end.entity.User user = userService.createRequest(request);
            log.info("User created successfully, verification email sent");
            
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .result("Registration successful! Please check your email to verify your account.")
                    .message("Registration successful")
                    .build());
        } catch (AppException e) {
            log.error("Registration failed: {}", e.getErrorCode().getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<String>builder()
                            .message(e.getErrorCode().getMessage())
                            .build());
        } catch (Exception e) {
            log.error("Unexpected error during registration: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<String>builder()
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
    
    /**
     * Endpoint for forgot password request
     * @param request Forgot password request with email
     * @return Response with success status and message
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        log.info("Received forgot password request for email: {}", request.getEmail());
        
        ForgotPasswordResponse response = userService.processForgotPassword(request.getEmail());
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.<ForgotPasswordResponse>builder()
                    .code(0)
                    .result(response)
                    .message("OTP sent successfully")
                    .build());
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.<ForgotPasswordResponse>builder()
                    .code(400)
                    .result(response)
                    .message(response.getMessage())
                    .build());
        }
    }
    
    /**
     * Endpoint for OTP verification
     * @param request Verify OTP request with email and OTP
     * @return Response with success status and message
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyOtp(@RequestBody @Valid VerifyOtpRequest request) {
        log.info("Received OTP verification request for email: {}", request.getEmail());
        
        VerifyOtpResponse response = userService.verifyOtp(request.getEmail(), request.getOtp());
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.<VerifyOtpResponse>builder()
                    .code(0)
                    .result(response)
                    .message("OTP verified successfully")
                    .build());
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.<VerifyOtpResponse>builder()
                    .code(400)
                    .result(response)
                    .message(response.getMessage())
                    .build());
        }
    }
    
    /**
     * Endpoint for password reset
     * @param request Reset password request with email, OTP, and new password
     * @return Response with success status and message
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<ResetPasswordResponse>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        log.info("Received password reset request for email: {} with OTP: {}", request.getEmail(), request.getOtp());
        
        ResetPasswordResponse response = userService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );
        
        log.info("Password reset response: {}", response);
        
        if (response.isSuccess()) {
            log.info("Password reset successful for email: {}", request.getEmail());
            return ResponseEntity.ok(ApiResponse.<ResetPasswordResponse>builder()
                    .code(0)
                    .result(response)
                    .message("Password reset successfully")
                    .build());
        } else {
            log.warn("Password reset failed for email: {}, reason: {}", request.getEmail(), response.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.<ResetPasswordResponse>builder()
                    .code(400)
                    .result(response)
                    .message(response.getMessage())
                    .build());
        }
    }
    
    /**
     * Endpoint for email verification
     * @param token Email verification token
     * @return Response with success status and message
     */
    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam("token") String token) {
        log.info("Received email verification request");
        try {
            String message = emailVerificationService.verifyEmail(token);
            
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .code(0)
                    .result(message)
                    .message("Email verified successfully")
                    .build());
        } catch (AppException e) {
            log.error("Email verification failed: {}", e.getErrorCode().getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(400)
                    .result("Email verification failed")
                    .message(e.getErrorCode().getMessage())
                    .build());
        } catch (Exception e) {
            log.error("Unexpected error during email verification: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<String>builder()
                            .code(500)
                            .result("Email verification failed")
                            .message("An unexpected error occurred")
                            .build());
        }
    }
    
    /**
     * Endpoint for resending verification email
     * @param request Map containing email
     * @return Response with success status and message
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<String>> resendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        log.info("Received resend verification request for email: {}", email);
        
        try {
            emailVerificationService.resendVerificationEmail(email);
            
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .code(0)
                    .result("Verification email sent successfully")
                    .message("Please check your email")
                    .build());
        } catch (AppException e) {
            log.error("Resend verification failed: {}", e.getErrorCode().getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(400)
                    .result("Failed to send verification email")
                    .message(e.getErrorCode().getMessage())
                    .build());
        } catch (Exception e) {
            log.error("Unexpected error during resend verification: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.<String>builder()
                            .code(500)
                            .result("Failed to send verification email")
                            .message("An unexpected error occurred")
                            .build());

        }
    }
}
