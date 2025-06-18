package com.example.back_end.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@example.com}")
    private String fromEmail;
    
    /**
     * Send OTP to user's email
     * @param to Recipient email
     * @param otp OTP to send
     */
    @Async
    public void sendOtpEmail(String to, String otp) {
        try {
            log.info("Sending OTP email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Password Reset OTP");
            message.setText("Your OTP for password reset is: " + otp + "\nThis OTP is valid for 5 minutes.");
            mailSender.send(message);
            
            log.info("OTP email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", to, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    
    /**
     * Send password reset confirmation email
     * @param to Recipient email
     */
    @Async
    public void sendPasswordResetConfirmationEmail(String to) {
        try {
            log.info("Sending password reset confirmation email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Password Reset Successful");
            message.setText("Your password has been reset successfully. If you did not request this change, please contact support immediately.");
            mailSender.send(message);
            
            log.info("Password reset confirmation email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset confirmation email to: {}", to, e);
            // We don't throw an exception here as this is not critical for the password reset flow
        }
    }
    
    /**
     * Send registration confirmation email with account details
     * @param to Recipient email
     * @param fullName User's full name
     * @param username Username
     * @param password Original password (not encrypted)
     */
    @Async
    public void sendRegistrationConfirmationEmail(String to, String fullName, String username, String password) {
        try {
            log.info("Sending registration confirmation email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Welcome to Our Platform - Registration Successful");
            
            String emailContent = 
                "Dear " + fullName + ",\n\n" +
                "Thank you for registering with our platform. Your account has been created successfully.\n\n" +
                "Here are your account details:\n" +
                "Username: " + username + "\n" +
                "Password: " + password + "\n\n" +
                "Please keep this information secure. We recommend changing your password after your first login.\n\n" +
                "If you have any questions or need assistance, please contact our support team.\n\n" +
                "Best regards,\n" +
                "The Team";
            
            message.setText(emailContent);
            mailSender.send(message);
            
            log.info("Registration confirmation email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send registration confirmation email to: {}", to, e);
            // We log the error but don't throw an exception as this is not critical for the registration flow
        }
    }
    
    /**
     * Send account activation email
     * @param to Recipient email
     * @param fullName User's full name
     * @param username Username
     * @param activationUrl Activation URL
     */
    @Async
    public void sendActivationEmail(String to, String fullName, String username, String activationUrl) {
        try {
            log.info("Sending activation email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Activate Your Account");
            
            String emailContent = 
                "Dear " + fullName + ",\n\n" +
                "Thank you for registering with our platform. To complete your registration, please activate your account by clicking the link below:\n\n" +
                activationUrl + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you did not register for an account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The Team";
            
            message.setText(emailContent);
            mailSender.send(message);
            
            log.info("Activation email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send activation email to: {}", to, e);
            // We log the error but don't throw an exception as this is not critical for the registration flow
        }
    }
}