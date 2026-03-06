const router = require("express").Router();
const { getUserProfile, updateUserProfile, getAllUsers, changeUserRole } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleWare");
const upload = require("../middlewares/upload");
const providerize = require("../middlewares/Authorize");

router.get("/me", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, upload.single("img"), updateUserProfile);
router.get("/all", authMiddleware, providerize, getAllUsers);
router.put("/role/:id", authMiddleware, providerize, changeUserRole);

module.exports = router;