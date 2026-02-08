import React, { useState, useEffect } from "react";
import { getUserSummary, playVoiceRecap } from "../api/apiService";

export default function GoldenAura({ userId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);

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
    } catch (error) {
      console.error("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayRecap = async () => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    setAudioPlaying(true);
    try {
      const audio = await playVoiceRecap(userId);
      
      // Reset playing state when audio ends
      audio.addEventListener('ended', () => {
        setAudioPlaying(false);
      });
    } catch (error) {
      alert("Failed to play voice recap. Make sure your backend is running!");
      setAudioPlaying(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Your Golden Aura</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Your Golden Aura</h2>

      <p>Total: {summary?.total_points || 0}</p>
      <p>Transport: {summary?.by_category?.transport || 0}</p>
      <p>Waste: {summary?.by_category?.waste || 0}</p>
      <p>Wellbeing: {summary?.by_category?.wellbeing || 0}</p>

      <button 
        className="btn-3d" 
        onClick={handlePlayRecap}
        disabled={audioPlaying}
      >
        {audioPlaying ? "🎵 Playing..." : "🎤 Play Recap"}
      </button>
    </div>
  );
}
