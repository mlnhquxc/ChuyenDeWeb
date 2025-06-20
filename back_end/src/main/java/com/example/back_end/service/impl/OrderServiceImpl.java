package com.example.back_end.service.impl;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.constant.PaymentStatus;
import com.example.back_end.dto.request.CreateDirectOrderRequest;
import com.example.back_end.dto.request.CreateOrderRequest;
import com.example.back_end.entity.*;
import com.example.back_end.repositories.OrderRepository;
import com.example.back_end.repositories.ProductRepository;
import com.example.back_end.service.CartService;
import com.example.back_end.service.IOrderService;
import com.example.back_end.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final UserService userService;

    @Override
    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Page<Order> getOrdersByUsername(String username, Pageable pageable) {
        User user = userService.findByUsername(username);
        return orderRepository.findByUserIdWithProductImages(user.getId(), pageable);
    }

    @Override
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(OrderStatus.fromString(status));
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findByIdWithProductImages(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with number: " + orderNumber));
    }

    @Override
    @Transactional
    public Order createOrder(Integer userId, String shippingAddress, String phone) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        User user = userService.findById(userId);
        
        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .shippingAddress(shippingAddress)
                .phone(phone)
                .customerName(user.getFullname())
                .email(user.getEmail())
                .totalAmount(calculateTotalAmount(cart))
                .orderDetails(new ArrayList<>())
                .build();

        // Create order details and update product stock
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            OrderDetail orderDetail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .subtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                    .build();

            order.getOrderDetails().add(orderDetail);
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Clear the cart after order is created
        cartService.clearCart(userId);

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order createOrderFromCart(String username, CreateOrderRequest request) {
        User user = userService.findByUsername(username);
        Cart cart = cartService.getCartByUserId(user.getId());
        
        log.info("Creating order for user: {}, cart items count: {}", username, 
                cart != null ? cart.getCartItems().size() : 0);
        
        if (cart == null || cart.getCartItems().isEmpty()) {
            log.error("Cart is empty for user: {}. Cart: {}", username, cart);
            throw new RuntimeException("Cart is empty for user: " + username);
        }

        BigDecimal subtotal = calculateTotalAmount(cart);
        BigDecimal shippingFee = request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO;
        BigDecimal discountAmount = request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount);

        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .billingAddress(request.getBillingAddress())
                .phone(request.getPhone())
                .email(request.getEmail() != null ? request.getEmail() : user.getEmail())
                .customerName(request.getCustomerName())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(totalAmount)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .notes(request.getNotes())
                .orderDetails(new ArrayList<>())
                .build();

        // Create order details and update product stock
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            OrderDetail orderDetail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .subtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                    .build();

            order.getOrderDetails().add(orderDetail);
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Clear the cart after order is created
        cartService.clearCart(user.getId());

        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully: {}", savedOrder.getOrderNumber());
        
        return savedOrder;
    }

    @Override
    @Transactional
    public Order createDirectOrder(String username, CreateDirectOrderRequest request) {
        User user = userService.findByUsername(username);
        
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order items are required");
        }
        
        // Calculate total amount and validate products
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (CreateDirectOrderRequest.OrderItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + item.getProductId()));
            
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                                         ". Available: " + product.getStock() + ", Requested: " + item.getQuantity());
            }
            
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemSubtotal);
        }
        
        // Add shipping fee if provided
        if (request.getShippingFee() != null) {
            totalAmount = totalAmount.add(request.getShippingFee());
        }
        
        // Subtract discount if provided
        if (request.getDiscountAmount() != null) {
            totalAmount = totalAmount.subtract(request.getDiscountAmount());
        }
        
        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .billingAddress(request.getBillingAddress() != null ? request.getBillingAddress() : request.getShippingAddress())
                .phone(request.getPhone())
                .customerName(request.getCustomerName())
                .email(request.getEmail() != null ? request.getEmail() : user.getEmail())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(totalAmount)
                .shippingFee(request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO)
                .discountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO)
                .notes(request.getNotes())
                .orderDetails(new ArrayList<>())
                .build();

        // Create order details and update product stock
        for (CreateDirectOrderRequest.OrderItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + item.getProductId()));
            
            // Check stock availability
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                        ". Available: " + product.getStock() + ", Requested: " + item.getQuantity());
            }
            
            OrderDetail orderDetail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .quantity(item.getQuantity())
                    .price(product.getPrice())
                    .subtotal(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build();

            order.getOrderDetails().add(orderDetail);
            
            // Update product stock
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Direct order created successfully: {}", savedOrder.getOrderNumber());
        
        return savedOrder;
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        OrderStatus newStatus = OrderStatus.fromString(status);
        order.updateStatus(newStatus);
        
        log.info("Order {} status updated to {}", order.getOrderNumber(), newStatus);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order cancelOrder(Long id, String username, String reason) {
        Order order = getOrderById(id);
        User user = userService.findByUsername(username);
        
        // Check if user owns this order or is admin
        if (!order.getUser().getId().equals(user.getId())) {
            // Check if user is admin (you might want to implement role checking here)
            throw new RuntimeException("You don't have permission to cancel this order");
        }
        
        if (!order.canBeCancelled()) {
            throw new RuntimeException("Order cannot be cancelled in current status: " + order.getStatus());
        }

        // Restore product stock
        for (OrderDetail detail : order.getOrderDetails()) {
            Product product = detail.getProduct();
            product.setStock(product.getStock() + detail.getQuantity());
            productRepository.save(product);
        }

        order.updateStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason);
        
        log.info("Order {} cancelled by user {}", order.getOrderNumber(), username);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateTrackingNumber(Long id, String trackingNumber) {
        Order order = getOrderById(id);
        order.setTrackingNumber(trackingNumber);
        
        // If order is not shipped yet, update status to shipped
        if (order.getStatus() == OrderStatus.PROCESSING || order.getStatus() == OrderStatus.CONFIRMED) {
            order.updateStatus(OrderStatus.SHIPPED);
        }
        
        log.info("Tracking number {} added to order {}", trackingNumber, order.getOrderNumber());
        return orderRepository.save(order);
    }

    @Override
    public Map<String, Object> getOrderStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total orders
        long totalOrders = orderRepository.count();
        stats.put("totalOrders", totalOrders);
        
        // Orders by status
        Map<String, Long> ordersByStatus = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            long count = orderRepository.countByStatus(status);
            ordersByStatus.put(status.name(), count);
        }
        stats.put("ordersByStatus", ordersByStatus);
        
        // Total revenue
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        // Recent orders (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long recentOrders = orderRepository.countByOrderDateAfter(thirtyDaysAgo);
        stats.put("recentOrders", recentOrders);
        
        return stats;
    }

    private BigDecimal calculateTotalAmount(Cart cart) {
        return cart.getCartItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}