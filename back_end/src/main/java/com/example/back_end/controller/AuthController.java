package com.example.back_end.controller;

import com.example.back_end.dto.request.ForgotPasswordRequest;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.ResetPasswordRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.request.VerifyOtpRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.ForgotPasswordResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.dto.response.ResetPasswordResponse;
import com.example.back_end.dto.response.VerifyOtpResponse;
import com.example.back_end.service.TokenStorageService;
import com.example.back_end.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
     * Endpoint for account activation
     * @param request Map containing activation token
     * @return Response with success status and message
     */
    @PostMapping("/activate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> activateAccount(@RequestBody Map<String, String> request) {
        log.info("Received account activation request with data: {}", request);
        
        String token = request.get("token");
        if (token == null || token.isEmpty()) {
            log.error("Token is missing in the request");
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Token is required")
                    .build());
        }
        
        log.info("Calling userService.activateAccount with token: {}", token.substring(0, Math.min(20, token.length())) + "...");
        boolean success = userService.activateAccount(token);
        log.info("Account activation result: {}", success);
        
        if (success) {
            Map<String, Object> result = new HashMap<>();
            result.put("activated", true);
            
            log.info("Account activated successfully");
            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .code(0)
                    .result(result)
                    .message("Account activated successfully")
                    .build());
        } else {
            log.error("Failed to activate account");
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Failed to activate account. Token may be invalid or expired.")
                    .build());
        }
    }
    
    /**
     * Endpoint to check account activation status
     * @param request Map containing email
     * @return Response with activation status
     */
    /**
     * Endpoint to check current OTP for an email (for debugging only)
     * @param request Map containing email
     * @return Response with current OTP
     */
    @PostMapping("/check-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkCurrentOtp(@RequestBody Map<String, String> request) {
        log.info("Received check OTP request");
        
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Email is required")
                    .build());
        }
        
        try {
            // Get current OTP
            String currentOtp = userService.getCurrentOtp(email);
            
            Map<String, Object> result = new HashMap<>();
            result.put("email", email);
            result.put("otp", currentOtp);
            
            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .code(0)
                    .result(result)
                    .message(currentOtp != null ? "Current OTP retrieved" : "No valid OTP found")
                    .build());
        } catch (Exception e) {
            log.error("Error checking OTP: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Failed to check OTP: " + e.getMessage())
                    .build());
        }
    }
    
    @PostMapping("/check-activation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkActivationStatus(@RequestBody Map<String, String> request) {
        log.info("Received check activation status request");
        
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Email is required")
                    .build());
        }
        
        try {
            // Find user by email
            User user = userService.findByEmail(email);
            
            Map<String, Object> result = new HashMap<>();
            result.put("activated", user.getActive());
            
            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .code(0)
                    .result(result)
                    .message(user.getActive() ? "Account is activated" : "Account is not activated")
                    .build());
        } catch (Exception e) {
            log.error("Error checking activation status: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Failed to check activation status: " + e.getMessage())
                    .build());
        }
    }
    
    /**
     * Endpoint for direct account activation by email (for testing only)
     * @param request Map containing email
     * @return Response with success status and message
     */
    @PostMapping("/activate-by-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> activateByEmail(@RequestBody Map<String, String> request) {
        log.info("Received direct account activation request");
        
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Email is required")
                    .build());
        }
        
        try {
            // Find user by email
            User user = userService.findByEmail(email);
            
            // Activate account
            user.setActive(true);
            userService.saveUser(user);
            
            Map<String, Object> result = new HashMap<>();
            result.put("activated", true);
            
            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .code(0)
                    .result(result)
                    .message("Account activated successfully")
                    .build());
        } catch (Exception e) {
            log.error("Error activating account: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Failed to activate account: " + e.getMessage())
                    .build());
        }
    }
    
    /**
     * Endpoint to resend activation email
     * @param request Map containing email
     * @return Response with success status and message
     */
    @PostMapping("/resend-activation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resendActivation(@RequestBody Map<String, String> request) {
        log.info("Received resend activation request");
        
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Email is required")
                    .build());
        }
        
        boolean success = userService.resendActivation(email);
        
        if (success) {
            Map<String, Object> result = new HashMap<>();
            result.put("sent", true);
            
            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .code(0)
                    .result(result)
                    .message("Activation email sent successfully")
                    .build());
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.<Map<String, Object>>builder()
                    .code(400)
                    .message("Failed to send activation email. Account may already be activated or email is invalid.")
                    .build());
        }
    }
}
