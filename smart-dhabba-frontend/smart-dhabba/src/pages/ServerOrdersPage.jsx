import React, { useEffect, useState } from "react";
import axios from "axios";

const ServerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    fetchOrders();
  }, [token]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Orders for Server</h2>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.orderStatus}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>
                <button
                  onClick={() => handleUpdateStatus(order._id, "Completed")}
                  disabled={order.orderStatus === "Completed"}
                >
                  Mark as Completed
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServerOrdersPage;
