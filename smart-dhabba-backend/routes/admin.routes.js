const express = require("express");
const router = express.Router();
const { getAdminSummary } = require("../controllers/admin.controller");

const { protect, requireRole } = require("../middleware/auth.middleware");

const userRoutes = require("./user.routes");
const menuRoutes = require("./menu.routes");
const analyticsRoutes = require("./analytics.routes");
const serverRoutes = require("./server.routes");

router.use("/users", userRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/servers", serverRoutes);
router.use("/menu", menuRoutes);
// Admin only

router.get("/summary", protect, requireRole("admin"), getAdminSummary);

module.exports = router;
