const mongoose = require("mongoose");
const Joi = require("joi");

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    imageUrl: {
        type: String,
    },

    imagePublicId: {
        type: String,
    },

    category: {
        type: String,
        trim: true,
        required: true,
    },

    averageRating: {
        type: Number,
        default: 0,
    },

    totalReviews: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

const validateCreateService = (service) => {
    const schema = Joi.object({
        title: Joi.string().required().trim(),
        description: Joi.string().required().min(20).trim(),
        price: Joi.number().required().positive(),
        category: Joi.string().trim(),
    });
    return schema.validate(service);
}

module.exports = {
    Service: mongoose.model("Service", serviceSchema),
    validateCreateService,
};