import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import { logAction as logActionAPI, getUserSummary } from "../api/apiService";

export default function Actions({
  userId,
  onStartVerifiedWalk,
  onStartVerifiedWaste,
  onStartVerifiedBike,
  onOpenAura,
}) {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const actions = useMemo(
    () => [
      {
        id: "walk",
        label: "Walk",
        category: "verified_walk",
        description: "Verified walk (GPS)",
        points: 20,
      },
      {
        id: "bike",
        label: "Bike",
        category: "verified_bike",
        description: "Verified bike ride (GPS)",
        points: 20,
      },
      {
        id: "waste",
        label: "Reduce Waste",
        category: "verified_waste",
        description: "Verified cleanup (photo)",
        points: 25,
      },
      {
        id: "mindfulness",
        label: "Mindfulness",
        category: "wellbeing",
        description: "Reset and breathe",
        points: 1,
      },
    ],
    []
  );

  useEffect(() => {
    loadUserPoints();
  }, [userId]);

  const loadUserPoints = async () => {
    if (!userId) return;

    try {
      const summary = await getUserSummary(userId);
      setPoints(summary.total_points);
    } catch (error) {
      setStatus({
        tone: "error",
        message: "Could not load points. Is the API running?",
      });
    }
  };

  const logPoints = async (actionType) => {
    if (!userId) {
      setStatus({ tone: "error", message: "Please log in to track actions." });
      return;
    }

    if (actionType === "verified_walk") {
      if (onStartVerifiedWalk) {
        onStartVerifiedWalk();
        return;
      }
      setStatus({
        tone: "neutral",
        message: "Open Verified Walk to earn transport points.",
      });
      return;
    }
    if (actionType === "verified_waste") {
      if (onStartVerifiedWaste) {
        onStartVerifiedWaste();
        return;
      }
      setStatus({
        tone: "neutral",
        message: "Open Verified Waste to earn cleanup points.",
      });
      return;
    }
    if (actionType === "verified_bike") {
      if (onStartVerifiedBike) {
        onStartVerifiedBike();
        return;
      }
      setStatus({
        tone: "neutral",
        message: "Open Verified Bike to earn transport points.",
      });
      return;
    }

    setLoading(true);
    setStatus({ tone: "neutral", message: "Logging action..." });

    try {
      const result = await logActionAPI(userId, actionType);
      if (result?.success === false) {
        setStatus({
          tone: "error",
          message: result.reason || "Action not accepted.",
        });
        setLoading(false);
        return;
      }
      setPoints(result.new_total_points);
      setStatus({
        tone: "success",
        message: "Nice work. Aura updated.",
      });
    } catch (error) {
      setStatus({
        tone: "error",
        message: "Log failed. Check your FastAPI server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="actions-page">
      <header className="actions-header">
        <div>
          <p className="eyebrow">Daily Actions</p>
          <h1>Grow Your Golden Aura</h1>
          <p className="subtext">
            Every sustainable action adds points to your aura.
          </p>
        </div>
        <div className="points-card">
          <p className="points-label">Total Aura Points</p>
          <p className="points-value">{points}</p>
          <p className="points-note">Weekly total across all actions</p>
        </div>
      </header>

      <section className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className="action-tile"
            onClick={() => logPoints(action.category)}
            disabled={loading}
          >
            <div className="tile-top">
              <span className="tile-label">{action.label}</span>
              <span className="tile-points">+{action.points}</span>
            </div>
            <p className="tile-desc">{action.description}</p>
          </button>
        ))}
      </section>

      <div className="actions-footer">
        <button className="action-btn action-btn-animate" onClick={onOpenAura}>
          Aura Breakdown
        </button>
      </div>

      {status && (
        <div className={`status-pill status-${status.tone}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}
