import React, { useState } from "react";
import "./App.css"; // Correct! JS imports CSS

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [focus, setFocus] = useState("");

  const focusOptions = [
    "Move more",
    "Eco-friendly",
    "Mental wellbeing",
    "Mix of everything",
  ];

  const handleFocusSelect = (option) => {
    setFocus(option);
  };

  const handleStart = () => {
    if (!name || !neighborhood || !focus) {
      alert("Please fill all fields and select your focus!");
      return;
    }
    if (onComplete) {
      onComplete({ name, neighborhood, focus });
    }
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

      <div className="button-grid">
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
