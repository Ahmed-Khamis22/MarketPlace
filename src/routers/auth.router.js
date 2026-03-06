const router = require("express").Router();
const { User, validateUser } = require("../models/User");
const { registerUser , loginUser } = require("../controllers/auth.controller");

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

module.exports = router;