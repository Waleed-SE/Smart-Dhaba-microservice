import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchMenuItems = async () => {
  try {
    const res = await axios.get(`${API_URL}/menu`);
    return res.data; // Return data on success
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw new Error("Failed to fetch menu items");
  }
};

export const createMenuItem = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/admin/menu`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create menu item"
    );
  }
};

export const updateMenuItem = async (id, data, token) => {
  try {
    const response = await axios.put(`${API_URL}/admin/menu/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update menu item"
    );
  }
};

export const deleteMenuItem = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/menu/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete menu item"
    );
  }
};
