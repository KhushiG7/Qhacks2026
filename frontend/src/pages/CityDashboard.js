import React, { useEffect, useState } from "react";

export default function CityDashboard() {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [overallTotal, setOverallTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCitySummary = async () => {
      try {
        const response = await fetch("http://localhost:8000/city-summary");
        if (!response.ok) {
          throw new Error("Failed to load city summary");
        }
        const data = await response.json();
        setNeighborhoods(data.neighborhoods || []);
        setOverallTotal(data.overall_total_points || 0);
      } catch (err) {
        setError("Unable to load city data.");
      } finally {
        setLoading(false);
      }
    };

    loadCitySummary();
  }, []);

  if (loading) {
    return (
      <div className="city-dashboard">
        <h2>City Dashboard</h2>
        <p>Loading city data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="city-dashboard">
        <h2>City Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="city-dashboard">
      <div className="city-header">
        <h2>City Dashboard</h2>
        <p>Total Aura points in Kingston: {overallTotal}</p>
      </div>

      <div className="city-list">
        {neighborhoods.map((n) => (
          <div key={n.name} className="city-item">
            <div>
              <p className="city-name">{n.name}</p>
              <p className="city-meta">Participants: {n.user_count}</p>
            </div>
            <div className="city-points">{n.total_points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}
