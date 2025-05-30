package com.example.back_end.service;

import com.example.back_end.exception.JwtAuthenticationException;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@Slf4j
public class JwtService {
    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;

    public String generateToken(String subject, String scope) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                    .subject(subject)
                    .issuer("CDWED.com")
                    .issueTime(new Date())
                    .expirationTime(new Date(
                            Instant.now().plus(24, ChronoUnit.HOURS).toEpochMilli()
                    ))
                    .claim("scope", scope)
                    .build();

            Payload payload = new Payload(jwtClaimsSet.toJSONObject());
            JWSObject jwsObject = new JWSObject(header, payload);
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Error generating token", e);
            throw new JwtAuthenticationException("Cannot generate token", e);
        }
    }

    public String validateToken(String token) throws ParseException, JOSEException {
        try {
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);
            
            if (!signedJWT.verify(verifier)) {
                log.error("Invalid token signature");
                throw new JwtAuthenticationException("Invalid token signature");
            }

            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiryTime.before(new Date())) {
                log.error("Token has expired");
                throw new JwtAuthenticationException("Token has expired");
            }

            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            log.error("Error parsing token", e);
            throw e;
        } catch (JOSEException e) {
            log.error("Error verifying token", e);
            throw e;
        }
    }
} 