const http = require("http");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./config/server");
const initializeSocket = require("./sockets"); // initializes socket handlers

dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB

const server = http.createServer(app); // Create HTTP server
const io = initializeSocket(server); // Setup Socket.io
app.set("io", io); // Attach io to app for global access

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
