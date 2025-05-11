const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect, requireRole } = require("../middleware/auth.middleware");
const UploadedFile = require("../models/UploadedFile");

// Multer storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload file
router.post(
  "/",
  protect,
  requireRole("admin"),
  upload.single("file"),
  async (req, res) => {
    try {
      const newFile = new UploadedFile({
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user._id,
      });

      await newFile.save();
      res.status(200).json({ message: "File uploaded", file: newFile });
    } catch (err) {
      res.status(500).json({ error: "File upload failed" });
    }
  }
);

// Get all uploaded files
router.get("/", protect, requireRole("admin"), async (req, res) => {
  const files = await UploadedFile.find().sort({ createdAt: -1 });
  res.json(files);
});

// Delete file (DB + disk)
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  const file = await UploadedFile.findById(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  try {
    fs.unlinkSync("uploads/" + file.filename); // delete physical file
    await file.deleteOne(); // delete DB record
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// Rename file (update DB originalname)
router.put("/:id", protect, requireRole("admin"), async (req, res) => {
  const file = await UploadedFile.findById(req.params.id);
  if (!file) return res.status(404).json({ error: "File not found" });

  file.originalname = req.body.originalname || file.originalname;
  await file.save();

  res.json({ message: "File renamed", file });
});

module.exports = router;
