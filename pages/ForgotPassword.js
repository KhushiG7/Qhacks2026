import React, { useState } from "react";
import "../App.css";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    alert("Password reset link sent (demo)");
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className="btn-3d">
          Send Reset Link
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
