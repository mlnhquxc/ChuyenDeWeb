package com.example.back_end.mapper;

import com.example.back_end.dto.OrderDTO;
import com.example.back_end.dto.OrderDetailDTO;
import com.example.back_end.entity.Order;
import com.example.back_end.entity.OrderDetail;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderDTO toOrderDTO(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderDetailDTO> orderDetailDTOs = order.getOrderDetails() != null
                ? order.getOrderDetails().stream()
                    .map(this::toOrderDetailDTO)
                    .collect(Collectors.toList())
                : List.of();

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .username(order.getUser().getUsername())
                .userEmail(order.getUser().getEmail())
                .shippingAddress(order.getShippingAddress())
                .phone(order.getPhone())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .orderDate(order.getOrderDate())
                .orderDetails(orderDetailDTOs)
                .build();
    }

    public OrderDetailDTO toOrderDetailDTO(OrderDetail orderDetail) {
        if (orderDetail == null) {
            return null;
        }

        BigDecimal subtotal = orderDetail.getPrice().multiply(BigDecimal.valueOf(orderDetail.getQuantity()));

        return OrderDetailDTO.builder()
                .id(orderDetail.getId())
                .productId(orderDetail.getProduct().getId())
                .productName(orderDetail.getProduct().getName())
                .productImage(orderDetail.getProduct().getImage())
                .price(orderDetail.getPrice())
                .quantity(orderDetail.getQuantity())
                .subtotal(subtotal)
                .build();
    }
}