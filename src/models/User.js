const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,   
    },
    password: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
    },
    role: {
        type: String,
        enum: ['client', 'provider'],
        default: 'client',
    },
    refreshToken: {
        type: String,
    },
    imgPublicId: {
        type: String,
    },
} , {
    timestamps: true,
});

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().required().trim(),    
        email: Joi.string().required().email().trim(),
        password: Joi.string().required().min(6).trim(),
    });
    return schema.validate(user);
}

module.exports = {
    User: mongoose.model('User', userSchema),
    validateUser,
};