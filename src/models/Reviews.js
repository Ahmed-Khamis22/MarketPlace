const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
} , {timestamps: true});

reviewSchema.index({ serviceId: 1, userId: 1 }, { unique: true });

module.exports = {
    Review: mongoose.model("Review", reviewSchema),
    }