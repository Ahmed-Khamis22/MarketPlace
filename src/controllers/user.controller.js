const { User } = require('../models/User');
const asyncHandler = require('express-async-handler');
const cloudinary = require("cloudinary").v2;

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // update basic fields
  user.name = name || user.name;

  // email uniqueness check (مهم)
  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = email;
  }

  // password update
  if (password) {
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  // image update
  if (req.file) {
    if (user.imgPublicId) {
      await cloudinary.uploader.destroy(user.imgPublicId);
    }
    user.imgUrl = req.file.path;
    user.imgPublicId = req.file.filename;
  }

  const updatedUser = await user.save();

  // safe response without password and tokens
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    imgUrl: updatedUser.imgUrl || null,
  });
});

// Get all users (for Providers)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password -refreshToken');
    res.json(users);
});

// Change user role (Admin only)
const changeUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['client', 'provider'].includes(role)) {
        res.status(400);
        throw new Error('Invalid role');
    }
    
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    user.role = role;
    const updatedUser = await user.save();
    res.json(updatedUser);
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    changeUserRole,
};