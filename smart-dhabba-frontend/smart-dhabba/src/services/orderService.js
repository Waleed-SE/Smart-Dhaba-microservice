import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Place Order request
export const placeOrderRequest = async (orderData, token) => {
  try {
    const response = await axios.post(`${API_URL}/orders/`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw new Error(error.response?.data?.message || "Failed to place order");
  }
};

// Fetch all orders
export const getAllOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

// Update order status (Completed, Cancelled, etc.)
export const updateOrderStatus = async (
  orderId,
  status,
  paymentStatus = "Pending",
  token
) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/status`,
      { status, paymentStatus }, // Data goes here
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update order status"
    );
  }
};

// Update payment status (Paid, Refunded, etc.)
export const updatePaymentStatus = async (orderId, paymentStatus, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/payment-status`,
      { paymentStatus }, // Data goes here
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update payment status"
    );
  }
};
