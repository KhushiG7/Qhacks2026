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
import VerifiedWalkTracker from "./pages/VerifiedWalkTracker.js";
import VerifiedWasteTracker from "./pages/VerifiedWasteTracker.js";
import VerifiedBikeTracker from "./pages/VerifiedBikeTracker.js";

/* ================= ONBOARDING COMPONENT ================= */
function Onboarding({ onComplete, userId }) {
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [focus, setFocus] = useState("");

  const focusOptions = [
    "Move more",
    "Eco-friendly",
    "Mental wellbeing",
    "Mix of everything",
  ];
  const neighborhoodOptions = [
    "Portsmouth Village",
    "University Avenue",
    "Cataraqui North",
    "Sydenham Ward",
    "Rideau Heights",
    "Hillendale",
  ];

  const handleStart = () => {
    if (!name || !neighborhood || !focus) {
      alert("Please fill all fields!");
      return;
    }
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ name, neighborhood, focus })
    );
    if (userId) {
      fetch("http://localhost:8000/set-neighborhood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, neighborhood }),
      }).catch(() => {});
    }
    onComplete({ name, neighborhood, focus });
  };

  return (
    <div className="card onboarding-card">
      <div className="onboard-header">
        <p className="eyebrow">Onboarding</p>
        <h1 className="onboard-title">Welcome to Golden Kingston</h1>
        <p className="onboard-subtitle">
          Set your focus once and start building your aura with daily actions.
        </p>
      </div>

      <div className="onboard-fields">
        <input
          className="input"
          placeholder="Preferred name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="input"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
        >
          <option value="">Select neighborhood</option>
          {neighborhoodOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <p className="onboard-focus-text">I want to focus on</p>

      <div className="button-grid">
        {focusOptions.map((option) => (
          <button
            key={option}
            className={`focus-btn ${focus === option ? "selected" : ""}`}
            onClick={() => setFocus(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button className="action-btn" onClick={handleStart}>
        Start My Journey
      </button>
    </div>
  );
}

/* ================= MAIN APP ================= */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "register" | "forgot"
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("actions"); // "onboarding" | "actions" | "aura" | "city" | "verified-walk" | "verified-waste" | "verified-bike"
  const [verifiedPoints, setVerifiedPoints] = useState(0);
  const storedUserId = localStorage.getItem("userId");
  const effectiveUserId = user?.id || storedUserId || "demo-user";

  // Check for existing Supabase session on mount
  useEffect(() => {
    checkUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setLoggedIn(true);
      setScreen("onboarding");
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
    setScreen("onboarding");
    if (userData?.id) {
      localStorage.setItem("userId", userData.id);
    }
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
        <div className="logo-mark">
          <span className="logo-text">Golden Kingston</span>
        </div>
        <div className="nav-links">
          <span className="nav-points">Total: {verifiedPoints}</span>
          <button
            className={screen === "onboarding" ? "nav-active" : ""}
            onClick={() => setScreen("onboarding")}
          >
            Onboarding
          </button>
          <button
            className={screen === "actions" ? "nav-active" : ""}
            onClick={() => setScreen("actions")}
          >
            Actions
          </button>
          <button
            className={screen === "aura" ? "nav-active" : ""}
            onClick={() => setScreen("aura")}
          >
            Aura
          </button>
          <button
            className={screen === "city" ? "nav-active" : ""}
            onClick={() => setScreen("city")}
          >
            City
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Content Area - Show different screens based on state */}
      <div className="content-area">
        {screen === "onboarding" && (
          <div className="screen-wrapper">
            <Onboarding
              onComplete={() => setScreen("actions")}
              userId={user?.id}
            />
          </div>
        )}
        {screen === "actions" && (
          <div className="screen-wrapper">
            <Actions
              userId={user?.id}
              onStartVerifiedWalk={() => setScreen("verified-walk")}
              onStartVerifiedWaste={() => setScreen("verified-waste")}
              onStartVerifiedBike={() => setScreen("verified-bike")}
              onOpenAura={() => setScreen("aura")}
            />
          </div>
        )}
        {screen === "aura" && (
          <div className="screen-wrapper">
            <GoldenAura
              userId={user?.id}
              onStartVerifiedWalk={() => setScreen("verified-walk")}
              onStartVerifiedWaste={() => setScreen("verified-waste")}
              onStartVerifiedBike={() => setScreen("verified-bike")}
            />
          </div>
        )}
        {screen === "city" && (
          <div className="screen-wrapper">
            <CityDashboard />
          </div>
        )}
        {screen === "verified-walk" && (
          <div className="screen-wrapper">
            <VerifiedWalkTracker
              userId={effectiveUserId}
              onPointsUpdated={setVerifiedPoints}
              onDone={() => setScreen("aura")}
            />
          </div>
        )}
        {screen === "verified-waste" && (
          <div className="screen-wrapper">
            <VerifiedWasteTracker
              userId={effectiveUserId}
              onPointsUpdated={setVerifiedPoints}
              onDone={() => setScreen("aura")}
            />
          </div>
        )}
        {screen === "verified-bike" && (
          <div className="screen-wrapper">
            <VerifiedBikeTracker
              userId={effectiveUserId}
              onPointsUpdated={setVerifiedPoints}
              onDone={() => setScreen("aura")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
