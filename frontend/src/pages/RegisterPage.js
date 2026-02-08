import React, { useState } from "react";
import "../App.css";
import { supabase } from "../pages/supabaseClient"; // make sure you have this file

export default function Register({ onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username, // store username in user_metadata
        },
      },
    });

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(
        "Account created! A confirmation email has been sent to your email."
      );
      onBack(); // back to login page
    }
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

        <button type="submit" className="btn-3d" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
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
