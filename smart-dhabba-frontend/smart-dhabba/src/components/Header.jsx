import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ setUser }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header
      style={{ backgroundColor: "#4285F4", padding: "10px", color: "white" }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {/* Admin */}
          {user?.role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                style={{ color: "white", margin: "10px" }}
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/upload"
                style={{ color: "white", margin: "10px" }}
              >
                Upload
              </Link>
              <Link
                to="/admin/files"
                style={{ color: "white", margin: "10px" }}
              >
                Manage Files
              </Link>
              <Link to="/admin/menu" style={{ color: "white", margin: "10px" }}>
                Manage Menu
              </Link>
              <Link
                to="/admin/orders"
                style={{ color: "white", margin: "10px" }}
              >
                Orders
              </Link>
              <Link
                to="/admin/servers"
                style={{ color: "white", margin: "10px" }}
              >
                Manage Servers {/* New Link for Manage Servers */}
              </Link>
              <Link
                to="/admin/users"
                style={{ color: "white", margin: "10px" }} // Add this link
              >
                Manage Users
              </Link>
              <Link
                to="/admin/analytics"
                style={{ color: "white", margin: "10px" }} // Add this link
              >
                Admin Anal
              </Link>
              <Link
                to="/admin/location"
                style={{ color: "white", margin: "10px" }}
              >
                Students Location
              </Link>
            </>
          )}

          {/* Server */}
          {user?.role === "server" && (
            <Link to="/orders" style={{ color: "white", margin: "10px" }}>
              Orders
            </Link>
          )}

          {/* Student / Faculty */}
          {["student", "faculty"].includes(user?.role) && (
            <>
              <Link to="/dashboard" style={{ color: "white", margin: "10px" }}>
                Dashboard
              </Link>
              <Link to="/menu" style={{ color: "white", margin: "10px" }}>
                Menu
              </Link>
              <Link
                to="/place-order"
                style={{ color: "white", margin: "10px" }}
              >
                Place Order
              </Link>
              <Link to="/orders" style={{ color: "white", margin: "10px" }}>
                My Orders
              </Link>
              <Link
                to="/student/location"
                style={{ color: "white", margin: "10px" }}
              >
                Save Location
              </Link>
            </>
          )}

          {/* Everyone gets Profile */}
          <Link to="/profile" style={{ color: "white", margin: "10px" }}>
            Profile
          </Link>
        </div>

        <div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "white",
              color: "#4285F4",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
