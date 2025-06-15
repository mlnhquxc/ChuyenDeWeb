package com.example.back_end.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenStorageService {
    private static final Logger log = LoggerFactory.getLogger(TokenStorageService.class);
    
    // Lưu trữ token theo username
    private final Map<String, String> activeTokens = new ConcurrentHashMap<>();

    public void storeToken(String username, String token) {
        log.info("Storing token for user: {}", username);
        activeTokens.put(username, token);
        log.info("Total active tokens: {}", activeTokens.size());
    }

    public String getToken(String username) {
        return activeTokens.get(username);
    }

    public void removeToken(String username) {
        log.info("Removing token for user: {}", username);
        activeTokens.remove(username);
    }

    public boolean isTokenValid(String username, String token) {
        String storedToken = activeTokens.get(username);
        boolean isValid = storedToken != null && storedToken.equals(token);
        log.info("Token validation for user {}: {} (stored: {}, provided: {})", 
                username, isValid, storedToken != null, token != null);
        return isValid;
    }
    
    public int getActiveTokenCount() {
        return activeTokens.size();
    }
} 