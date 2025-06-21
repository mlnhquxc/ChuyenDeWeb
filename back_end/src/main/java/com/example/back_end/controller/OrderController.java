package com.example.back_end.controller;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.dto.OrderDTO;
import com.example.back_end.dto.request.CreateDirectOrderRequest;
import com.example.back_end.dto.request.CreateOrderRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.OrderStatusResponse;
import com.example.back_end.entity.Order;
import com.example.back_end.mapper.OrderMapper;
import com.example.back_end.service.OrderService;
import com.example.back_end.service.OrderStatusService;
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
    private final OrderStatusService orderStatusService;
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

        // Create order directly from products (Buy Now functionality)More actions
    @PostMapping("/create-direct")
    public ResponseEntity<ApiResponse<OrderDTO>> createDirectOrder(
            @Valid @RequestBody CreateDirectOrderRequest request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        Order order = orderService.createDirectOrder(username, request);
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
        try {
            Order order = orderService.getOrderById(id);
            OrderStatus newStatus = OrderStatus.fromString(status);
            
            // Sử dụng OrderStatusService để quản lý chuyển đổi trạng thái
            Order updatedOrder = orderStatusService.processOrderStatusTransition(order, newStatus);
            OrderDTO orderDTO = orderMapper.toOrderDTO(updatedOrder);
            
            return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                    .code(200)
                    .message("Order status updated successfully")
                    .result(orderDTO)
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<OrderDTO>builder()
                    .code(400)
                    .message("Invalid status transition: " + e.getMessage())
                    .build());
        }
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

    // Confirm paid order (admin only)
    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<OrderDTO>> confirmOrder(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            Order updatedOrder = orderStatusService.processOrderStatusTransition(order, OrderStatus.CONFIRMED);
            OrderDTO orderDTO = orderMapper.toOrderDTO(updatedOrder);
            
            return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                    .code(200)
                    .message("Order confirmed successfully")
                    .result(orderDTO)
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<OrderDTO>builder()
                    .code(400)
                    .message("Cannot confirm order: " + e.getMessage())
                    .build());
        }
    }

    // Start processing order (admin only)
    @PutMapping("/{id}/process")
    public ResponseEntity<ApiResponse<OrderDTO>> processOrder(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            Order updatedOrder = orderStatusService.processOrderStatusTransition(order, OrderStatus.PROCESSING);
            OrderDTO orderDTO = orderMapper.toOrderDTO(updatedOrder);
            
            return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                    .code(200)
                    .message("Order processing started successfully")
                    .result(orderDTO)
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<OrderDTO>builder()
                    .code(400)
                    .message("Cannot process order: " + e.getMessage())
                    .build());
        }
    }

    // Ship order (admin only)
    @PutMapping("/{id}/ship")
    public ResponseEntity<ApiResponse<OrderDTO>> shipOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String trackingNumber) {
        try {
            Order order = orderService.getOrderById(id);
            
            // Set tracking number if provided
            if (trackingNumber != null && !trackingNumber.trim().isEmpty()) {
                order.setTrackingNumber(trackingNumber.trim());
            }
            
            Order updatedOrder = orderStatusService.processOrderStatusTransition(order, OrderStatus.SHIPPED);
            OrderDTO orderDTO = orderMapper.toOrderDTO(updatedOrder);
            
            return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                    .code(200)
                    .message("Order shipped successfully")
                    .result(orderDTO)
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<OrderDTO>builder()
                    .code(400)
                    .message("Cannot ship order: " + e.getMessage())
                    .build());
        }
    }

    // Deliver order (admin only)
    @PutMapping("/{id}/deliver")
    public ResponseEntity<ApiResponse<OrderDTO>> deliverOrder(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            Order updatedOrder = orderStatusService.processOrderStatusTransition(order, OrderStatus.DELIVERED);
            OrderDTO orderDTO = orderMapper.toOrderDTO(updatedOrder);
            
            return ResponseEntity.ok(ApiResponse.<OrderDTO>builder()
                    .code(200)
                    .message("Order delivered successfully")
                    .result(orderDTO)
                    .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<OrderDTO>builder()
                    .code(400)
                    .message("Cannot deliver order: " + e.getMessage())
                    .build());
        }
    }

    // Get available status transitions for an order
    @GetMapping("/{id}/available-transitions")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableTransitions(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        OrderStatus currentStatus = order.getStatus();
        
        List<String> availableTransitions = java.util.Arrays.stream(OrderStatus.values())
                .filter(status -> orderStatusService.canTransitionTo(currentStatus, status))
                .map(OrderStatus::name)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.<List<String>>builder()
                .code(200)
                .message("Available transitions retrieved successfully")
                .result(availableTransitions)
                .build());
    }

    // Get detailed order status information
    @GetMapping("/{id}/status-detail")
    public ResponseEntity<ApiResponse<OrderStatusResponse>> getOrderStatusDetail(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        OrderStatus currentStatus = order.getStatus();
        
        List<String> availableTransitions = java.util.Arrays.stream(OrderStatus.values())
                .filter(status -> orderStatusService.canTransitionTo(currentStatus, status))
                .map(OrderStatus::name)
                .collect(Collectors.toList());
        
        OrderStatusResponse statusResponse = OrderStatusResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .currentStatus(order.getStatus())
                .currentStatusDisplay(order.getStatus().getDisplayName())
                .paymentStatus(order.getPaymentStatus())
                .paymentStatusDisplay(order.getPaymentStatus().getDisplayName())
                .lastUpdated(order.getUpdatedAt())
                .availableTransitions(availableTransitions)
                .trackingNumber(order.getTrackingNumber())
                .shippedDate(order.getShippedDate())
                .deliveredDate(order.getDeliveredDate())
                .canBeCancelled(order.canBeCancelled())
                .isPaid(order.isPaid())
                .isReadyForProcessing(order.isReadyForProcessing())
                .pendingDate(order.getCreatedAt())
                .paidDate(order.getPaymentStatus() == com.example.back_end.constant.PaymentStatus.PAID ? order.getUpdatedAt() : null)
                .shippedDateTime(order.getShippedDate())
                .deliveredDateTime(order.getDeliveredDate())
                .cancelledDate(order.getCancelledDate())
                .build();
        
        return ResponseEntity.ok(ApiResponse.<OrderStatusResponse>builder()
                .code(200)
                .message("Order status detail retrieved successfully")
                .result(statusResponse)
                .build());
    }
} 