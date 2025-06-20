package com.example.back_end.service.impl;

import com.example.back_end.configuration.VnpayConfig;
import com.example.back_end.dto.request.CreateOrderRequest;
import com.example.back_end.dto.request.PaymentRequest;
import com.example.back_end.dto.response.PaymentResponse;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.Payment;
import com.example.back_end.entity.User;
import com.example.back_end.repositories.PaymentRepository;
import com.example.back_end.service.IOrderService;
import com.example.back_end.service.PaymentService;
import com.example.back_end.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final VnpayConfig vnpayConfig;
    private final PaymentRepository paymentRepository;
    private final IOrderService orderService;
    private final UserService userService;

    @Override
    public PaymentResponse createPayment(PaymentRequest request, HttpServletRequest httpRequest) {
        try {
            String txnRef = VnpayConfig.getRandomNumber(8);
            
            // Lưu payment record với status PENDING
            Payment payment = Payment.builder()
                    .txnRef(txnRef)
                    .orderId(request.getOrderId())
                    .amount(request.getAmount())
                    .orderInfo(request.getOrderInfo())
                    .userId(request.getUserId())
                    .status(Payment.PaymentStatus.PENDING)
                    .build();
            
            paymentRepository.save(payment);

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", "2.1.0");
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", vnpayConfig.getTmnCode());
            vnp_Params.put("vnp_Amount", String.valueOf(request.getAmount() * 100));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", txnRef);
            vnp_Params.put("vnp_OrderInfo", request.getOrderInfo());
            vnp_Params.put("vnp_OrderType", "100000");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr", VnpayConfig.getIpAddress(httpRequest));

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (String fieldName : fieldNames) {
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    try {
                        hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                        query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                        query.append('=');
                        query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    } catch (UnsupportedEncodingException e) {
                        log.error("Error encoding URL", e);
                    }
                    if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            String vnp_SecureHash = VnpayConfig.hmacSHA512(vnpayConfig.getHashSecret(), hashData.toString());
            String paymentUrl = vnpayConfig.getPayUrl() + "?" + query.toString() + "&vnp_SecureHash=" + vnp_SecureHash;

            return PaymentResponse.builder()
                    .paymentUrl(paymentUrl)
                    .txnRef(txnRef)
                    .build();

        } catch (Exception e) {
            log.error("Error creating payment", e);
            throw new RuntimeException("Error creating payment", e);
        }
    }

    @Override
    public Payment processPaymentReturn(Map<String, String> params) {
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");
        String transactionNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");
        String paymentMethod = params.get("vnp_CardType");

        Payment payment = paymentRepository.findByTxnRef(txnRef)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        log.info("Processing payment return for txnRef: {}, current status: {}, new responseCode: {}", 
                txnRef, payment.getStatus(), responseCode);

        // Nếu payment đã được xử lý rồi, không xử lý lại
        if (payment.getStatus() != Payment.PaymentStatus.PENDING) {
            log.info("Payment {} already processed with status: {}", txnRef, payment.getStatus());
            return payment;
        }

        payment.setResponseCode(responseCode);
        payment.setTransactionStatus(transactionStatus);
        payment.setTransactionNo(transactionNo);
        payment.setBankCode(bankCode);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentDate(LocalDateTime.now());

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            
            // Tự động tạo đơn hàng khi payment thành công
            try {
                if (payment.getUserId() != null && payment.getOrderId() == null) {
                    User user = userService.findById(payment.getUserId().intValue());
                    
                    // Tạo order request từ thông tin payment
                    CreateOrderRequest orderRequest = CreateOrderRequest.builder()
                            .shippingAddress(user.getAddress() != null ? user.getAddress() : "Địa chỉ mặc định")
                            .phone(user.getPhone() != null ? user.getPhone() : "0000000000")
                            .customerName(user.getFullname() != null ? user.getFullname() : user.getUsername())
                            .email(user.getEmail())
                            .paymentMethod("VNPAY")
                            .build();
                    
                    // Retry logic for cart empty issue
                    Order order = null;
                    int retryCount = 0;
                    int maxRetries = 3;
                    
                    while (order == null && retryCount < maxRetries) {
                        try {
                            order = orderService.createOrderFromCart(user.getUsername(), orderRequest);
                            payment.setOrderId(order.getId());
                            log.info("Order created successfully with ID: {} for payment: {} (attempt: {})", 
                                    order.getId(), payment.getTxnRef(), retryCount + 1);
                        } catch (RuntimeException e) {
                            retryCount++;
                            if (e.getMessage().contains("Cart is empty")) {
                                log.warn("Cart is empty for payment: {}, attempt: {}/{}", 
                                        payment.getTxnRef(), retryCount, maxRetries);
                                if (retryCount < maxRetries) {
                                    Thread.sleep(1000); // Wait 1 second before retry
                                } else {
                                    throw e; // Re-throw after max retries
                                }
                            } else {
                                throw e; // Re-throw non-cart-empty errors immediately
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Failed to create order for payment: {}", payment.getTxnRef(), e);
                // Không throw exception để không làm fail payment process
                // Payment vẫn được mark là SUCCESS, order có thể tạo manual sau
            }
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
        }

        return paymentRepository.save(payment);
    }

    @Override
    public Payment findByTxnRef(String txnRef) {
        return paymentRepository.findByTxnRef(txnRef)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Override
    public List<Payment> findByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Override
    public boolean validatePaymentSignature(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        params.remove("vnp_SecureHash");

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    log.error("Error encoding URL", e);
                }
                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    hashData.append('&');
                }
            }
        }

        String signValue = VnpayConfig.hmacSHA512(vnpayConfig.getHashSecret(), hashData.toString());
        return signValue.equals(vnp_SecureHash);
    }
}