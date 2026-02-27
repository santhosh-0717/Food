const express = require('express');
const {
    getFoods,
    getFood,
    createFood,
    updateFood,
    deleteFood
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getFoods)
    .post(protect, authorize('admin', 'restaurant_owner'), createFood);

router.route('/:id')
    .get(getFood)
    .put(protect, authorize('admin', 'restaurant_owner'), updateFood)
    .delete(protect, authorize('admin', 'restaurant_owner'), deleteFood);

module.exports = router;