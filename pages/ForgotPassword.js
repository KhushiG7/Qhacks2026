import React, { useState } from "react";
import "../App.css";
import { supabase } from "../pages/supabaseClient.js"; // import your Supabase client

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    // Supabase password reset
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login", // redirect after password reset
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Password reset link sent! Check your email.");
      onBack(); // go back to login
    }
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
