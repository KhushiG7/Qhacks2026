import React, { useState } from "react";
import "./App.css";

/* ===== Screens ===== */

function Onboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [focus, setFocus] = useState("");

  const focusOptions = [
    "Move more",
    "Eco-friendly",
    "Mental wellbeing",
    "Mix of everything",
  ];

  const handleFocusSelect = (option) => setFocus(option);

  const handleStart = () => {
    if (!name || !neighborhood || !focus) {
      alert("Please fill all fields and select your focus!");
      return;
    }
    onComplete({ name, neighborhood, focus });
  };

  return (
    <div className="card onboarding-card">
      <h1 className="onboard-title">🌟 Welcome to Golden Kingston 🌟</h1>
      <p className="onboard-subtitle">
        Let's create healthier habits and make Kingston a greener, happier city!
      </p>

      <input
        className="input"
        placeholder="Preferred Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="input"
        placeholder="Neighborhood"
        value={neighborhood}
        onChange={(e) => setNeighborhood(e.target.value)}
      />

      <p className="onboard-focus-text">I want to focus on:</p>

      <div className="button-grid focus-grid">
        {focusOptions.map((option) => (
          <button
            key={option}
            className={`btn-3d focus-btn ${focus === option ? "selected" : ""}`}
            onClick={() => handleFocusSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button className="action-btn start-btn" onClick={handleStart}>
        🚀 Start My Journey
      </button>
    </div>
  );
}

/* ===== ACTIONS SCREEN ===== */
function Actions({ logAction, points }) {
  return (
    <>
      <div className="navbar-merged">
        <div className="logo">Golden Kingston</div>
        <button className="profile-btn">Profile</button>
      </div>

      <div className="content-area">
        <div className="card">
          <h2>Log Actions</h2>
          <p>Total Points: {points}</p>

          <div className="button-grid">
            <button className="action-button" onClick={() => logAction(2)}>🚶 Walk</button>
            <button className="action-button" onClick={() => logAction(3)}>🚲 Bike</button>
            <button className="action-button" onClick={() => logAction(1)}>🚌 Transit</button>
            <button className="action-button" onClick={() => logAction(2)}>♻ Reduce Waste</button>
            <button className="action-button" onClick={() => logAction(2)}>🧘 Mindfulness</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Golden Aura ===== */
function GoldenAura({ points, breakdown }) {
  return (
    <div className="card golden-aura-card">
      <h2>Your Golden Aura</h2>
      <div className="aura-circle">
        <span className="aura-points">{points}</span>
      </div>
      <p>Walking: {breakdown.walk || 0}</p>
      <p>Wellbeing: {breakdown.wellbeing || 0}</p>
      <p>Eco: {breakdown.eco || 0}</p>
      <button className="action-btn">▶ Play Golden Recap</button>
    </div>
  );
}

/* ===== City Dashboard ===== */
function CityDashboard() {
  return (
    <div className="card">
      <h2>City Dashboard</h2>
      <p>Downtown — 40 pts</p>
      <p>West End — 25 pts</p>
      <p>University — 18 pts</p>
      <h3>Neighborhood of the Month 🎉</h3>
      <p>Downtown</p>
    </div>
  );
}

/* ===== LOGIN SCREEN ===== */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple demo login
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

        {/* Forgot Password - directly below password input */}
        <div className="forgot-password-wrapper">
          <button
            type="button"
            className="link-btn forgot-btn"
            onClick={() => alert("Redirect to Forgot Password page")}
          >
            Forgot Password?
          </button>
        </div>

        {/* Yellow Login Button */}
        <button type="submit" className="start-btn">Login</button>

        {/* Sign Up Button - same width/style as Login */}
        <button
          type="button"
          className="start-btn signup-btn"
          onClick={() => alert("Redirect to Sign Up page")}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

/* ===== MAIN APP ===== */
export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [breakdown, setBreakdown] = useState({ walk: 0, wellbeing: 0, eco: 0 });
  const [loggedIn, setLoggedIn] = useState(false);

  const logAction = (p) => {
    setPoints(points + p);
    if (p === 2) setBreakdown({ ...breakdown, walk: breakdown.walk + p });
    if (p === 3) setBreakdown({ ...breakdown, eco: breakdown.eco + p });
    if (p === 1) setBreakdown({ ...breakdown, wellbeing: breakdown.wellbeing + p });
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  const screens = {
    onboarding: <Onboarding onComplete={(data) => { setUser(data); setScreen("actions"); }} />,
    actions: <Actions logAction={logAction} points={points} />,
    aura: <GoldenAura points={points} breakdown={breakdown} />,
    city: <CityDashboard />,
  };

  return (
    <div className="app-container">
      {/* NAV BAR */}
      <div className="navbar">
        <button className="btn-3d" onClick={() => setScreen("onboarding")}>Onboarding</button>
        <button className="btn-3d" onClick={() => setScreen("actions")}>Actions</button>
        <button className="btn-3d" onClick={() => setScreen("aura")}>Aura</button>
        <button className="btn-3d" onClick={() => setScreen("city")}>City</button>
        <button className="btn-3d" onClick={() => setLoggedIn(false)}>Logout</button>
      </div>

      {/* CONTENT */}
      <div className="content-area">
        <div key={screen} className="screen-wrapper">
          {screens[screen]}
        </div>
      </div>
    </div>
  );
}
