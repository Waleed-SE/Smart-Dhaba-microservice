import React, { useEffect, useState } from "react";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchMenuItems,
} from "../services/menuService";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

const AdminMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(""); // To store error messages

  const loadMenu = async () => {
    try {
      const items = await fetchMenuItems();
      setMenuItems(items);
    } catch (error) {
      setError("Error fetching menu items.");
    }
  };

  const loadFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/uploads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data.filter((f) => f.mimetype.startsWith("image/")));
    } catch (error) {
      setError("Error fetching files.");
    }
  };

  useEffect(() => {
    loadMenu();
    loadFiles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before submitting
    try {
      if (editId) {
        await updateMenuItem(editId, form, token); // Update existing item
      } else {
        await createMenuItem(form, token); // Add new item
      }
      setForm({ name: "", category: "", price: "", image: "" });
      setEditId(null);
      loadMenu(); // Reload menu after action
    } catch (err) {
      setError("Error submitting menu item.");
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image || "",
    });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMenuItem(id, token);
        loadMenu(); // Reload menu after deletion
      } catch (err) {
        setError("Error deleting menu item.");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>Admin Menu Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <h3>{editId ? "Edit Menu Item" : "Add New Item"}</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          required
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          required
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          style={{ marginRight: "10px" }}
        />

        <select
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          style={{ marginRight: "10px" }}
        >
          <option value="">Select Image (Optional)</option>
          {files.map((file) => (
            <option key={file._id} value={file.filename}>
              {file.originalname}
            </option>
          ))}
        </select>

        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price (Rs)</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>
                {item.image && (
                  <img
                    src={
                      item.image
                        ? `${import.meta.env.VITE_API_URL.replace(
                            "/api",
                            ""
                          )}/uploads/${item.image}`
                        : "https://via.placeholder.com/50"
                    }
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMenuPage;
