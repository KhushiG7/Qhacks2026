import React, { useState } from "react";
import "../App.css";

export default function Register({ onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Fill all fields");
      return;
    }

    alert("Account created (demo)");
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn-3d">
          Sign Up
        </button>

        <button
          type="button"
          className="link-btn"
          onClick={onBack}
          style={{ marginTop: "12px" }}
        >
          ← Back to Login
        </button>
      </form>
    </div>
  );
}

