import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { loginWithEmail, googleLoginOrSignup } from "../services/authService";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = ({ setUser }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      setMessage("Please complete the reCAPTCHA.");
      return;
    }
    try {
      const { token, user } = await loginWithEmail(form);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  // Handle Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    try {
      const { token, user } = await googleLoginOrSignup({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      setMessage("Google login failed");
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}
    >
      <h2>Login to Smart Dhabba</h2>

      {message && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            marginBottom: "15px",
          }}
        >
          {message}
        </div>
      )}

      {/* Email/Password Login */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        {/* Google reCAPTCHA */}
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
          style={{ marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          Login
        </button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      {/* Google Login */}
      <p>or login with Gmail</p>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setMessage("Google Sign-in failed")}
      />

      <div style={{ marginTop: "20px" }}>
        <p>
          <a href="/forgot-password" style={{ color: "#007bff" }}>
            Forgot Password?
          </a>
        </p>
        <p>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#007bff" }}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
