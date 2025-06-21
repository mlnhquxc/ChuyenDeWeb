package com.example.back_end.dto.response;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.constant.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusResponse {
    private Long orderId;
    private String orderNumber;
    private OrderStatus currentStatus;
    private String currentStatusDisplay;
    private PaymentStatus paymentStatus;
    private String paymentStatusDisplay;
    private LocalDateTime lastUpdated;
    private List<String> availableTransitions;
    private String trackingNumber;
    private LocalDateTime shippedDate;
    private LocalDateTime deliveredDate;
    private boolean canBeCancelled;
    private boolean isPaid;
    private boolean isReadyForProcessing;
    
    // Status timeline
    private LocalDateTime pendingDate;
    private LocalDateTime paidDate;
    private LocalDateTime confirmedDate;
    private LocalDateTime processingDate;
    private LocalDateTime shippedDateTime;
    private LocalDateTime deliveredDateTime;
    private LocalDateTime cancelledDate;
}