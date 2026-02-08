import React, { useState } from "react";
import "../App.css";
import { supabase } from "../pages/supabaseClient";

export default function Login({ onLogin, onForgot, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      if (!data.user.email_confirmed_at) {
        alert("Please verify your email first!");
      } else {
        onLogin(data.user);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-3d">
          Login
        </button>

        <div className="login-extra">
          <button type="button" className="link-btn" onClick={onForgot}>
            Forgot Password?
          </button>
          <button type="button" className="link-btn" onClick={onRegister}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
