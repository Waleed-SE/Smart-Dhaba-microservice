const {
  registerUser,
  loginUser,
  googleAuth,
  generateHash,
} = require("../services/auth.service");

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Email not registered" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 mins
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.json({ message: "Reset link sent to email" });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  user.password = await generateHash(newPassword);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password has been reset" });
};

// Signup
const signup = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const { token, user } = await loginUser(req.body);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// Google OAuth Login/Register
const handleGoogleAuth = async (req, res) => {
  try {
    const { token, user } = await googleAuth(req.body);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Google login failed" });
  }
};

module.exports = {
  signup,
  login,
  googleAuth: handleGoogleAuth,
  forgotPassword,
  resetPassword,
};
