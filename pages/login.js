import React, { useState } from "react";
import "./login.css";

export default function Login({ onLogin, onForgot, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // demo credentials — replace later with real auth
    if (username === "user" && password === "1234") {
      onLogin();
    } else {
      alert("Invalid credentials! Try username: user, password: 1234");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Main login button */}
        <button type="submit" className="btn-3d">
          Login
        </button>

        {/* Links section */}
        <div className="login-extra">
          <button
            type="button"
            className="link-btn"
            onClick={onForgot}
          >
            Forgot Password?
          </button>

          <button
            type="button"
            className="link-btn"
            onClick={onRegister}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
