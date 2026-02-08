import React, { useEffect, useMemo, useRef, useState } from "react";
import "../App.css";
import { submitVerifiedWalk } from "../api/apiService";

const MIN_SECONDS = 10; // demo: 10 seconds

const toRad = (value) => (value * Math.PI) / 180;

const haversineMeters = (a, b) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export default function VerifiedWalkTracker({
  userId,
  onPointsUpdated,
  onDone,
}) {
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState("Ready to verify your walk.");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const watchIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const lastPointRef = useRef(null);

  const elapsedSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const avgSpeedKmh =
    elapsedSeconds > 0 ? (distanceM / elapsedSeconds) * 3.6 : 0;

  const formattedElapsed = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [elapsedSeconds]);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = () => {
    if (!userId) {
      setStatus("Please log in to start a verified walk.");
      return;
    }
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported in this browser.");
      return;
    }

    setDistanceM(0);
    setElapsedMs(0);
    setStatus("Requesting location permission...");
    lastPointRef.current = null;

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 1000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const nextPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: pos.timestamp,
          accuracy: pos.coords.accuracy,
        };

        if (lastPointRef.current) {
          const segment = haversineMeters(lastPointRef.current, nextPoint);
          if (segment > 0) {
            setDistanceM((current) => current + segment);
          }
        }
        lastPointRef.current = nextPoint;

        setTracking(true);
        setStatus("Tracking...");
      },
      (err) => {
        setStatus(
          err.code === 1
            ? "Location permission denied."
            : "Unable to access GPS."
        );
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTracking(false);
    lastPointRef.current = null;
  };

  const buildFailureReason = () => {
    if (elapsedSeconds < MIN_SECONDS) {
      return "You need to walk for at least 10 seconds to earn Aura points.";
    }
    return null;
  };

  const handleSubmit = async () => {
    stopTracking();

    const reason = buildFailureReason();
    if (reason) {
      setStatus(reason);
      return;
    }

    try {
      const result = await submitVerifiedWalk({
        userId,
        distanceM: Math.round(distanceM),
        durationS: elapsedSeconds,
        avgSpeedKmh: Number(avgSpeedKmh.toFixed(2)),
      });

      if (result.success) {
        setStatus(`Walk verified, +${result.awarded_points} points.`);
        
        if (onPointsUpdated) {
          onPointsUpdated(result.new_total_points);
        }
        if (onDone) {
          onDone();
        }
      } else {
        setStatus(result.reason || "Verification failed.");
      }
    } catch (error) {
      setStatus("Submission failed. Check your FastAPI server.");
    }
  };

  return (
    <div className="actions-page">
      <header className="actions-header">
        <div>
          <p className="eyebrow">Verified Walk</p>
          <h1>Walk Instead of the Bus</h1>
          <p className="subtext">
            Keep a steady pace for at least 10 seconds to earn a bonus.
          </p>
        </div>
      </header>

      <div className="verified-metrics">
        <div>
          <p className="metric-label">Elapsed</p>
          <p className="metric-value">{formattedElapsed}</p>
        </div>
        <div>
          <p className="metric-label">Distance</p>
          <p className="metric-value">{Math.round(distanceM)} m</p>
        </div>
        <div>
          <p className="metric-label">Avg speed</p>
          <p className="metric-value">{avgSpeedKmh.toFixed(2)} km/h</p>
        </div>
      </div>

      <div className="verified-actions">
        {!tracking ? (
          <button className="action-btn" onClick={startTracking}>
            Start verified walk
          </button>
        ) : (
          <button className="action-btn" onClick={handleSubmit}>
            End walk & submit
          </button>
        )}
      </div>

      <div className="status-pill status-neutral">{status}</div>

      <div className="verified-hint">
        <p>Requirements: 10+ seconds.</p>
      </div>
    </div>
  );
}
