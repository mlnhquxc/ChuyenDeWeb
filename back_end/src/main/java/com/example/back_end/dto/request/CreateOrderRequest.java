package com.example.back_end.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
    
    private String billingAddress;
    
    @NotBlank(message = "Phone number is required")
    private String phone;
    
    private String email;
    
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    private String paymentMethod;
    
    private BigDecimal shippingFee;
    
    private BigDecimal discountAmount;
    
    private String notes;
}