import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// User Management
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.length === 0) {
      throw new Error("No users found");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const updateUserRole = async (userId, role, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/role`,
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update user role"
    );
  }
};

export const deactivateUser = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw new Error(
      error.response?.data?.message || "Failed to deactivate user"
    );
  }
};

export const getAllServers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/servers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // If no servers are found, return an empty array
    if (response.data.length === 0) {
      return []; // Return an empty array instead of throwing an error
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching servers:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch servers");
  }
};

export const toggleServerAvailability = async (serverId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/servers/${serverId}/toggle`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling server availability:", error);
    throw new Error(
      error.response?.data?.message || "Failed to toggle server availability"
    );
  }
};

// Analytics
export const getTotalOrdersToday = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/analytics/orders-today`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching total orders today:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch total orders today"
    );
  }
};

export const getTopItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/analytics/top-items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.length === 0) {
      throw new Error("No top items found");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching top items:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch top items"
    );
  }
};

export const getTopRatedServers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/analytics/top-servers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.length === 0) {
      throw new Error("No top-rated servers found");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching top-rated servers:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch top-rated servers"
    );
  }
};

export const getAdminSummary = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin summary:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin summary"
    );
  }
};

export const promoteToServer = async (userId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/promote-server`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error promoting user to server:", error);
    throw new Error(
      error.response?.data?.message || "Failed to promote user to server"
    );
  }
};
