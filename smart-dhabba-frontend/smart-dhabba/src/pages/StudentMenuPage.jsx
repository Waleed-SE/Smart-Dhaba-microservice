import React, { useEffect, useState } from "react";
import { fetchMenuItems } from "../services/menuService";
import { useCart } from "../context/CartContext";

const StudentMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { addToCart } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchMenuItems();
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load menu items.");
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    addToCart({ ...item, quantity });
    setSuccessMessage(`Added ${quantity} x ${item.name} to cart successfully!`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const filteredItems = menuItems
    .filter((item) =>
      categoryFilter === "all" ? true : item.category === categoryFilter
    )
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <p style={{ textAlign: "center" }}>Loading menu...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Today's Menu</h1>

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

      {/* Search and Filter */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="all">All Categories</option>
          {Array.from(new Set(menuItems.map((item) => item.category))).map(
            (cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            )
          )}
        </select>
      </div>

      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {filteredItems.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "250px",
              margin: "10px",
              padding: "15px",
              backgroundColor: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {item.image && (
              <img
                src={`${import.meta.env.VITE_API_URL.replace(
                  "/api",
                  ""
                )}/uploads/${item.image}`}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              />
            )}
            <h3>{item.name}</h3>
            <p>
              <strong>Category:</strong> {item.category}
            </p>
            <p>
              <strong>Price:</strong> Rs. {item.price}
            </p>
            <p>
              <small>{item.description}</small>
            </p>

            <div style={{ marginTop: "10px" }}>
              <label>Quantity: </label>
              <input
                type="number"
                min="1"
                value={quantities[item._id] || 1}
                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                style={{ width: "50px", marginLeft: "5px" }}
              />
            </div>

            <button
              onClick={() => handleAddToCart(item)}
              style={{
                marginTop: "10px",
                padding: "8px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentMenuPage;
