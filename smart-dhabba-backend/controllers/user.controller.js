const User = require("../models/User");
const Server = require("../models/Server");

const getAllUsers = async (req, res) => {
  try {
    const role = req.query.role;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await User.findByIdAndDelete(userId); // optionally use a 'status' flag instead
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const promoteToServer = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = "server";
    await user.save();

    // Create a Server profile if not already created
    const exists = await Server.findOne({ userId: user._id });
    if (!exists) {
      const server = new Server({ userId: user._id });
      await server.save();
    }

    res.status(200).json({ message: "User promoted to server", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const saveLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const student = await User.findById(req.user._id);
    student.location = { lat, lng };
    await student.save();
    res.status(200).json({ message: "Location saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save location" });
  }
};

const getAllStudentLocations = async (req, res) => {
  try {
    const students = await User.find(
      {
        role: "student",
        location: { $exists: true, $ne: null },
      },
      "name email location" // return only needed fields
    );

    res.json(students);
  } catch (err) {
    console.error("Error fetching student locations", err);
    res.status(500).json({ error: "Failed to fetch student locations" });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  saveLocation,
  promoteToServer,
  getAllStudentLocations,
};
