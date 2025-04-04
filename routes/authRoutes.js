const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/authController");
const {
  GoogleSignIn,
} = require("../controllers/socialAuthController");
const router = express.Router();

router.post("/register", register);
router.post("/google-signin", GoogleSignIn);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
