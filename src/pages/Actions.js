import React, { useState } from "react";

export default function Actions() {
  const [points, setPoints] = useState(0);

  const log = (p) => setPoints(points + p);

  return (
    <div className="card">
      <h2>Log Actions</h2>
      <p>Total Points: {points}</p>

      <div className="button-grid">
        <button className="btn-3d" onClick={() => log(2)}>Walk</button>
        <button className="btn-3d" onClick={() => log(3)}>Bike</button>
        <button className="btn-3d" onClick={() => log(1)}>Transit</button>
        <button className="btn-3d" onClick={() => log(2)}>Reduce Waste</button>
        <button className="btn-3d" onClick={() => log(2)}>Mindfulness</button>
      </div>
    </div>
  );
}

