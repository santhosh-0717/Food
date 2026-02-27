const express = require('express');
const {
    getRestaurants,
    getRestaurant,
    getMyRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');
const { protect, authorize, checkRestaurantOwner } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);

// Restaurant owner routes
router.get('/my/restaurants', protect, authorize('restaurant_owner', 'admin'), getMyRestaurants);

// Create restaurant (admin or restaurant_owner)
router.post('/', protect, authorize('admin', 'restaurant_owner'), createRestaurant);

// Update restaurant (must own it or be admin)
router.put('/:id', protect, authorize('admin', 'restaurant_owner'), checkRestaurantOwner, updateRestaurant);

// Delete restaurant (admin only)
router.delete('/:id', protect, authorize('admin'), deleteRestaurant);

module.exports = router;