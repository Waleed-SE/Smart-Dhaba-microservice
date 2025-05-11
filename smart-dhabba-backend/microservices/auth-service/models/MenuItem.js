const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Snacks", "Drinks", "Meals"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    customizationOptions: {
      spiceLevels: [String],
      addons: [String],
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
