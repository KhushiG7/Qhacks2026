import React, { useState } from "react";
import "./Login.css"; // optional: create this for login-specific styles

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login API call
    // You can replace this with real API logic
    const fakeUser = {
      id: 1,
      name: "John Doe",
      email: email
    };

    if (email && password) {
      // Notify Landing.js that login was successful
      props.handleSuccessfulAuth({ user: fakeUser });
    } else {
      alert("Please enter email and password.");
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
      </form>
    </div>
  );
}

