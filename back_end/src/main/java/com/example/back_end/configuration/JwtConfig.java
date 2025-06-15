package com.example.back_end.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String signerKey;
    private long accessTokenValidityInMinutes = 60;
    private long refreshTokenValidityInDays = 7;
} 