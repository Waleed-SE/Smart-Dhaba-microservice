import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProfilePage = ({ user }) => {
  return (
    <>
      {/* <Header /> */}
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Profile</h1>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ProfilePage;
