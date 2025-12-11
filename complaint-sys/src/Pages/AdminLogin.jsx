// src/Pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminLogin.css";
import Logo from "../assets/Logo.jpg";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Change these anytime
    const correctUsername = "admin";
    const correctPassword = "gctu2025";

    if (username !== correctUsername || password !== correctPassword) {
      setError("Invalid username or password");
      return;
    }

    // Login success
    localStorage.setItem("adminLoggedIn", "true");
    navigate("/admin-complaints");
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="logo"> <img src={Logo} alt="GCTU logo" /></div>

        <h2>Admin Login</h2>
        <p className="subtitle">GCTU Student Complaints Portal</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit">Login </button>
        </form>

        <div className="footer">
          Username: <strong>admin</strong> • Password: <strong>gctu2025</strong>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;