package com.example.back_end.service;

import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.ForgotPasswordResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.dto.response.ResetPasswordResponse;
import com.example.back_end.dto.response.UserResponse;
import com.example.back_end.dto.response.VerifyOtpResponse;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.UserMapper;
import com.example.back_end.repositories.RoleRepository;
import com.example.back_end.repositories.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final EmailService emailService;

    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Autowired
    private TokenStorageService tokenStorageService;

    public User createRequest(UserCreationRequest request) {
        log.info("Creating new user with email: {} and username: {}", request.getEmail(), request.getUsername());
        
        // Validate username
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            log.error("Username is empty");
            throw new AppException(ErrorCode.INVALID_USERNAME);
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            log.error("Username already exists: {}", request.getUsername());
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        
        // Validate email
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            log.error("Email is empty");
            throw new AppException(ErrorCode.INVALID_EMAIL);
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.error("Email already exists: {}", request.getEmail());
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        
        // Validate password
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            log.error("Password is empty");
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }
        if (request.getPassword().length() < 6) {
            log.error("Password is too short");
            throw new AppException(ErrorCode.PASSWORD_TOO_SHORT);
        }
        
        // Validate fullname
        if (request.getFullname() == null || request.getFullname().trim().isEmpty()) {
            log.error("Fullname is empty");
            throw new AppException(ErrorCode.INVALID_FULLNAME);
        }
        
        try {
            // Store original password for email
            String originalPassword = request.getPassword();
            
            // Encrypt password for storage
            String encryptedPS = passwordEncoder.encode(request.getPassword());
            request.setPassword(encryptedPS);
            
            User user = userMapper.toUser(request);
            // Đặt active = false (0 trong MySQL) để yêu cầu kích hoạt tài khoản
            user.setActive(false);
            
            HashSet<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findById(PredefinedRole.USER_ROLE)
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name(PredefinedRole.USER_ROLE)
                            .description("User role")
                            .build()));
            roles.add(userRole);
            user.setRoles(roles);

            User savedUser = userRepository.save(user);
            userRepository.flush();
            log.info("User created successfully with id: {} and username: {}", savedUser.getId(), savedUser.getUsername());
            
            // Tạo token kích hoạt
            String activationToken = generateActivationToken(savedUser);
            
            // Gửi email kích hoạt tài khoản
            sendActivationEmail(
                savedUser.getEmail(),
                savedUser.getFullname(),
                savedUser.getUsername(),
                activationToken
            );
            
            return savedUser;
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        try {
            String username = validateToken(token);
            boolean isActive = tokenStorageService.isTokenValid(username, token);
            if (isActive) {
                User user = findByUsername(username);
                UserResponse userResponse = userMapper.toUserResponse(user);
                return IntrospectResponse.builder().valid(true).user(userResponse).build();
            } else {
                return IntrospectResponse.builder().valid(false).build();
            }
        } catch (Exception e) {
            return IntrospectResponse.builder().valid(false).build();
        }
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<User> getUsers() {
        log.info("In method at User");
        return userRepository.findAll();
    }

    public User findById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public AuthenticationResponse login(String username, String password) {
        log.info("Attempting login for username: {}", username);
        try {
            // Log all users for debugging
            log.info("All users in database: {}", userRepository.findAll().stream()
                    .map(u -> String.format("username=%s, email=%s", u.getUsername(), u.getEmail()))
                    .collect(Collectors.joining(", ")));

            var user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        log.error("User not found with username: {}", username);
                        return new AppException(ErrorCode.USER_NOT_EXISTED);
                    });
            
            log.info("Found user: username={}, email={}", user.getUsername(), user.getEmail());
            
            if (!passwordEncoder.matches(password, user.getPassword())) {
                log.error("Invalid password for user: {}", username);
                throw new AppException(ErrorCode.INVALID_PASSWORD);
            }
            
            String scope = buildScope(user);
            String token = jwtService.generateToken(user.getUsername(), scope);
            var userResponse = userMapper.toUserResponse(user);
            
            log.info("Login successful for user: {}", username);
            return AuthenticationResponse.builder()
                    .token(token)
                    .authenticated(true)
                    .user(userResponse)
                    .build();
        } catch (AppException e) {
            log.error("Login failed: {}", e.getErrorCode().getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during login: {}", e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public UserMapper getUserMapper() {
        return userMapper;
    }

    public String generateToken(User user) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getUsername())
                    .issuer("CDWED.com")
                    .issueTime(new Date())
                    .expirationTime(new Date(
                            Instant.now().plus(24, ChronoUnit.HOURS).toEpochMilli()
                    ))
                    .claim("scope", buildScope(user))
                    .build();

            Payload payload = new Payload(jwtClaimsSet.toJSONObject());
            JWSObject jwsObject = new JWSObject(header, payload);
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> stringJoiner.add(role.getName()));
        }
        return stringJoiner.toString();
    }

    public AuthenticationResponse refreshToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Use the new refreshToken method that can handle expired tokens
            String newToken = jwtService.refreshToken(token);
            
            // Extract email from the new token to get user info
            String email = jwtService.validateToken(newToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return AuthenticationResponse.builder()
                    .token(newToken)
                    .authenticated(true)
                    .user(userMapper.toUserResponse(user))
                    .build();
        } catch (ParseException | JOSEException e) {
            log.error("Token refresh failed", e);
            throw new RuntimeException("Invalid token for refresh");
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
    
    /**
     * Save user to database
     * @param user User to save
     * @return Saved user
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User updateProfile(String username, UserCreationRequest request) {
        var user = findByUsername(username);
        user.setFullname(request.getFullname());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        return userRepository.save(user);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = findByEmail(email);
        
        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }



    public String validateToken(String token) throws ParseException, JOSEException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        
        if (!signedJWT.verify(verifier)) {
            throw new RuntimeException("Invalid token");
        }

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        if (expiryTime.before(new Date())) {
            throw new RuntimeException("Token expired");
        }

        return signedJWT.getJWTClaimsSet().getSubject();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName().replace("ROLE_", ""))
                        .toArray(String[]::new))
                .build();
    }
    
    /**
     * Process forgot password request
     * @param email User email
     * @return Response with success status and message
     */
    public ForgotPasswordResponse processForgotPassword(String email) {
        log.info("Processing forgot password request for email: {}", email);
        
        try {
            // Check if user exists with this email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.error("User not found with email: {}", email);
                        return new AppException(ErrorCode.USER_NOT_EXISTED);
                    });
            
            // Generate OTP
            String otp = otpService.generateOtp(email);
            
            // Send OTP to user's email
            emailService.sendOtpEmail(email, otp);
            
            return ForgotPasswordResponse.builder()
                    .success(true)
                    .message("OTP sent successfully to your email")
                    .build();
        } catch (AppException e) {
            log.error("Forgot password failed: {}", e.getErrorCode().getMessage());
            return ForgotPasswordResponse.builder()
                    .success(false)
                    .message(e.getErrorCode().getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error during forgot password: {}", e.getMessage());
            return ForgotPasswordResponse.builder()
                    .success(false)
                    .message("An unexpected error occurred")
                    .build();
        }
    }
    
    /**
     * Verify OTP for password reset
     * @param email User email
     * @param otp OTP to verify
     * @return Response with success status and message
     */
    public VerifyOtpResponse verifyOtp(String email, String otp) {
        log.info("Verifying OTP for email: {} with OTP: {}", email, otp);
        
        try {
            // Check if user exists with this email
            log.info("Finding user with email: {}", email);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.error("User not found with email: {}", email);
                        return new AppException(ErrorCode.USER_NOT_EXISTED);
                    });
            log.info("User found: {}", user.getUsername());
            
            // Verify OTP
            log.info("Calling otpService.verifyOtp with email: {} and OTP: {}", email, otp);
            boolean isValid = otpService.verifyOtp(email, otp);
            log.info("OTP verification result: {}", isValid);
            
            if (isValid) {
                log.info("OTP verified successfully for email: {}", email);
                return VerifyOtpResponse.builder()
                        .success(true)
                        .message("OTP verified successfully")
                        .build();
            } else {
                log.warn("Invalid or expired OTP for email: {}", email);
                return VerifyOtpResponse.builder()
                        .success(false)
                        .message("Invalid or expired OTP")
                        .build();
            }
        } catch (AppException e) {
            log.error("OTP verification failed: {}", e.getErrorCode().getMessage());
            return VerifyOtpResponse.builder()
                    .success(false)
                    .message(e.getErrorCode().getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error during OTP verification: {}", e.getMessage());
            return VerifyOtpResponse.builder()
                    .success(false)
                    .message("An unexpected error occurred")
                    .build();
        }
    }
    
    /**
     * Generate activation token for a user
     * @param user User to generate token for
     * @return Activation token
     */
    public String generateActivationToken(User user) {
        try {
            log.info("Generating activation token for user: {}", user.getUsername());
            
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getUsername())
                    .issuer("CDWED.com")
                    .issueTime(new Date())
                    .expirationTime(new Date(
                            Instant.now().plus(24, ChronoUnit.HOURS).toEpochMilli()
                    ))
                    .claim("email", user.getEmail())
                    .claim("type", "activation")
                    .build();
                    
            log.info("JWT claims set created with subject: {}, email: {}, type: activation", 
                    user.getUsername(), user.getEmail());

            Payload payload = new Payload(jwtClaimsSet.toJSONObject());
            JWSObject jwsObject = new JWSObject(header, payload);
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            
            String token = jwsObject.serialize();
            log.info("Activation token generated successfully: {}", token.substring(0, 20) + "...");
            
            return token;
        } catch (JOSEException e) {
            log.error("Error generating activation token: {}", e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
    
    /**
     * Send activation email to user
     * @param email User email
     * @param fullName User's full name
     * @param username Username
     * @param activationToken Activation token
     */
    @Async
    public void sendActivationEmail(String email, String fullName, String username, String activationToken) {
        try {
            log.info("Sending activation email to: {}", email);
            
            // Sử dụng URL từ cấu hình
            String baseUrl = frontendUrl;
            
            String activationUrl = baseUrl + "/activate?token=" + activationToken + "&email=" + email;
            
            // Gửi email kích hoạt
            emailService.sendActivationEmail(email, fullName, username, activationUrl);
            
            log.info("Activation email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send activation email: {}", e.getMessage());
            // Không throw exception vì đây không phải là lỗi nghiêm trọng
        }
    }
    
    /**
     * Activate user account
     * @param token Activation token
     * @return true if activation successful, false otherwise
     */
    public boolean activateAccount(String token) {
        try {
            log.info("Activating account with token: {}", token);
            
            // Verify token
            log.info("Verifying token with signer key: {}", SIGNER_KEY.substring(0, 10) + "...");
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            
            log.info("Parsing JWT token");
            SignedJWT signedJWT = SignedJWT.parse(token);
            
            log.info("Verifying JWT signature");
            if (!signedJWT.verify(verifier)) {
                log.error("Invalid activation token - signature verification failed");
                return false;
            }
            
            // Check if token is expired
            log.info("Checking token expiration");
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            Date currentTime = new Date();
            log.info("Token expiry time: {}, current time: {}", expiryTime, currentTime);
            
            if (expiryTime.before(currentTime)) {
                log.error("Activation token expired");
                return false;
            }
            
            // Check token type
            log.info("Checking token type");
            String tokenType = (String) signedJWT.getJWTClaimsSet().getClaim("type");
            log.info("Token type: {}", tokenType);
            
            if (!"activation".equals(tokenType)) {
                log.error("Invalid token type: {}", tokenType);
                return false;
            }
            
            // Get username from token
            String username = signedJWT.getJWTClaimsSet().getSubject();
            
            // Find user
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        log.error("User not found with username: {}", username);
                        return new AppException(ErrorCode.USER_NOT_EXISTED);
                    });
            
            // Activate account
            user.setActive(true);
            userRepository.save(user);
            
            log.info("Account activated successfully for user: {}", username);
            return true;
        } catch (Exception e) {
            log.error("Error activating account: {}", e.getMessage(), e);
            e.printStackTrace(); // In stack trace để debug
            return false;
        }
    }
    
    /**
     * Resend activation email
     * @param email User email
     * @return true if email sent successfully, false otherwise
     */
    public boolean resendActivation(String email) {
        try {
            log.info("Resending activation email to: {}", email);
            
            // Find user
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.error("User not found with email: {}", email);
                        return new AppException(ErrorCode.USER_NOT_EXISTED);
                    });
            
            // Check if account is already activated
            if (user.getActive()) {
                log.info("Account already activated for user: {}", user.getUsername());
                return false;
            }
            
            // Generate new activation token
            String activationToken = generateActivationToken(user);
            
            // Send activation email
            sendActivationEmail(
                user.getEmail(),
                user.getFullname(),
                user.getUsername(),
                activationToken
            );
            
            log.info("Activation email resent successfully to: {}", email);
            return true;
        } catch (Exception e) {
            log.error("Error resending activation email: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Get current OTP for the given email (for debugging purposes)
     * @param email User email
     * @return Current OTP or null if not found
     */
    public String getCurrentOtp(String email) {
        return otpService.getCurrentOtp(email);
    }
    
    /**
     * Reset password with OTP verification
     * @param email User email
     * @param otp OTP for verification
     * @param newPassword New password
     * @return Response with success status and message
     */
    public ResetPasswordResponse resetPassword(String email, String otp, String newPassword) {
        log.info("Resetting password for email: {} with OTP: {}", email, otp);
        
        try {
            // Check if user exists with this email
            log.info("Finding user with email: {}", email);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.error("User not found with email: {}", email);
                        return new AppException(ErrorCode.USER_NOT_EXISTED);
                    });
            log.info("User found: {}", user.getUsername());
            
            // Verify OTP
            log.info("Verifying OTP: {} for email: {}", otp, email);
            boolean isValid = otpService.verifyOtp(email, otp);
            log.info("OTP verification result: {}", isValid);
            
            if (!isValid) {
                log.warn("Invalid or expired OTP for email: {}", email);
                return ResetPasswordResponse.builder()
                        .success(false)
                        .message("Invalid or expired OTP")
                        .build();
            }
            
            // Validate new password
            log.info("Validating new password length");
            if (newPassword.length() < 8) {
                log.warn("Password too short for email: {}", email);
                return ResetPasswordResponse.builder()
                        .success(false)
                        .message("Password must be at least 8 characters long")
                        .build();
            }
            
            // Update password
            log.info("Updating password for user: {}", user.getUsername());
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            log.info("Password updated successfully for user: {}", user.getUsername());
            
            // Invalidate OTP
            log.info("Invalidating OTP for email: {}", email);
            otpService.invalidateOtp(email);
            
            // Send confirmation email
            log.info("Sending password reset confirmation email to: {}", email);
            emailService.sendPasswordResetConfirmationEmail(email);
            
            log.info("Password reset completed successfully for email: {}", email);
            return ResetPasswordResponse.builder()
                    .success(true)
                    .message("Password reset successfully")
                    .build();
        } catch (AppException e) {
            log.error("Password reset failed: {}", e.getErrorCode().getMessage());
            return ResetPasswordResponse.builder()
                    .success(false)
                    .message(e.getErrorCode().getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error during password reset: {}", e.getMessage());
            return ResetPasswordResponse.builder()
                    .success(false)
                    .message("An unexpected error occurred")
                    .build();
        }
    }
    
    /**
     * Upload avatar for user
     * @param username Username
     * @param file Avatar file
     * @return Avatar URL
     */
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @Value("${app.upload.url:http://localhost:8080/uploads}")
    private String uploadUrl;
    
    public String uploadAvatar(String username, MultipartFile file) {
        log.info("Uploading avatar for user: {}", username);
        
        try {
            // Find user
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        log.error("User not found with username: {}", username);
                        return new AppException(ErrorCode.USER_NOT_EXISTED);
                    });
            
            // Check if file is empty
            if (file.isEmpty()) {
                log.error("Empty file submitted for avatar upload");
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            
            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                log.error("Invalid file type for avatar: {}", contentType);
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            
            // Create upload directory if it doesn't exist
            File uploadPath = new File(uploadDir);
            log.info("Upload directory path: {}", uploadPath.getAbsolutePath());
            
            if (!uploadPath.exists()) {
                log.info("Creating upload directory: {}", uploadPath.getAbsolutePath());
                if (!uploadPath.mkdirs()) {
                    log.error("Failed to create upload directory");
                    throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
                }
            } else {
                log.info("Upload directory already exists");
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = "avatar_" + username + "_" + UUID.randomUUID() + fileExtension;
            
            // Save file
            File destFile = new File(uploadPath.getAbsolutePath() + File.separator + filename);
            log.info("Saving avatar to: {}", destFile.getAbsolutePath());
            
            try {
                file.transferTo(destFile);
                log.info("File saved successfully to: {}", destFile.getAbsolutePath());
                
                // Verify file was saved
                if (!destFile.exists() || destFile.length() == 0) {
                    log.error("File was not saved properly: {}", destFile.getAbsolutePath());
                    throw new IOException("File was not saved properly");
                }
            } catch (IOException e) {
                log.error("Error saving file: {}", e.getMessage());
                throw e;
            }
            
            // Update user avatar URL - use relative path for better compatibility
            String avatarUrl = "/uploads/" + filename;
            log.info("Setting avatar URL for user: {}, URL: {}", username, avatarUrl);
            
            // Log the absolute URL for debugging
            String absoluteUrl = uploadUrl + "/" + filename;
            log.info("Absolute URL would be: {}", absoluteUrl);
            
            user.setAvatar(avatarUrl);
            userRepository.save(user);
            
            log.info("Avatar uploaded successfully for user: {}, URL: {}", username, avatarUrl);
            return avatarUrl;
        } catch (AppException e) {
            log.error("Avatar upload failed: {}", e.getErrorCode().getMessage());
            throw e;
        } catch (IOException e) {
            log.error("IO error during avatar upload: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Unexpected error during avatar upload: {}", e.getMessage());
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
