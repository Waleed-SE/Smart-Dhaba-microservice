import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../services/orderService"; // Updated import

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders(token); // Fetch orders using orderService
        setOrders(response);
      } catch (error) {
        setError("Failed to fetch orders");
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleUpdateStatus = async (
    orderId,
    status,
    paymentStatus = "Unpaid"
  ) => {
    try {
      await updateOrderStatus(orderId, status, paymentStatus, token); // Use orderService to update status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: status, paymentStatus: paymentStatus }
            : order
        )
      );
      handleUpdatePaymentStatus(orderId, paymentStatus);
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await updatePaymentStatus(orderId, paymentStatus, token); // Use orderService to update payment status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, paymentStatus: paymentStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating payment status", error);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Orders</h2>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>{order.orderStatus}</td>
              <td>{order.paymentStatus}</td>
              <td>
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      order._id,
                      "Completed",
                      order.paymentStatus
                    )
                  }
                  disabled={order.orderStatus === "Completed"}
                  style={{
                    padding: "8px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(order._id, "Cancelled")}
                  disabled={order.orderStatus === "Cancelled"}
                  style={{
                    padding: "8px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Mark as Cancelled
                </button>
                <button
                  onClick={() => handleUpdatePaymentStatus(order._id, "Paid")}
                  disabled={order.paymentStatus === "Paid"}
                  style={{
                    padding: "8px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Mark as Paid
                </button>
                {/* <button
                  onClick={() =>
                    handleUpdatePaymentStatus(order._id, "Refunded")
                  }
                  disabled={order.paymentStatus === "Refunded"}
                  style={{
                    padding: "8px",
                    backgroundColor: "#ffc107",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Mark as Refunded
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;
