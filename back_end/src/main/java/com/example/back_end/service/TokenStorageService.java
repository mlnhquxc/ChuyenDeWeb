package com.example.back_end.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenStorageService {
    // Lưu trữ token theo username
    private final Map<String, String> activeTokens = new ConcurrentHashMap<>();

    public void storeToken(String username, String token) {
        activeTokens.put(username, token);
    }

    public String getToken(String username) {
        return activeTokens.get(username);
    }

    public void removeToken(String username) {
        activeTokens.remove(username);
    }

    public boolean isTokenValid(String username, String token) {
        String storedToken = activeTokens.get(username);
        return storedToken != null && storedToken.equals(token);
    }
} 