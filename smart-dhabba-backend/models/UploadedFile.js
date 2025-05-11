const mongoose = require("mongoose");

const uploadedFileSchema = new mongoose.Schema({
  filename: String, // actual saved filename
  originalname: String, // original uploaded name
  mimetype: String,
  size: Number,
  referenceType: String, // e.g. 'menu', 'order', 'user-avatar',
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UploadedFile", uploadedFileSchema);
