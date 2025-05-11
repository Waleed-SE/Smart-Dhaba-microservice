import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  promoteToServer,
} from "../services/adminService";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers(token);
        setUsers(usersData);
      } catch (error) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handlePromoteToServer = async (userId) => {
    try {
      await promoteToServer(userId, token); // Promote user to server
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: "server" } : user
        )
      );
    } catch (error) {
      setError("Failed to promote user to server");
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await updateUserRole(userId, role, token);
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role } : user))
      );
    } catch (error) {
      setError("Failed to update user role");
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await deactivateUser(userId, token);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      setError("Failed to deactivate user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== "server" && (
                  <button onClick={() => handlePromoteToServer(user._id)}>
                    Promote to Server
                  </button>
                )}
                <button onClick={() => handleUpdateRole(user._id, "admin")}>
                  Promote to Admin
                </button>
                <button onClick={() => handleDeactivateUser(user._id)}>
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
