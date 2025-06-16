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
}