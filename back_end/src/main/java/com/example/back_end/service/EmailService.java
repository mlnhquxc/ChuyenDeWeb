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
     * Send email verification link to user
     * @param to Recipient email
     * @param fullName User's full name
     * @param verificationToken Verification token
     * @param baseUrl Base URL of the application
     */
    @Async
    public void sendEmailVerification(String to, String fullName, String verificationToken, String baseUrl) {
        try {
            log.info("Sending email verification to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Xác thực tài khoản - Verify Your Account");
            
            String verificationUrl = "http://localhost:5173/verify-email?token=" + verificationToken;
            
            String emailContent = 
                "Xin chào " + fullName + ",\n\n" +
                "Cảm ơn bạn đã đăng ký tài khoản với chúng tôi!\n\n" +
                "Để hoàn tất quá trình đăng ký, vui lòng click vào link dưới đây để xác thực email của bạn:\n\n" +
                verificationUrl + "\n\n" +
                "Link này sẽ hết hạn sau 24 giờ.\n\n" +
                "Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ hỗ trợ";
            
            message.setText(emailContent);
            mailSender.send(message);
            
            log.info("Email verification sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email verification to: {}", to, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
    
    /**
     * Send registration confirmation email after successful verification
     * @param to Recipient email
     * @param fullName User's full name
     * @param username Username
     */
    @Async
    public void sendRegistrationConfirmationEmail(String to, String fullName, String username) {
        try {
            log.info("Sending registration confirmation email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Chào mừng bạn đến với hệ thống của chúng tôi!");
            
            String emailContent = 
                "Xin chào " + fullName + ",\n\n" +
                "Tài khoản của bạn đã được xác thực thành công!\n\n" +
                "Thông tin tài khoản:\n" +
                "Tên đăng nhập: " + username + "\n" +
                "Email: " + to + "\n\n" +
                "Bạn có thể đăng nhập vào hệ thống ngay bây giờ.\n\n" +
                "Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ.\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ hỗ trợ";
            
            message.setText(emailContent);
            mailSender.send(message);
            
            log.info("Registration confirmation email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send registration confirmation email to: {}", to, e);
            // We log the error but don't throw an exception as this is not critical for the registration flow
        }
    }
}