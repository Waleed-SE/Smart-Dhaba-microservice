import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { placeOrderRequest } from "../services/orderService";

const PlaceOrderPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const getTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in!");
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
        customization: {
          spiceLevel: "Medium",
          addons: [],
        },
      })),
      totalAmount: getTotalAmount(),
      serverId: null,
      tableId: null,
      groupId: null,
      isFacultyPriority: false,
    };

    try {
      setPlacingOrder(true);
      const result = await placeOrderRequest(orderData, token);
      console.log("Order Placed:", result);

      setSuccessMessage("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Order failed! Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Your Cart</h1>

      {successMessage && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {successMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
              }}
            >
              <h3>{item.name}</h3>
              <p>Price: Rs. {item.price}</p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item._id, parseInt(e.target.value))
                  }
                  style={{ width: "60px" }}
                />
              </div>
              <p>Total: Rs. {item.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item._id)}
                style={{
                  marginTop: "10px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Grand Total: Rs. {getTotalAmount()}</h2>

            <button
              onClick={clearCart}
              style={{
                marginTop: "20px",
                backgroundColor: "#007bff",
                color: "white",
                marginRight: "10px",
              }}
            >
              Clear Cart
            </button>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              style={{
                marginTop: "20px",
                backgroundColor: "#28a745",
                color: "white",
              }}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaceOrderPage;
