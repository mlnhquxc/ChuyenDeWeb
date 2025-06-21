package com.example.back_end.service;

import com.example.back_end.entity.EmailVerificationToken;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repositories.EmailVerificationTokenRepository;
import com.example.back_end.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.LocalDateTime;
import com.nimbusds.jose.JOSEException;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailVerificationService {
    
    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    /**
     * Generate and send email verification token
     * @param user User to send verification email
     */
    @Transactional
    public void sendVerificationEmail(User user) {
        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);
        
        // Generate new token
        String token = jwtService.generateEmailVerificationToken(user.getEmail());
        
        // Create verification token entity
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24)) // 24 hours expiry
                .build();
        
        tokenRepository.save(verificationToken);
        
        // Send email
        emailService.sendEmailVerification(
                user.getEmail(),
                user.getFullname(),
                token,
                baseUrl
        );
        
        log.info("Verification email sent to user: {}", user.getEmail());
    }
    
    /**
     * Verify email using token
     * @param token Verification token
     * @return Success message
     */
    @Transactional
    public String verifyEmail(String token) {
        try {
            // Validate JWT token first
            String email = jwtService.validateEmailVerificationToken(token);
            
            // Find token in database
            EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
                    .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));
            
            // Check if token is expired
            if (verificationToken.isExpired()) {
                throw new AppException(ErrorCode.TOKEN_EXPIRED);
            }
            
            // Get the user
            User user = verificationToken.getUser();
            
            // Check if user is already active or token is already verified
            if (user.getActive() || verificationToken.isVerified()) {
                log.info("Email already verified for user: {}", user.getEmail());
                return "Email của bạn đã được xác thực trước đó. Bạn có thể đăng nhập ngay.";
            }
            
            // Verify the user
            user.setActive(true);
            userRepository.save(user);
            
            // Mark token as verified
            verificationToken.setVerifiedAt(LocalDateTime.now());
            tokenRepository.save(verificationToken);
            
            // Send confirmation email
            emailService.sendRegistrationConfirmationEmail(
                    user.getEmail(),
                    user.getFullname(),
                    user.getUsername()
            );
            
            log.info("Email verified successfully for user: {}", user.getEmail());
            return "Email verified successfully! You can now login to your account.";
            
        } catch (ParseException e) {
            log.error("Invalid token format: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_TOKEN);
        } catch (JOSEException e) {
            log.error("JWT processing error: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_TOKEN);
        } catch (Exception e) {
            log.error("Email verification failed: {}", e.getMessage());
            if (e instanceof AppException) {
                throw e;
            }
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }
    
    /**
     * Resend verification email
     * @param email User email
     */
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        if (user.getActive()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }
        
        sendVerificationEmail(user);
    }
    
    /**
     * Clean up expired tokens (runs every hour)
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Cleaning up expired verification tokens");
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}