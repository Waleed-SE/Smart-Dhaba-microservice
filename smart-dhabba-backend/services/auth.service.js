const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateHash = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// Traditional Registration
const registerUser = async ({ username, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: role || "student",
  });

  await user.save();
  return user;
};

// Traditional Login
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user);
  return { token, user };
};

// Google Login or Register
const googleAuth = async ({ email, name, picture }) => {
  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await generateHash(randomPassword);

    user = await User.create({
      username: name,
      email,
      password: hashedPassword,
      picture,
      role: "student", // default role for Google login
    });
  }

  const token = generateToken(user);
  return { token, user };
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  generateHash,
};
