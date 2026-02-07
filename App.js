import React, { useState } from "react";
import "./App.css";

import Login from "./pages/Login.js";
import Register from "./pages/RegisterPage.js";
import ForgotPassword from "./pages/ForgotPassword.js";

/* ================= ONBOARDING ================= */

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

  const handleStart = () => {
    if (!name || !neighborhood || !focus) {
      alert("Please fill all fields!");
      return;
    }
    onComplete({ name, neighborhood, focus });
  };

  return (
    <div className="card onboarding-card">
      <h1 className="onboard-title">🌟 Welcome to Golden Kingston 🌟</h1>

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

      <p>I want to focus on:</p>

      <div className="button-grid">
        {focusOptions.map((option) => (
          <button
            key={option}
            className={`btn-3d ${focus === option ? "selected" : ""}`}
            onClick={() => setFocus(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button className="action-btn" onClick={handleStart}>
        🚀 Start My Journey
      </button>
    </div>
  );
}

/* ================= ACTIONS ================= */

function Actions({ logAction, points }) {
  return (
    <>
      <div className="navbar-merged">
        <div className="logo">Golden Kingston</div>
      </div>

      <div className="content-area">
        <div className="card">
          <h2>Log Actions</h2>
          <p>Total Points: {points}</p>

          <div className="button-grid">
            <button onClick={() => logAction(2)}>🚶 Walk</button>
            <button onClick={() => logAction(3)}>🚲 Bike</button>
            <button onClick={() => logAction(1)}>🚌 Transit</button>
            <button onClick={() => logAction(2)}>♻ Reduce Waste</button>
            <button onClick={() => logAction(2)}>🧘 Mindfulness</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= AURA ================= */

function GoldenAura({ points, breakdown }) {
  return (
    <div className="card">
      <h2>Your Golden Aura</h2>

      <div className="aura-circle">{points}</div>

      <p>Walking: {breakdown.walk || 0}</p>
      <p>Wellbeing: {breakdown.wellbeing || 0}</p>
      <p>Eco: {breakdown.eco || 0}</p>
    </div>
  );
}

/* ================= CITY ================= */

function CityDashboard() {
  return (
    <div className="card">
      <h2>City Dashboard</h2>

      <p>Downtown — 40 pts</p>
      <p>West End — 25 pts</p>
      <p>University — 18 pts</p>
    </div>
  );
}

/* ================= MAIN APP ================= */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState("login"); // login | register | forgot

  const [screen, setScreen] = useState("onboarding"); // onboarding | actions | aura | city
  const [points, setPoints] = useState(0);
  const [breakdown, setBreakdown] = useState({
    walk: 0,
    wellbeing: 0,
    eco: 0,
  });

  /* ===== LOG ACTION ===== */
  const logAction = (p) => {
    setPoints((prev) => prev + p);
    setBreakdown((prev) => {
      const updated = { ...prev };
      if (p === 2) updated.walk += p;
      if (p === 3) updated.eco += p;
      if (p === 1) updated.wellbeing += p;
      return updated;
    });
  };

  /* ================= AUTH FLOW ================= */
  if (!loggedIn) {
    if (authScreen === "login") {
      return (
        <Login
          onLogin={() => setLoggedIn(true)}
          onRegister={() => setAuthScreen("register")}
          onForgot={() => setAuthScreen("forgot")}
        />
      );
    }
    if (authScreen === "register") {
      return <Register onBack={() => setAuthScreen("login")} />;
    }
    if (authScreen === "forgot") {
      return <ForgotPassword onBack={() => setAuthScreen("login")} />;
    }
  }

  /* ================= APP SCREENS ================= */
  const screens = {
    onboarding: <Onboarding onComplete={() => setScreen("actions")} />,
    actions: <Actions logAction={logAction} points={points} />,
    aura: <GoldenAura points={points} breakdown={breakdown} />,
    city: <CityDashboard />,
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <button onClick={() => setScreen("onboarding")}>Onboarding</button>
        <button onClick={() => setScreen("actions")}>Actions</button>
        <button onClick={() => setScreen("aura")}>Aura</button>
        <button onClick={() => setScreen("city")}>City</button>
        <button onClick={() => setLoggedIn(false)}>Logout</button>
      </div>

      <div className="content-area">{screens[screen]}</div>
    </div>
  );
}
