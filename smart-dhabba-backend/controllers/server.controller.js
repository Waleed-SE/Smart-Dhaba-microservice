const Server = require("../models/Server");

const getAllServers = async (req, res) => {
  try {
    const servers = await Server.find().populate("userId", "username email");
    res.status(200).json(servers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch servers" });
  }
};

const toggleServerAvailability = async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    if (!server) return res.status(404).json({ error: "Server not found" });

    server.isAvailable = !server.isAvailable;
    await server.save();
    res.status(200).json({ message: "Server availability updated", server });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAllServers, toggleServerAvailability };
