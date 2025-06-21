package com.example.back_end.service;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.entity.Order;

public interface OrderStatusService {
    /**
     * Tự động chuyển đổi trạng thái đơn hàng dựa trên logic nghiệp vụ
     */
    Order processOrderStatusTransition(Order order, OrderStatus newStatus);
    
    /**
     * Kiểm tra xem có thể chuyển từ trạng thái hiện tại sang trạng thái mới không
     */
    boolean canTransitionTo(OrderStatus currentStatus, OrderStatus newStatus);
    
    /**
     * Tự động xác nhận đơn hàng đã thanh toán
     */
    void autoConfirmPaidOrders();
    
    /**
     * Tự động chuyển đơn hàng đã xác nhận sang đang xử lý
     */
    void autoProcessConfirmedOrders();
}