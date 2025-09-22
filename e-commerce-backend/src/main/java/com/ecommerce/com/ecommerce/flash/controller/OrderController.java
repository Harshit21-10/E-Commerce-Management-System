package com.ecommerce.com.ecommerce.flash.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.com.ecommerce.flash.dao.OrderDao;
import com.ecommerce.com.ecommerce.flash.entity.Order;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderDao orderDao;
    
    // ----------------------------
    // Cart Endpoints
    // ----------------------------
    
    // Add an item to the cart (creates an order with status "In Cart")
    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody Order order) {
        try {
            // Validate required fields
            if (order.getProduct() == null || order.getProduct().getId() == null) {
                return ResponseEntity.badRequest().body("Product ID is required");
            }
            if (order.getUser() == null || order.getUser().getId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (order.getQuantity() == null || order.getQuantity() < 1) {
                order.setQuantity(1); // Set default quantity if not provided or invalid
            }

            // Force the status to "In Cart"
            order.setStatus("In Cart");
            
            // Set the order date
            order.setOrderDate(LocalDateTime.now());

            Order savedOrder = orderDao.placeOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error adding item to cart: " + e.getMessage());
        }
    }
    
    // Get cart items for a user (only orders with status "In Cart")
    @GetMapping("/cart/user/{userId}")
    public ResponseEntity<?> getCartItemsByUser(@PathVariable Long userId) {
        try {
            List<Order> orders = orderDao.getOrdersByUserId(userId);
            List<Order> cartItems = orders.stream()
                                        .filter(o -> "In Cart".equals(o.getStatus()))
                                        .collect(Collectors.toList());
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error fetching cart items: " + e.getMessage());
        }
    }
    
    // Update cart item quantity
    @PutMapping("/cart/{orderId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long orderId, @RequestBody Order updatedOrder) {
        try {
            Optional<Order> existingOrder = orderDao.getOrderById(orderId);
            if (existingOrder.isPresent()) {
                Order order = existingOrder.get();
                order.setQuantity(updatedOrder.getQuantity());
                Order savedOrder = orderDao.updateOrder(order);
                return ResponseEntity.ok(savedOrder);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                   .body("Cart item not found with id: " + orderId);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error updating cart item: " + e.getMessage());
        }
    }
    
    // Remove an item from the cart
    @DeleteMapping("/cart/{orderId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long orderId) {
        try {
            Optional<Order> orderOptional = orderDao.getOrderById(orderId);
            if (orderOptional.isPresent()) {
                orderDao.deleteOrder(orderId);
                return ResponseEntity.ok("Item removed from cart.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                   .body("Cart item not found with id: " + orderId);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error removing cart item: " + e.getMessage());
        }
    }
    
    // Clear cart (remove all items with status "In Cart")
    @DeleteMapping("/cart/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            List<Order> cartItems = orderDao.getOrdersByUserId(userId)
                                          .stream()
                                          .filter(o -> "In Cart".equals(o.getStatus()))
                                          .collect(Collectors.toList());
            
            for (Order item : cartItems) {
                orderDao.deleteOrder(item.getId());
            }
            
            return ResponseEntity.ok("Cart cleared successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error clearing cart: " + e.getMessage());
        }
    }
    
    // ----------------------------
    // Order Endpoints
    // ----------------------------
    
    // Place an order (for immediate purchase)
    @PostMapping("/orders")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        try {
            // Validate required fields
            if (order.getProduct() == null || order.getProduct().getId() == null) {
                return ResponseEntity.badRequest().body("Product ID is required");
            }
            if (order.getUser() == null || order.getUser().getId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (order.getQuantity() == null || order.getQuantity() < 1) {
                order.setQuantity(1);
            }

            // Set shipping details from the request
            if (order.getShippingDetails() != null) {
                order.setShippingFirstName(order.getShippingDetails().getFirstName());
                order.setShippingLastName(order.getShippingDetails().getLastName());
                order.setShippingAddress(order.getShippingDetails().getAddress());
                order.setShippingCity(order.getShippingDetails().getCity());
                order.setShippingState(order.getShippingDetails().getState());
                order.setShippingZipCode(order.getShippingDetails().getZipCode());
                order.setShippingCountry(order.getShippingDetails().getCountry());
                order.setShippingPhone(order.getShippingDetails().getPhone());
                order.setPaymentMethod(order.getShippingDetails().getPaymentMethod());
                order.setCardLastFour(order.getShippingDetails().getCardLastFour());
            }

            // Set order date and status
            order.setOrderDate(LocalDateTime.now());
            if (order.getStatus() == null) {
                order.setStatus("PENDING");
            }

            Order savedOrder = orderDao.placeOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error placing order: " + e.getMessage());
        }
    }
    
    // Get a single order by id
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            Optional<Order> orderOpt = orderDao.getOrderById(orderId);
            if (orderOpt.isPresent()) {
                return ResponseEntity.ok(orderOpt.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                   .body("Order not found with id: " + orderId);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error fetching order: " + e.getMessage());
        }
    }
    
    // Get orders for a user (all orders, regardless of status)
    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        try {
            List<Order> orders = orderDao.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error fetching orders: " + e.getMessage());
        }
    }
    
    // Get orders for a product owner
    @GetMapping("/orders/owner/{productOwnerId}")
    public ResponseEntity<?> getOrdersByProductOwner(@PathVariable Long productOwnerId) {
        try {
            List<Order> orders = orderDao.getOrdersByProductOwnerId(productOwnerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error fetching orders: " + e.getMessage());
        }
    }
    
    // Update an order's status (e.g., Accept or Reject)
    @PutMapping("/orders/{orderId}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Order updatedOrder) {
        try {
            Optional<Order> existingOrderOpt = orderDao.getOrderById(orderId);
            if (existingOrderOpt.isPresent()) {
                Order existingOrder = existingOrderOpt.get();
                existingOrder.setStatus(updatedOrder.getStatus());
                Order savedOrder = orderDao.updateOrder(existingOrder);
                return ResponseEntity.ok(savedOrder);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error updating order: " + e.getMessage());
        }
    }
    
    // DELETE endpoint to cancel an order
    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        try {
            Optional<Order> orderOptional = orderDao.getOrderById(orderId);
            if (orderOptional.isPresent()) {
                orderDao.deleteOrder(orderId);
                return ResponseEntity.ok("Order cancelled successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                   .body("Order not found with id: " + orderId);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error cancelling order: " + e.getMessage());
        }
    }

    // Add a new endpoint to get all orders
    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderDao.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body("Error fetching orders: " + e.getMessage());
        }
    }
}
