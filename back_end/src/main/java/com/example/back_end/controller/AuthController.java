package com.example.back_end.controller;

import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {
    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> register(@RequestBody @Valid UserCreationRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        try {
            User user = userService.createRequest(request);
            log.info("User created successfully, generating token");
            
            String scope = user.getRoles().stream()
                    .map(role -> role.getName())
                    .reduce((a, b) -> a + " " + b)
                    .orElse("");
            String token = userService.generateToken(user);
            var userResponse = userService.getUserMapper().toUserResponse(user);
            
            AuthenticationResponse authResponse = AuthenticationResponse.builder()
                    .token(token)
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
        AuthenticationResponse response = userService.login(credentials.get("email"), credentials.get("password"));
        return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                .result(response)
                .build());
    }

    @PostMapping("/introspect")
    public ResponseEntity<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        IntrospectResponse response = userService.introspect(request);
        return ResponseEntity.ok(ApiResponse.<IntrospectResponse>builder()
                .result(response)
                .build());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> refreshToken(@RequestHeader("Authorization") String token) {
        AuthenticationResponse response = userService.refreshToken(token);
        return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                .result(response)
                .build());
    }
}
