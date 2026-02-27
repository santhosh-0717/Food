const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getRestaurantOrders,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');

// Create order
router.post('/', protect, createOrder);

// Get my orders
router.get('/myorders', protect, getMyOrders);

// Get restaurant orders
router.get('/restaurant/:restaurantId', protect, getRestaurantOrders);

// Get single order
router.get('/:id', protect, getOrder);

// Update order status
router.put('/:id/status', protect, updateOrderStatus);

// Get all orders (admin only)
router.get('/', protect, authorize('admin'), getAllOrders);

module.exports = router;