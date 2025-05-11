const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const {
  signup,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB
// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // This is required to parse JSON in the request body

// Routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/google", googleAuth);
app.post("/forgot-password", forgotPassword);
app.post("/reset-password/:token", resetPassword);
app.get("/test", (req, res) => {
  res.send("Auth service is live!");
});

// Start the server
const PORT = process.env.AUTH_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
