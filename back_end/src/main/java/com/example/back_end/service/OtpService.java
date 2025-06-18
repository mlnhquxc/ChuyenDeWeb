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
    // Sử dụng static để đảm bảo OTP được lưu trữ xuyên suốt các request
    private static final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    
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
        log.info("Generating OTP for email: {}", email);
        
        String otp = generateRandomOtp(OTP_LENGTH);
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES);
        
        log.info("Generated OTP: {} with expiry time: {}", otp, expiryTime);
        
        // Lưu OTP vào storage
        otpStorage.put(email, new OtpData(otp, expiryTime));
        log.info("Stored OTP in memory for email: {}", email);
        
        // Kiểm tra xem OTP đã được lưu đúng chưa
        OtpData storedData = otpStorage.get(email);
        log.info("Verification - OTP stored in memory: {}", storedData);
        
        return otp;
    }
    
    /**
     * Verify if the provided OTP is valid for the given email
     * @param email User email
     * @param otp OTP to verify
     * @return true if OTP is valid, false otherwise
     */
    public boolean verifyOtp(String email, String otp) {
        log.info("Verifying OTP for email: {}, OTP: {}", email, otp);
        
        OtpData otpData = otpStorage.get(email);
        log.info("OTP data from storage: {}", otpData);
        
        if (otpData == null) {
            log.warn("No OTP found for email: {}", email);
            return false;
        }
        
        LocalDateTime now = LocalDateTime.now();
        log.info("Current time: {}, Expiry time: {}", now, otpData.getExpiryTime());
        
        if (now.isAfter(otpData.getExpiryTime())) {
            log.warn("OTP expired for email: {}", email);
            otpStorage.remove(email);
            return false;
        }
        
        log.info("Comparing OTP: stored='{}', provided='{}'", otpData.getOtp(), otp);
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
     * Get current OTP for the given email (for debugging purposes)
     * @param email User email
     * @return Current OTP or null if not found
     */
    public String getCurrentOtp(String email) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            log.info("No OTP found for email: {}", email);
            return null;
        }
        
        if (LocalDateTime.now().isAfter(otpData.getExpiryTime())) {
            log.info("OTP expired for email: {}", email);
            return null;
        }
        
        log.info("Current OTP for email {}: {}", email, otpData.getOtp());
        return otpData.getOtp();
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
        
        @Override
        public String toString() {
            return "OtpData{" +
                    "otp='" + otp + '\'' +
                    ", expiryTime=" + expiryTime +
                    '}';
        }
    }
}