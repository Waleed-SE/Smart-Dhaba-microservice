import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const loginWithEmail = async ({ email, password }) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const googleLoginOrSignup = async ({ name, email, picture }) => {
  const res = await axios.post(`${API_URL}/auth/google`, {
    name,
    email,
    picture,
  });
  return res.data;
};
