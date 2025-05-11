const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderInvoice,
  getAllOrders,
  updatePaymentStatus,
} = require("../controllers/order.controller");
const { protect, requireRole } = require("../middleware/auth.middleware");

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getUserOrders);
router.put("/:orderId/status", protect, updateOrderStatus);
router.get("/:orderId/invoice", protect, getOrderInvoice);
router.get("/", protect, getAllOrders);
router.put("/:orderId/payment-status", protect, updatePaymentStatus);

module.exports = router;
