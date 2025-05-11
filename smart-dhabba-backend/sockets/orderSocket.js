module.exports = function setupOrderSocket(io) {
  const orderNamespace = io.of("/orders");

  orderNamespace.on("connection", (socket) => {
    console.log("📦 User connected to order tracking");

    socket.on("joinOrder", (orderId) => {
      socket.join(orderId);
      console.log(`🧾 Joined order room: ${orderId}`);
    });

    socket.on("leaveOrder", (orderId) => {
      socket.leave(orderId);
      console.log(`🚪 Left order room: ${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log("📴 Disconnected from order tracking");
    });
  });
};
