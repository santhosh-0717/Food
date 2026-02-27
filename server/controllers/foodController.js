const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
exports.getFoods = async (req, res) => {
    try {
        let query = {};

        // Filter by restaurant
        if (req.query.restaurant) {
            query.restaurant = req.query.restaurant;
        }

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Search by name
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        const foods = await Food.find(query).populate('restaurant', 'name deliveryTime rating');

        res.status(200).json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
exports.getFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate('restaurant', 'name address deliveryTime rating deliveryFee');

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }

        res.status(200).json({
            success: true,
            data: food
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new food
// @route   POST /api/foods
// @access  Private/Admin/RestaurantOwner
exports.createFood = async (req, res) => {
    try {
        const { restaurant } = req.body;

        // Check if restaurant exists
        const restaurantExists = await Restaurant.findById(restaurant);
        
        if (!restaurantExists) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        // If restaurant owner, check if they own the restaurant
        if (req.user.role === 'restaurant_owner') {
            if (restaurantExists.owner.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only add food to your own restaurant'
                });
            }
        }

        const food = await Food.create(req.body);

        res.status(201).json({
            success: true,
            data: food
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Private/Admin/RestaurantOwner
exports.updateFood = async (req, res) => {
    try {
        let food = await Food.findById(req.params.id).populate('restaurant');

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }

        // If restaurant owner, check if they own the restaurant
        if (req.user.role === 'restaurant_owner') {
            if (food.restaurant.owner.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update food from your own restaurant'
                });
            }
        }

        // Don't allow changing restaurant
        delete req.body.restaurant;

        food = await Food.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: food
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Private/Admin/RestaurantOwner
exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate('restaurant');

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            });
        }

        // If restaurant owner, check if they own the restaurant
        if (req.user.role === 'restaurant_owner') {
            if (food.restaurant.owner.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete food from your own restaurant'
                });
            }
        }

        await Food.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};