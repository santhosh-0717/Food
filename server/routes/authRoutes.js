const express = require('express');
const {
    register,
    registerRestaurantOwner,
    registerDelivery,
    createUserByAdmin,
    login,
    getMe
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public registration routes
router.post('/register', register);  // Customer registration
router.post('/register/restaurant-owner', registerRestaurantOwner);  // Restaurant owner registration
router.post('/register/delivery', registerDelivery);  // Delivery partner registration

// Admin-only route to create any user
router.post('/create-user', protect, authorize('admin'), createUserByAdmin);

// Login route (all roles)
router.post('/login', login);

// Get current user (protected)
router.get('/me', protect, getMe);

module.exports = router;