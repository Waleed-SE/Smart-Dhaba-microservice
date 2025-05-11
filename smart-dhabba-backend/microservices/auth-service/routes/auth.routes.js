const express = require("express");
const {
  signup,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/test", (req, res) => {
  res.send("Auth service is live!");
});

module.exports = router;
