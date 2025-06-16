package com.example.back_end.dto;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.constant.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Integer userId;
    private String username;
    private String userEmail;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private String statusDisplayName;
    private String paymentMethod;
    private PaymentStatus paymentStatus;
    private String paymentStatusDisplayName;
    private String shippingAddress;
    private String billingAddress;
    private String phone;
    private String email;
    private String customerName;
    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal subtotal;
    private String notes;
    private String trackingNumber;
    private LocalDateTime shippedDate;
    private LocalDateTime deliveredDate;
    private LocalDateTime cancelledDate;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderDetailDTO> orderDetails;
    private Integer totalItems;
    private boolean canBeCancelled;
    private boolean isCompleted;
    private boolean isCancelled;
}