package com.example.back_end.service;

import com.example.back_end.dto.request.CreateOrderRequest;
import com.example.back_end.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface IOrderService {
    List<Order> getOrdersByUserId(Integer userId);
    Page<Order> getOrdersByUsername(String username, Pageable pageable);
    List<Order> getOrdersByStatus(String status);
    Order getOrderById(Long id);
    Order getOrderByNumber(String orderNumber);
    Order createOrder(Integer userId, String shippingAddress, String phone);
    Order createOrderFromCart(String username, CreateOrderRequest request);
    Order updateOrderStatus(Long id, String status);
    Order cancelOrder(Long id, String username, String reason);
    Order updateTrackingNumber(Long id, String trackingNumber);
    Map<String, Object> getOrderStatistics();
}