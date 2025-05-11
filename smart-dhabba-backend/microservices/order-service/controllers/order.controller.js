const Order = require("../models/Order");
const PDFDocument = require("pdfkit");
const MenuItem = require("../models/MenuItem");
const Table = require("../models/Table");

const getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.menuItem")
      .populate("userId");

    if (!order) return res.status(404).json({ error: "Order not found" });

    // Only owner can download
    if (order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Setup PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("Smart Dhabba - Order Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`User: ${order.userId.username}`);
    doc.moveDown();

    doc.text("Items:");
    order.items.forEach((item) => {
      doc.text(
        `- ${item.menuItem.name} × ${item.quantity} = Rs. ${
          item.menuItem.price * item.quantity
        }`
      );
    });

    doc.moveDown();
    doc.text(`Total: Rs. ${order.totalAmount}`, { align: "right" });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      groupId,
      serverId,
      tableId,
      isFacultyPriority,
    } = req.body;

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User not found in request." });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      isFacultyPriority,
      paymentStatus: "Paid", // You can adjust this with real payment logi  c
      orderStatus: "Pending",
      totalAmount,
      groupId,
      serverId,
      tableId,
    });
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.menuItem");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.orderStatus = status;
    await order.save();

    // ✅ Emit update using existing io instance
    const io = req.app.get("io");
    io.of("/orders").to(orderId).emit("orderStatusUpdate", {
      orderId,
      status,
    });

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email") // Populate user details (excluding password)
      .populate("items.menuItem", "name price") // Populate menu items (name and price)
      .populate("serverId", "username") // Populate server details
      .populate("tableId", "tableNumber capacity") // Populate table details (tableNumber and capacity)
      .select("totalAmount orderStatus paymentStatus createdAt"); // Select relevant fields for the response

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err); // Add a more detailed log
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body; // Get paymentStatus from the request body

  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update payment status only
    order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json(order); // Return the updated order
  } catch (err) {
    res.status(500).json({ error: "Error updating payment status" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderInvoice,
  getAllOrders,
  updatePaymentStatus,
};
