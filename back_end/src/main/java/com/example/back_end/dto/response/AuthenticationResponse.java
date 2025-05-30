package com.example.back_end.dto.response;

import com.example.back_end.dto.response.UserResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationResponse {
    private String token;
    private boolean authenticated;
    private UserResponse user;
}
