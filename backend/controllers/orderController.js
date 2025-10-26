const Order = require("../models/Order");
const mongoose = require("mongoose");

// ------------------ CUSTOMER FUNCTIONS ------------------

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders of logged-in customer
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order details (customer)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only customer who placed order or admin can access
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ SELLER FUNCTIONS ------------------

// Get all orders for the logged-in seller
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "orderItems.seller._id": req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item-level status by seller
const updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.orderItems.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    item.itemStatus = status;
    await order.save();
    res.json({ message: "Item status updated", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ ADMIN FUNCTIONS ------------------

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update overall order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add admin note
const addOrderNote = async (req, res) => {
  try {
    const { orderId, message } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.notes.push({ message, addedBy: "Admin" });
    await order.save();
    res.json({ message: "Note added", notes: order.notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------ DELIVERY FUNCTIONS ------------------

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, isDelivered } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDelivered = isDelivered;
    order.deliveredAt = isDelivered ? Date.now() : null;
    await order.save();
    res.json({ message: "Delivery status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateItemStatus,
  getAllOrders,
  updateOrderStatus,
  addOrderNote,
  updateDeliveryStatus,
};
