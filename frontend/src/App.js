import React, { useState, useEffect } from "react";
import "./App.css";
import { supabase } from "./pages/supabaseClient";

// Import all your separate component files
import Login from "./pages/Login.js";
import Register from "./pages/RegisterPage.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import Actions from "./pages/Actions.js";
import GoldenAura from "./pages/GoldenAura.js";
import CityDashboard from "./pages/CityDashboard.js";

/* ================= ONBOARDING COMPONENT ================= */
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
    localStorage.setItem('userInfo', JSON.stringify({ name, neighborhood, focus }));
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

/* ================= MAIN APP ================= */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "register" | "forgot"
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("onboarding"); // "onboarding" | "actions" | "aura" | "city"

  // Check for existing Supabase session on mount
  useEffect(() => {
    checkUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setLoggedIn(true);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoggedIn(false);
    setScreen("onboarding");
  };

  /* ================= AUTH FLOW (Login/Register/Forgot) ================= */
  if (!loggedIn) {
    if (authScreen === "login") {
      return (
        <Login
          onLogin={handleLogin}
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

  /* ================= MAIN APP SCREENS ================= */
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <div className="navbar">
        <button onClick={() => setScreen("onboarding")}>Onboarding</button>
        <button onClick={() => setScreen("actions")}>Actions</button>
        <button onClick={() => setScreen("aura")}>Aura</button>
        <button onClick={() => setScreen("city")}>City</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Content Area - Show different screens based on state */}
      <div className="content-area">
        {screen === "onboarding" && (
          <Onboarding onComplete={() => setScreen("actions")} />
        )}
        {screen === "actions" && <Actions userId={user?.id} />}
        {screen === "aura" && <GoldenAura userId={user?.id} />}
        {screen === "city" && <CityDashboard />}
      </div>
    </div>
  );
}