import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/${orderId}/invoice`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Important for downloading PDF
        }
      );
      // Create a link element to download the file
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `invoice_${orderId}.pdf`; // Naming the downloaded file
      link.click();
    } catch (error) {
      console.error("Error downloading invoice", error);
      alert("Failed to download invoice.");
    }
  };

  if (loading) return <p>Loading your orders...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Orders</h2>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>{order.orderStatus}</td>
              <td>
                {order.orderStatus === "Completed" && (
                  <button
                    onClick={() => handleDownloadInvoice(order._id)}
                    style={{
                      padding: "8px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Download Invoice
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
