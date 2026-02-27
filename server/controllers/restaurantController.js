const Restaurant = require('../models/Restaurant');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = async (req, res) => {
    try {
        let query = { isActive: true };

        // If restaurant owner, show only their restaurants
        if (req.user && req.user.role === 'restaurant_owner') {
            query.owner = req.user.id;
        }

        const restaurants = await Restaurant.find(query).populate('owner', 'name email');

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get logged in user's restaurants
// @route   GET /api/restaurants/my/restaurants
// @access  Private (Restaurant Owner)
exports.getMyRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ owner: req.user.id });

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin/RestaurantOwner
exports.createRestaurant = async (req, res) => {
    try {
        // Add user as owner
        req.body.owner = req.user.id;

        // Restaurant owners can only create one restaurant (optional business rule)
        if (req.user.role === 'restaurant_owner') {
            const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });
            
            if (existingRestaurant) {
                return res.status(400).json({
                    success: false,
                    message: 'You already have a restaurant. Contact admin to create multiple restaurants.'
                });
            }
        }

        const restaurant = await Restaurant.create(req.body);

        res.status(201).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin/RestaurantOwner
exports.updateRestaurant = async (req, res) => {
    try {
        // Don't allow changing owner
        delete req.body.owner;

        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin only
exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

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