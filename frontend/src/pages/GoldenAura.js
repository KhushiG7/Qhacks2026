import React, { useEffect, useState } from "react";
import { getUserSummary, playVoiceRecap } from "../api/apiService";

export default function GoldenAura({ userId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadSummary();
  }, [userId]);

  const loadSummary = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getUserSummary(userId);
      setSummary(data);
      setStatus(null);
    } catch (error) {
      setStatus({
        tone: "error",
        message: "Could not load your aura summary.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayRecap = async () => {
    if (!userId) {
      setStatus({ tone: "error", message: "Please log in first." });
      return;
    }

    setAudioPlaying(true);
    setStatus({ tone: "neutral", message: "Generating recap..." });
    try {
      const audio = await playVoiceRecap(userId);

      audio.addEventListener("ended", () => {
        setAudioPlaying(false);
        setStatus(null);
      });
    } catch (error) {
      setStatus({
        tone: "error",
        message: "Recap failed. Check your FastAPI server.",
      });
      setAudioPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="aura-shell">
        <div className="aura-card">
          <h2>Your Golden Aura</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aura-shell">
      <div className="aura-card">
        <div className="aura-glow" />
        <div className="aura-score">
          <p className="aura-label">Total Aura Points</p>
          <p className="aura-value">{summary?.total_points || 0}</p>
        </div>

        <div className="aura-breakdown">
          <div>
            <p className="break-label">Transport</p>
            <p className="break-value">{summary?.by_category?.transport || 0}</p>
          </div>
          <div>
            <p className="break-label">Waste</p>
            <p className="break-value">{summary?.by_category?.waste || 0}</p>
          </div>
          <div>
            <p className="break-label">Wellbeing</p>
            <p className="break-value">{summary?.by_category?.wellbeing || 0}</p>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={handlePlayRecap}
          disabled={audioPlaying}
        >
          {audioPlaying ? "Playing recap..." : "Play aura recap"}
        </button>

        {status && (
          <div className={`status-pill status-${status.tone}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
