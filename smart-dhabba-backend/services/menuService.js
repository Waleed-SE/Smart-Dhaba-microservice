import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const fetchMenuItems = async () => {
  const res = await axios.get(`${API_URL}/menu`);
  return res.data;
};

export const createMenuItem = async (data, token) => {
  return axios.post(`${API_URL}/menu`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateMenuItem = async (id, data, token) => {
  return axios.put(`${API_URL}/menu/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteMenuItem = async (id, token) => {
  return axios.delete(`${API_URL}/menu/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
