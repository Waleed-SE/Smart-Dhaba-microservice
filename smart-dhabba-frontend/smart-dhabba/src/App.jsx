import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import StudentMenuPage from "./pages/StudentMenuPage";
import CartPage from "./pages/CartPage";
import AdminDashboard from "./pages/AdminDashboard";
import UploadPage from "./pages/UploadPage";
import ManageFiles from "./pages/ManageFiles";
import AdminMenuPage from "./pages/AdminMenuPage";
import ServerOrdersPage from "./pages/ServerOrdersPage";
import OrdersPage from "./pages/OrdersPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminServersPage from "./pages/AdminServersPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import StudentLocationPage from "./pages/StudentLocationPage";
import AdminLocationsPage from "./pages/AdminLocationsPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      {user && <Header setUser={setUser} />}

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "server"
                    ? "/orders"
                    : "/dashboard"
                }
              />
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/menu"
          element={
            user?.role === "student" || user?.role === "faculty" ? (
              <StudentMenuPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/cart"
          element={
            user?.role === "student" || user?.role === "faculty" ? (
              <CartPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/upload"
          element={
            user?.role === "admin" ? <UploadPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/files"
          element={
            user?.role === "admin" ? <ManageFiles /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/menu"
          element={
            user?.role === "admin" ? <AdminMenuPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/orders"
          element={
            user?.role === "server" ? (
              <ServerOrdersPage />
            ) : user?.role === "student" || user?.role === "faculty" ? (
              <OrdersPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/orders"
          element={
            user?.role === "admin" ? <AdminOrdersPage /> : <Navigate to="/" />
          }
        />

        <Route
          path="/place-order"
          element={
            user?.role === "student" || user?.role === "faculty" ? (
              <PlaceOrderPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/servers" // Added route for AdminServersPage
          element={
            user?.role === "admin" ? <AdminServersPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/users" // Add route for AdminUsersPage
          element={
            user?.role === "admin" ? <AdminUsersPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/analytics" // Add route for AdminAnalyticsPage
          element={
            user?.role === "admin" ? (
              <AdminAnalyticsPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/student/location"
          element={
            user?.role === "student" ? (
              <StudentLocationPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/location"
          element={
            user?.role === "admin" ? (
              <AdminLocationsPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>

      {user && <Footer />}
    </Router>
  );
}

export default App;
