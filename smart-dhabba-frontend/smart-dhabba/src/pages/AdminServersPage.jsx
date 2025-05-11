// Updated AdminServersPage.jsx
import React, { useEffect, useState } from "react";
import {
  getAllServers,
  toggleServerAvailability,
} from "../services/adminService";

const AdminServersPage = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // State to store error messages
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadServers = async () => {
      try {
        const serversData = await getAllServers(token);
        if (serversData.length === 0) {
          setError("No servers available."); // Set error message if no servers are found
        } else {
          setServers(serversData);
        }
      } catch (error) {
        setError(error.message || "Failed to load servers.");
      } finally {
        setLoading(false);
      }
    };

    loadServers();
  }, [token]);

  const handleToggleAvailability = async (serverId, isAvailable) => {
    try {
      await toggleServerAvailability(serverId, token);
      setServers((prevServers) =>
        prevServers.map((server) =>
          server._id === serverId
            ? { ...server, isAvailable: !isAvailable }
            : server
        )
      );
    } catch (error) {
      setError("Failed to update server availability.");
    }
  };

  if (loading) return <p>Loading servers...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>; // Display error message if any

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>Manage Servers</h2>

      {/* Display error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Server Name</th>
            <th>Email</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {servers.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No servers available.
              </td>
            </tr>
          ) : (
            servers.map((server) => (
              <tr key={server._id}>
                <td>{server.userId ? server.userId.username : "No User"}</td>
                <td>{server.userId ? server.userId.email : "No Email"}</td>
                <td>{server.isAvailable ? "Available" : "Unavailable"}</td>
                <td>
                  <button
                    onClick={() =>
                      handleToggleAvailability(server._id, server.isAvailable)
                    }
                    style={{
                      padding: "8px",
                      backgroundColor: server.isAvailable
                        ? "#dc3545"
                        : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {server.isAvailable
                      ? "Mark as Unavailable"
                      : "Mark as Available"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminServersPage;
