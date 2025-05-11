const express = require("express");
const router = express.Router();
const {
  getAllServers,
  toggleServerAvailability,
} = require("../controllers/server.controller");
const { protect, requireRole } = require("../middleware/auth.middleware");

router.get("/", protect, requireRole("admin"), getAllServers);
router.put(
  "/:serverId/toggle",
  protect,
  requireRole("admin"),
  toggleServerAvailability
);

module.exports = router;
