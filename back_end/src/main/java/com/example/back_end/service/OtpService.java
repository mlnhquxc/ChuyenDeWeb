package com.example.back_end.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class OtpService {
    // Store OTPs with expiration time (email -> [otp, expiration time])
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    
    // OTP validity period in minutes
    private static final int OTP_VALIDITY_MINUTES = 5;
    
    // OTP length
    private static final int OTP_LENGTH = 6;
    
    /**
     * Generate a new OTP for the given email
     * @param email User email
     * @return Generated OTP
     */
    public String generateOtp(String email) {
        String otp = generateRandomOtp(OTP_LENGTH);
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES);
        
        otpStorage.put(email, new OtpData(otp, expiryTime));
        log.info("Generated OTP for email: {}", email);
        
        return otp;
    }
    
    /**
     * Verify if the provided OTP is valid for the given email
     * @param email User email
     * @param otp OTP to verify
     * @return true if OTP is valid, false otherwise
     */
    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        
        if (otpData == null) {
            log.warn("No OTP found for email: {}", email);
            return false;
        }
        
        if (LocalDateTime.now().isAfter(otpData.getExpiryTime())) {
            log.warn("OTP expired for email: {}", email);
            otpStorage.remove(email);
            return false;
        }
        
        boolean isValid = otpData.getOtp().equals(otp);
        if (isValid) {
            log.info("OTP verified successfully for email: {}", email);
        } else {
            log.warn("Invalid OTP provided for email: {}", email);
        }
        
        return isValid;
    }
    
    /**
     * Invalidate OTP for the given email after successful password reset
     * @param email User email
     */
    public void invalidateOtp(String email) {
        otpStorage.remove(email);
        log.info("Invalidated OTP for email: {}", email);
    }
    
    /**
     * Generate a random numeric OTP of specified length
     * @param length OTP length
     * @return Random OTP
     */
    private String generateRandomOtp(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }
    
    /**
     * Inner class to store OTP data with expiration time
     */
    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;
        
        public OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
        
        public String getOtp() {
            return otp;
        }
        
        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}