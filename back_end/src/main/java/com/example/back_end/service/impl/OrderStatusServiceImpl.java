package com.example.back_end.service.impl;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.constant.PaymentStatus;
import com.example.back_end.entity.Order;
import com.example.back_end.repositories.OrderRepository;
import com.example.back_end.service.OrderStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderStatusServiceImpl implements OrderStatusService {

    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public Order processOrderStatusTransition(Order order, OrderStatus newStatus) {
        OrderStatus currentStatus = order.getStatus();
        
        if (!canTransitionTo(currentStatus, newStatus)) {
            throw new IllegalStateException(
                String.format("Cannot transition from %s to %s for order %s", 
                    currentStatus, newStatus, order.getOrderNumber())
            );
        }

        log.info("Transitioning order {} from {} to {}", 
                order.getOrderNumber(), currentStatus, newStatus);

        order.updateStatus(newStatus);
        
        // Xử lý logic đặc biệt cho từng trạng thái
        switch (newStatus) {
            case PAID:
                handlePaidStatus(order);
                break;
            case CONFIRMED:
                handleConfirmedStatus(order);
                break;
            case PROCESSING:
                handleProcessingStatus(order);
                break;
            case SHIPPED:
                handleShippedStatus(order);
                break;
            case DELIVERED:
                handleDeliveredStatus(order);
                break;
            case CANCELLED:
                handleCancelledStatus(order);
                break;
        }

        return orderRepository.save(order);
    }

    @Override
    public boolean canTransitionTo(OrderStatus currentStatus, OrderStatus newStatus) {
        // Định nghĩa các chuyển đổi trạng thái hợp lệ
        switch (currentStatus) {
            case PENDING:
                return newStatus == OrderStatus.PAID || 
                       newStatus == OrderStatus.CANCELLED;
            case PAID:
                return newStatus == OrderStatus.CONFIRMED || 
                       newStatus == OrderStatus.CANCELLED;
            case CONFIRMED:
                return newStatus == OrderStatus.PROCESSING || 
                       newStatus == OrderStatus.CANCELLED;
            case PROCESSING:
                return newStatus == OrderStatus.SHIPPED || 
                       newStatus == OrderStatus.CANCELLED;
            case SHIPPED:
                return newStatus == OrderStatus.DELIVERED || 
                       newStatus == OrderStatus.RETURNED;
            case DELIVERED:
                return newStatus == OrderStatus.RETURNED;
            case CANCELLED:
                return newStatus == OrderStatus.REFUNDED;
            case RETURNED:
                return newStatus == OrderStatus.REFUNDED;
            case REFUNDED:
                return false; // Trạng thái cuối
            default:
                return false;
        }
    }

    @Override
    @Scheduled(fixedRate = 300000) // Chạy mỗi 5 phút
    @Async
    public void autoConfirmPaidOrders() {
        try {
            List<Order> paidOrders = orderRepository.findByStatusAndPaymentStatus(
                OrderStatus.PAID, PaymentStatus.PAID);
            
            for (Order order : paidOrders) {
                // Tự động xác nhận đơn hàng đã thanh toán sau 10 phút
                if (order.getUpdatedAt().isBefore(LocalDateTime.now().minusMinutes(10))) {
                    processOrderStatusTransition(order, OrderStatus.CONFIRMED);
                    log.info("Auto-confirmed paid order: {}", order.getOrderNumber());
                }
            }
        } catch (Exception e) {
            log.error("Error in auto-confirming paid orders", e);
        }
    }

    @Override
    @Scheduled(fixedRate = 600000) // Chạy mỗi 10 phút
    @Async
    public void autoProcessConfirmedOrders() {
        try {
            List<Order> confirmedOrders = orderRepository.findByStatus(OrderStatus.CONFIRMED);
            
            for (Order order : confirmedOrders) {
                // Tự động chuyển sang xử lý sau 30 phút
                if (order.getUpdatedAt().isBefore(LocalDateTime.now().minusMinutes(30))) {
                    processOrderStatusTransition(order, OrderStatus.PROCESSING);
                    log.info("Auto-processing confirmed order: {}", order.getOrderNumber());
                }
            }
        } catch (Exception e) {
            log.error("Error in auto-processing confirmed orders", e);
        }
    }

    private void handlePaidStatus(Order order) {
        log.info("Order {} has been paid successfully", order.getOrderNumber());
        // Có thể gửi email thông báo thanh toán thành công
        // Có thể tích hợp với hệ thống inventory để reserve sản phẩm
    }

    private void handleConfirmedStatus(Order order) {
        log.info("Order {} has been confirmed and ready for processing", order.getOrderNumber());
        // Có thể gửi email xác nhận đơn hàng
        // Có thể tạo picking list cho warehouse
    }

    private void handleProcessingStatus(Order order) {
        log.info("Order {} is now being processed", order.getOrderNumber());
        // Có thể gửi thông báo đang chuẩn bị hàng
        // Có thể tích hợp với hệ thống warehouse management
    }

    private void handleShippedStatus(Order order) {
        log.info("Order {} has been shipped", order.getOrderNumber());
        // Có thể gửi email với tracking number
        // Có thể tích hợp với shipping provider API
    }

    private void handleDeliveredStatus(Order order) {
        log.info("Order {} has been delivered successfully", order.getOrderNumber());
        // Có thể gửi email yêu cầu đánh giá
        // Có thể cập nhật loyalty points
    }

    private void handleCancelledStatus(Order order) {
        log.info("Order {} has been cancelled", order.getOrderNumber());
        // Có thể gửi email thông báo hủy đơn
        // Có thể hoàn trả inventory
        // Có thể xử lý refund nếu đã thanh toán
    }
}