package com.example.back_end.entity;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.constant.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "order_date", nullable = false)
    @Builder.Default
    private LocalDateTime orderDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "shipping_address", nullable = false, columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;

    @Column(nullable = false)
    private String phone;

    private String email;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "shipping_fee", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipped_date")
    private LocalDateTime shippedDate;

    @Column(name = "delivered_date")
    private LocalDateTime deliveredDate;

    @Column(name = "cancelled_date")
    private LocalDateTime cancelledDate;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;

    @PrePersist
    private void generateOrderNumber() {
        if (orderNumber == null) {
            orderNumber = "ORD-" + System.currentTimeMillis() + "-" + 
                         UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    // Helper methods
    public BigDecimal getSubtotal() {
        return totalAmount.subtract(shippingFee).subtract(taxAmount).add(discountAmount);
    }

    public boolean canBeCancelled() {
        return status == OrderStatus.PENDING || status == OrderStatus.PAID || status == OrderStatus.CONFIRMED;
    }

    public boolean isCompleted() {
        return status == OrderStatus.DELIVERED;
    }

    public boolean isCancelled() {
        return status == OrderStatus.CANCELLED;
    }

    public boolean isPaid() {
        return paymentStatus == PaymentStatus.PAID;
    }

    public boolean isReadyForProcessing() {
        return status == OrderStatus.PAID && paymentStatus == PaymentStatus.PAID;
    }

    public void updateStatus(OrderStatus newStatus) {
        this.status = newStatus;
        LocalDateTime now = LocalDateTime.now();
        
        switch (newStatus) {
            case PAID:
                // Khi đơn hàng được thanh toán, có thể tự động chuyển sang CONFIRMED sau một khoảng thời gian
                log.info("Order {} has been paid and is ready for confirmation", this.orderNumber);
                break;
            case SHIPPED:
                this.shippedDate = now;
                break;
            case DELIVERED:
                this.deliveredDate = now;
                break;
            case CANCELLED:
                this.cancelledDate = now;
                break;
        }
    }
} 