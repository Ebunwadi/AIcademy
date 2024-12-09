const express = require("express");
const {
  updateUserProfile,
  resetPassword,
  sendResetCode,
  getUserProfile,
} = require("../controllers/userController");
const protectRoute = require("../middleware/authMiddleware"); // Middleware for authentication

const router = express.Router();

router.put("/update", protectRoute, updateUserProfile);
// GET: Fetch the authenticated user's profile
router.get("/me", protectRoute, getUserProfile);
router.post("/reset-password", resetPassword);
router.post("/send-reset-code", sendResetCode);

module.exports = router;
