package com.example.back_end.controller;

import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.User;
import com.example.back_end.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody @Valid UserCreationRequest request) {
        ApiResponse<User> response = new ApiResponse<>();
        response.setResult(userService.createRequest(request));
        return response;
    }
    
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login (@RequestParam String email, @RequestParam String password) {
        var res = userService.login(email, password);
        return ApiResponse.<AuthenticationResponse>builder().result(res).build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> autResponse(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = userService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }
}
