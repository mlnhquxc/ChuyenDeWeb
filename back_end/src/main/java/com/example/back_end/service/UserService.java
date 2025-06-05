package com.example.back_end.service;

import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

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

    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;

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
            String encryptedPS = passwordEncoder.encode(request.getPassword());
            request.setPassword(encryptedPS);
            
            User user = userMapper.toUser(request);
            user.setActive(true);
            
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
            return savedUser;
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);

        return IntrospectResponse.builder().valid(verified && expiryTime.after(new Date())).build();
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

            String email = jwtService.validateToken(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String scope = buildScope(user);
            String newToken = jwtService.generateToken(user.getEmail(), scope);

            return AuthenticationResponse.builder()
                    .token(newToken)
                    .authenticated(true)
                    .user(userMapper.toUserResponse(user))
                    .build();
        } catch (ParseException | JOSEException e) {
            throw new RuntimeException("Invalid token");
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public User updateProfile(String email, UserCreationRequest request) {
        User user = findByEmail(email);
        
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new AppException(ErrorCode.USER_EXISTED);
            }
            user.setUsername(request.getUsername());
        }
        
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new AppException(ErrorCode.USER_EXISTED);
            }
            user.setEmail(request.getEmail());
        }
        
        if (request.getFullname() != null) {
            user.setFullname(request.getFullname());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
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

    public String uploadAvatar(String email, MultipartFile file) {
        User user = findByEmail(email);
        
        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file to filesystem
            String uploadDir = "uploads/avatars/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            File destFile = new File(dir.getAbsolutePath() + File.separator + filename);
            file.transferTo(destFile);
            
            // Update user avatar URL
            String avatarUrl = "/uploads/avatars/" + filename;
            user.setAvatar(avatarUrl);
            userRepository.save(user);
            
            return avatarUrl;
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
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
}
