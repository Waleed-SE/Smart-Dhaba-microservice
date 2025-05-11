const MenuItem = require("../models/MenuItem");

const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, image } = req.body;

    const newItem = new MenuItem({
      name,
      category,
      price,
      image, // <-- reference to filename from UploadedFile
    });

    await newItem.save();
    res.status(201).json({ message: "Menu item created", newItem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          category: req.body.category,
          price: req.body.price,
          image: req.body.image, // <-- update reference if changed
        },
      },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
