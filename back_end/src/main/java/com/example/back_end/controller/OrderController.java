package com.example.back_end.controller;

import com.example.back_end.dto.OrderDTO;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Order;
import com.example.back_end.mapper.OrderMapper;
import com.example.back_end.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;
    private final OrderMapper orderMapper;

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
} 