package com.example.back_end.controller;

import com.example.back_end.dto.request.PaymentRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.PaymentResponse;
import com.example.back_end.entity.Payment;
import com.example.back_end.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@Slf4j
public class VnPayController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ApiResponse<PaymentResponse> createPayment(@RequestBody PaymentRequest request, HttpServletRequest httpRequest) {
        try {
            PaymentResponse response = paymentService.createPayment(request, httpRequest);
            return ApiResponse.<PaymentResponse>builder()
                    .result(response)
                    .message("Payment URL created successfully")
                    .build();
        } catch (Exception e) {
            log.error("Error creating payment", e);
            return ApiResponse.<PaymentResponse>builder()
                    .code(1)
                    .message("Error creating payment: " + e.getMessage())
                    .build();
        }
    }

    @GetMapping("/vnpay")
    public ApiResponse<PaymentResponse> createPaymentLegacy(@RequestParam long amount, 
                                                           @RequestParam(required = false) Long orderId,
                                                           @RequestParam(required = false) Long userId,
                                                           HttpServletRequest httpRequest) {
        try {
            PaymentRequest request = PaymentRequest.builder()
                    .amount(amount)
                    .orderId(orderId)
                    .userId(userId)
                    .orderInfo("Thanh toán đơn hàng")
                    .build();
            
            PaymentResponse response = paymentService.createPayment(request, httpRequest);
            return ApiResponse.<PaymentResponse>builder()
                    .result(response)
                    .message("Payment URL created successfully")
                    .build();
        } catch (Exception e) {
            log.error("Error creating payment", e);
            return ApiResponse.<PaymentResponse>builder()
                    .code(1)
                    .message("Error creating payment: " + e.getMessage())
                    .build();
        }
    }
    @GetMapping("/return")
    public void vnpayReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        try {
            log.info("VnPay return with params: {}", params);
            
            // Validate signature
            boolean isValidSignature = paymentService.validatePaymentSignature(params);
            if (!isValidSignature) {
                log.error("Invalid payment signature");
                response.sendRedirect("http://localhost:5173/payment/result?status=error&message=Invalid signature");
                return;
            }

            // Process payment result
            Payment payment = paymentService.processPaymentReturn(params);
            
            String redirectUrl;
            if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
                redirectUrl = "http://localhost:5173/payment/result?status=success&txnRef=" + payment.getTxnRef();
            } else {
                redirectUrl = "http://localhost:5173/payment/result?status=failed&txnRef=" + payment.getTxnRef();
            }
            
            response.sendRedirect(redirectUrl);
            
        } catch (Exception e) {
            log.error("Error processing VnPay return", e);
            response.sendRedirect("http://localhost:5173/payment/result?status=error&message=Processing error");
        }
    }

    @GetMapping("/status/{txnRef}")
    public ApiResponse<Payment> getPaymentStatus(@PathVariable String txnRef) {
        try {
            Payment payment = paymentService.findByTxnRef(txnRef);
            return ApiResponse.<Payment>builder()
                    .result(payment)
                    .message("Payment status retrieved successfully")
                    .build();
        } catch (Exception e) {
            log.error("Error getting payment status", e);
            return ApiResponse.<Payment>builder()
                    .code(1)
                    .message("Payment not found")
                    .build();
        }
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<java.util.List<Payment>> getUserPayments(@PathVariable Long userId) {
        try {
            java.util.List<Payment> payments = paymentService.findByUserId(userId);
            return ApiResponse.<java.util.List<Payment>>builder()
                    .result(payments)
                    .message("User payments retrieved successfully")
                    .build();
        } catch (Exception e) {
            log.error("Error getting user payments", e);
            return ApiResponse.<java.util.List<Payment>>builder()
                    .code(1)
                    .message("Error retrieving payments")
                    .build();
        }
    }
} 