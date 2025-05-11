const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express(); // ✅ Declare app before using it

// Middleware
app.use(cors());

// Proxy /api/auth to localhost:3001

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:3001", // The backend running on port 3001
    changeOrigin: true, // Ensure origin is set correctly for CORS
    pathRewrite: {
      "^/api/auth": "", // Proxy is rewriting the path (optional if path structure is the same)
    },
    logLevel: "debug", // Enable logging for debugging
  })
);

app.use(express.json());

// Routes
const menuRoutes = require("../routes/menu.routes");
app.use("/api/menu", menuRoutes);

const orderRoutes = require("../routes/order.routes");
app.use("/api/orders", orderRoutes);

const groupRoutes = require("../routes/group.routes");
app.use("/api/groups", groupRoutes);

const adminRoutes = require("../routes/admin.routes");
app.use("/api/admin", adminRoutes);

const userRoutes = require("../routes/user.routes");
app.use("/api/user", userRoutes);

const uploadRoutes = require("../routes/upload.routes");
app.use("/api/uploads", uploadRoutes);
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.send("Smart Dhabba Backend is live!");
});

module.exports = app;
