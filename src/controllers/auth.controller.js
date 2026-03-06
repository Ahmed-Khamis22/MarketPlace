const User = require('../models/User').User
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// GENERATE AcCESS TOKEN
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Gnerate refresh token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // VALIDATE FIELDS
    if (!name || !email || !password || !confirmPassword) {
        res.status(400);
        throw new Error('Please fill all fields');
    }
    // CHECK IF PASSWORDS MATCH
    if (password !== confirmPassword) {
        res.status(400);
        throw new Error('Passwords do not match');
    }
    // CHECK IF USER EXISTS
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: accessToken,
    });
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // VALIDATE FIELDS
    if (!email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    // CHECK IF USER EXISTS
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error('User does not exist');
    }

    // CHECK IF PASSWORD IS CORRECT
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: accessToken,
    });
});

module.exports = {
    registerUser,
    loginUser,
};