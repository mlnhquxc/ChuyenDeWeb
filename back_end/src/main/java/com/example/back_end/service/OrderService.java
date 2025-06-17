package com.example.back_end.service;

import com.example.back_end.constant.OrderStatus;
import com.example.back_end.dto.request.CreateDirectOrderRequest;
import com.example.back_end.dto.request.CreateOrderRequest;
import com.example.back_end.entity.*;
import com.example.back_end.repositories.OrderRepository;
import com.example.back_end.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService implements IOrderService {
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
        return orderRepository.findByUserId(user.getId(), pageable);
    }

    @Override
    public List<Order> getOrdersByStatus(String status) {
        OrderStatus orderStatus = OrderStatus.fromString(status);
        return orderRepository.findByStatus(orderStatus);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
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
        
        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .phone(request.getPhone())
                .customerName(user.getFullname())
                .email(user.getEmail())
                .paymentMethod(request.getPaymentMethod())
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
        cartService.clearCart(user.getId());

        return orderRepository.save(order);
    }

    @OverrideAdd commentMore actions
    @Transactional
    public Order createDirectOrder(String username, CreateDirectOrderRequest request) {
        User user = userService.findByUsername(username);
        
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order items are required");
        }
        
        // Calculate total amount and validate products
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderDetail> orderDetails = new ArrayList<>();
        
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
            Product product = productRepository.findById(item.getProductId()).get();
            
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

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        OrderStatus orderStatus = OrderStatus.fromString(status);
        order.updateStatus(orderStatus);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order cancelOrder(Long id, String username, String reason) {
        Order order = getOrderById(id);
        User user = userService.findByUsername(username);
        
        // Check if the order belongs to the user or if the user is an admin
        if (!order.getUser().getId().equals(user.getId()) && 
            !user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"))) {
            throw new RuntimeException("You are not authorized to cancel this order");
        }
        
        // Check if the order can be cancelled
        if (!order.canBeCancelled()) {
            throw new RuntimeException("Order cannot be cancelled in its current status");
        }
        
        order.updateStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason);
        
        // Return items to inventory
        for (OrderDetail detail : order.getOrderDetails()) {
            Product product = detail.getProduct();
            product.setStock(product.getStock() + detail.getQuantity());
            productRepository.save(product);
        }
        
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateTrackingNumber(Long id, String trackingNumber) {
        Order order = getOrderById(id);
        order.setTrackingNumber(trackingNumber);
        
        // If tracking number is set, update status to SHIPPED if it's in PROCESSING
        if (order.getStatus() == OrderStatus.PROCESSING) {
            order.updateStatus(OrderStatus.SHIPPED);
        }
        
        return orderRepository.save(order);
    }

    @Override
    public Map<String, Object> getOrderStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Count orders by status
        Map<String, Long> ordersByStatus = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            long count = orderRepository.countByStatus(status);
            ordersByStatus.put(status.name(), count);
        }
        statistics.put("ordersByStatus", ordersByStatus);
        
        // Total revenue
        BigDecimal totalRevenue = orderRepository.findByStatus(OrderStatus.DELIVERED).stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        statistics.put("totalRevenue", totalRevenue);
        
        // Total orders
        long totalOrders = orderRepository.count();
        statistics.put("totalOrders", totalOrders);
        
        return statistics;
    }

    private BigDecimal calculateTotalAmount(Cart cart) {
        return cart.getCartItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
} 