import React, { useState } from "react";
import "./login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <button type="submit" className="start-btn">Login</button>

        {/* New additions */}
        <div className="login-extra">
          <button
            type="button"
            className="link-btn"
            onClick={() => alert("Redirect to Forgot Password page")}
          >
            Forgot Password?
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => alert("Redirect to Sign Up page")}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
