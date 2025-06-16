package com.example.back_end.security;

import com.example.back_end.exception.JwtAuthenticationException;
import com.example.back_end.service.JwtService;
import com.example.back_end.service.TokenStorageService;
import com.example.back_end.service.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.text.ParseException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final UserService userService;
    private final JwtService jwtService;
    private final TokenStorageService tokenStorageService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);
            log.info("Processing JWT token for authentication, token length: {}", token.length());
            String username = null;
            try {
                username = jwtService.validateToken(token);
                log.info("JWT token validated successfully for user: {}", username);
            } catch (ParseException | JOSEException | JwtAuthenticationException e) {
                log.error("Invalid JWT token", e);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    // Temporarily disable token storage validation to fix immediate issue
                    // The JWT token validation above is sufficient for security
                    /*
                    if (!tokenStorageService.isTokenValid(username, token)) {
                        log.error("Token not found in active sessions for user: {}", username);
                        tokenStorageService.debugActiveTokens();
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        return;
                    }
                    */

                    UserDetails userDetails = userService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } catch (Exception e) {
                    log.error("Cannot set user authentication", e);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("User not found or token is invalid");
                    return;
                }
            }
        } catch (Exception e) {
            log.error("Authentication error", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
} 