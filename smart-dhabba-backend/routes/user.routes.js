const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  promoteToServer,
  saveLocation,
  getAllStudentLocations,
} = require("../controllers/user.controller");
const { protect, requireRole } = require("../middleware/auth.middleware");

router.get("/", protect, requireRole("admin"), getAllUsers);
router.put("/:userId/role", protect, requireRole("admin"), updateUserRole);
router.delete("/:userId", protect, requireRole("admin"), deactivateUser);
router.put(
  "/:userId/promote-server",
  protect,
  requireRole("admin"),
  promoteToServer
);
// POST /students/save-location
router.post("/save-location", protect, requireRole("student"), saveLocation);
router.get(
  "/students-locations",
  protect,
  requireRole("admin"),
  getAllStudentLocations
);

module.exports = router;
