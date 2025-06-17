package com.example.back_end.repositories;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Integer userId);
    Page<Order> findByUserId(Integer userId, Pageable pageable);
    Page<Order> findByUserIdOrderByOrderDateDesc(Integer userId, Pageable pageable);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatus(String status);
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Statistics queries
    long countByStatus(OrderStatus status);
    long countByStatus(String status);
    long countByOrderDateAfter(LocalDateTime date);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal calculateTotalRevenue();
    
    @Query("SELECT o FROM Order o WHERE o.user.username = :username ORDER BY o.orderDate DESC")
    List<Order> findByUsername(@Param("username") String username);
    
    @Query("SELECT o FROM Order o WHERE o.user.username = :username")
    Page<Order> findByUsername(@Param("username") String username, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate);
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.product p " +
           "LEFT JOIN FETCH p.productImages " +
           "WHERE o.user.id = :userId " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findByUserIdWithProductImages(@Param("userId") Integer userId, Pageable pageable);
    
    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.orderDetails od " +
           "LEFT JOIN FETCH od.product p " +
           "LEFT JOIN FETCH p.productImages " +
           "WHERE o.id = :orderId")
    Optional<Order> findByIdWithProductImages(@Param("orderId") Long orderId);
}