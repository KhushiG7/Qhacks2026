import React, { useState } from "react";
import "./App.css";
import Onboarding from "./pages/Onboarding";
import Actions from "./pages/Actions";
import GoldenAura from "./pages/GoldenAura";
import CityDashboard from "./pages/CityDashboard";

// Map page names to components
const pages = {
  Onboarding,
  Actions,
  GoldenAura,
  CityDashboard,
};

function App() {
  const [page, setPage] = useState("Onboarding"); // default page
  const PageComponent = pages[page];

  return (
    <div className="App">
      {/* Simple page switcher using buttons inside App */}
      <div className="page-switcher">
        {Object.keys(pages).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className="switch-button"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Render current page */}
      <div className="page-container">
        <PageComponent />
      </div>
    </div>
  );
}

export default App;

