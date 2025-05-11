import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, topItems: [] });
  const chartData = {
    labels: stats.topItems.map((item) => item.name),
    datasets: [
      {
        label: "Top Items Sold",
        data: stats.topItems.map((item) => item.totalSold),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(import.meta.env.VITE_API_URL + "/admin/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>Admin Dashboard</h1>
      <p>
        <strong>Total Users:</strong> {stats.users}
      </p>
      <p>
        <strong>Total Orders:</strong> {stats.orders}
      </p>
      <h3>Top Menu Items:</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {stats.topItems.map((item) => (
          <li key={item._id}>
            {item.name} – {item.totalSold} sold
          </li>
        ))}
      </ul>
      <h3 style={{ marginTop: "40px" }}>Sales Chart</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default AdminDashboard;
