const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide food name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide description']
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: 0
    },
    image: {
        type: String,
        default: 'default-food.png'
    },
    category: {
        type: String,
        required: [true, 'Please select category'],
        enum: ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Chinese', 'Italian', 'Indian', 'Fast Food']
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    preparationTime: {
        type: String,
        default: '15-20 mins'
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.models.Food || mongoose.model('Food', foodSchema);