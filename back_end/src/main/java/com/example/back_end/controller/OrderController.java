package com.example.back_end.controller;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.dto.OrderDTO;
import com.example.back_end.dto.request.CreateOrderRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Order;
import com.example.back_end.mapper.OrderMapper;
import com.example.back_end.service.OrderService;
import com.example.back_end.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;
    private final OrderMapper orderMapper;
    private final UserService userService;

    // Get current user's orders with pagination
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<Page<OrderDTO>>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Order> orders = orderService.getOrdersByUsername(username, pageable);
        Page<OrderDTO> orderDTOs = orders.map(orderMapper::toOrderDTO);
        
        return ResponseEntity.ok(ApiResponse.<Page<OrderDTO>>builder()
                .code(200)
                .message("Orders retrieved successfully")
                .result(orderDTOs)
                .build());
    }

    // Get orders by user ID (admin only)
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByUserId(@PathVariable Integer userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        List<OrderDTO> orderDTOs = orders.stream()
                .map(orderMapper::toOrderDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.<List<OrderDTO>>builder()
                .code(200)
                .message("Orders retrieved successfully")
                .result(orderDTOs)
                .build());
    }

    // Get orders by status (admin only)
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        List<OrderDTO> orderDTOs = orders.stream()
                .map(orderMapper::toOrderDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.<List<OrderDTO>>builder()
                .code(200)
                .message("Orders retrieved successfully")
                .result(orderDTOs)
                .build());
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        OrderDTO orderDTO = orderMapper.toOrderDTO(order);
        
        return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                .code(200)
                .message("Order retrieved successfully")
                .result(orderDTO)
                .build());
    }

    // Get order by order number
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderByNumber(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByNumber(orderNumber);
        OrderDTO orderDTO = orderMapper.toOrderDTO(order);
        
        return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                .code(200)
                .message("Order retrieved successfully")
                .result(orderDTO)
                .build());
    }

    // Create order from cart
    @PostMapping("/create-from-cart")
    public ResponseEntity<ApiResponse<OrderDTO>> createOrderFromCart(
            @Valid @RequestBody CreateOrderRequest request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        Order order = orderService.createOrderFromCart(username, request);
        OrderDTO orderDTO = orderMapper.toOrderDTO(order);
        
        return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                .code(200)
                .message("Order created successfully")
                .result(orderDTO)
                .build());
    }

    // Legacy create order endpoint
    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @PathVariable Integer userId,
            @RequestParam String shippingAddress,
            @RequestParam String phone) {
        Order order = orderService.createOrder(userId, shippingAddress, phone);
        OrderDTO orderDTO = orderMapper.toOrderDTO(order);
        
        return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                .code(200)
                .message("Order created successfully")
                .result(orderDTO)
                .build());
    }

    // Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Order order = orderService.updateOrderStatus(id, status);
        OrderDTO orderDTO = orderMapper.toOrderDTO(order);
        
        return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                .code(200)
                .message("Order status updated successfully")
                .result(orderDTO)
                .build());
    }

    // Cancel order
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        Order order = orderService.cancelOrder(id, username, reason);
        OrderDTO orderDTO = orderMapper.toOrderDTO(order);
        
        return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                .code(200)
                .message("Order cancelled successfully")
                .result(orderDTO)
                .build());
    }

    // Update tracking number
    @PutMapping("/{id}/tracking")
    public ResponseEntity<ApiResponse<OrderDTO>> updateTrackingNumber(
            @PathVariable Long id,
            @RequestParam String trackingNumber) {
        Order order = orderService.updateTrackingNumber(id, trackingNumber);
        OrderDTO orderDTO = orderMapper.toOrderDTO(order);
        
        return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                .code(200)
                .message("Tracking number updated successfully")
                .result(orderDTO)
                .build());
    }

    // Get order statistics (admin only)
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Object>> getOrderStatistics() {
        Object stats = orderService.getOrderStatistics();
        
        return ResponseEntity.ok(ApiResponse.builder()
                .code(200)
                .message("Order statistics retrieved successfully")
                .result(stats)
                .build());
    }
} 