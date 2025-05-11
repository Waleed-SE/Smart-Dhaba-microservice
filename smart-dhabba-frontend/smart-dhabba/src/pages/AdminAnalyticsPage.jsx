import React, { useEffect, useState } from "react";
import "../styles/AdminAnalyticsPage.css"; // Import your CSS file

import {
  getTotalOrdersToday,
  getTopItems,
  getTopRatedServers,
  getAdminSummary,
} from "../services/adminService"; // Import relevant functions

const AdminAnalyticsPage = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [topItems, setTopItems] = useState([]);
  const [topServers, setTopServers] = useState([]);
  const [adminSummary, setAdminSummary] = useState({
    users: 0,
    orders: 0,
    topItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Error state for API errors
  const token = localStorage.getItem("token");

  // Fetch analytics data when the page loads
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const ordersData = await getTotalOrdersToday(token);
        setTotalOrders(ordersData.totalOrdersToday);

        const itemsData = await getTopItems(token);
        setTopItems(itemsData);

        // const serversData = await getTopRatedServers(token);
        // setTopServers(serversData);

        const summaryData = await getAdminSummary(token);
        setAdminSummary(summaryData);
      } catch (error) {
        setError("Failed to load analytics data");
        console.error("Failed to load analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [token]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-analytics">
      <h2>Admin Analytics</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="section">
        <h3>Total Orders Today</h3>
        <p>{totalOrders}</p>
      </div>
      <div className="section top-items">
        <h3>Top Items</h3>
        <ul>
          {topItems.map((item) => (
            <li key={item._id}>
              <span>{item.name}</span> <span>Sold: {item.total}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="section top-servers">
        <h3>Top Rated Servers</h3>
        <ul>
          {topServers.map((server) => (
            <li key={server._id}>
              <span>{server.serverInfo.username}</span>{" "}
              <span>Rating: {server.avgRating}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="section summary">
        <h3>Admin Summary</h3>
        <p>Users: {adminSummary.users}</p>
        <p>Orders: {adminSummary.orders}</p>
        <ul>
          {adminSummary.topItems.map((item) => (
            <li key={item._id}>
              {item.name} - Total Sold: {item.totalSold}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
