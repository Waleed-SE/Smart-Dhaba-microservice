import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dashboard = ({ user }) => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* <Header /> */}
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Welcome, {user.username}!</h1>
        <img
          src={user.picture}
          alt="Profile"
          style={{
            borderRadius: "50%",
            width: "120px",
            height: "120px",
            marginTop: "20px",
          }}
        />
        <h3>{user.email}</h3>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "10px 20px",
            marginTop: "20px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Logout
        </button>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Dashboard;
