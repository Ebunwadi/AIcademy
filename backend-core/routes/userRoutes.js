const express = require("express");
const {
  updateUserProfile,
  resetPassword,
  sendResetCode,
  getUserProfile,
} = require("../controllers/userController");
const protectRoute = require("../middlewares/authMiddleware"); // Middleware for authentication
const { uploadErrorHandler, upload } = require("../middlewares/fileUpload");

const router = express.Router();

router.put("/update", protectRoute, upload.single("profilePicture"), uploadErrorHandler, updateUserProfile);
router.get("/me", protectRoute, getUserProfile);
router.post("/reset-password", resetPassword);
router.post("/send-reset-code", sendResetCode);

module.exports = router;
