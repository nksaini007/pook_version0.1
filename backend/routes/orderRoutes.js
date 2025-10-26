const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ------------------ CUSTOMER ROUTES ------------------

// Create a new order
router.post("/", protect, authorize("customer"), orderController.createOrder);

// Get logged-in customer's orders
router.get("/myorders", protect, authorize("customer"), orderController.getMyOrders);

// Get single order details (customer)
router.get("/:id", protect, authorize("customer", "admin"), orderController.getOrderById);

// ------------------ SELLER ROUTES ------------------

// Get all orders for logged-in seller
router.get("/seller/orders", protect, authorize("seller"), orderController.getSellerOrders);

// Update item-level status by seller
router.put("/seller/item-status", protect, authorize("seller"), orderController.updateItemStatus);

// ------------------ ADMIN ROUTES ------------------

// Get all orders
router.get("/", protect, authorize("admin"), orderController.getAllOrders);

// Update overall order status
router.put("/admin/order-status", protect, authorize("admin"), orderController.updateOrderStatus);

// Add admin note
router.put("/admin/add-note", protect, authorize("admin"), orderController.addOrderNote);

// ------------------ DELIVERY ROUTES ------------------

// Update delivery status
router.put("/delivery-status", protect, authorize("delivery"), orderController.updateDeliveryStatus);

module.exports = router;
