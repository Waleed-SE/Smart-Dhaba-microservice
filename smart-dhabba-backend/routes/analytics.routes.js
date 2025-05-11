const express = require("express");
const router = express.Router();
const {
  getTotalOrdersToday,
  getTopItems,
  getTopRatedServers,
} = require("../controllers/analytics.controller");
const { protect, requireRole } = require("../middleware/auth.middleware");

router.get("/orders-today", protect, requireRole("admin"), getTotalOrdersToday);
router.get("/top-items", protect, requireRole("admin"), getTopItems);
router.get("/top-servers", protect, requireRole("admin"), getTopRatedServers);

module.exports = router;
