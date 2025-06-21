package com.example.back_end.service;

import com.example.back_end.dto.request.PaymentRequest;
import com.example.back_end.dto.response.PaymentResponse;
import com.example.back_end.entity.Payment;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

public interface PaymentService {
    PaymentResponse createPayment(PaymentRequest request, HttpServletRequest httpRequest);
    Payment processPaymentReturn(Map<String, String> params);
    Payment findByTxnRef(String txnRef);
    List<Payment> findByUserId(Long userId);
    boolean validatePaymentSignature(Map<String, String> params);
}