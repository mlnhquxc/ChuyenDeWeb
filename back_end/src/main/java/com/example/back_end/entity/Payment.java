package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "txn_ref", unique = true, nullable = false)
    private String txnRef;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "order_info")
    private String orderInfo;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "bank_code")
    private String bankCode;

    @Column(name = "transaction_no")
    private String transactionNo;

    @Column(name = "response_code")
    private String responseCode;

    @Column(name = "transaction_status")
    private String transactionStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;

    @Column(name = "secure_hash")
    private String secureHash;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "user_id")
    private Long userId;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }

    public enum PaymentStatus {
        PENDING,
        SUCCESS,
        FAILED,
        CANCELLED
    }
}