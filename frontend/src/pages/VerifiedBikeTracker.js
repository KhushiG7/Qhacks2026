import React, { useEffect, useMemo, useRef, useState } from "react";
import "../App.css";
import { submitVerifiedBike } from "../api/apiService";

const MIN_SECONDS = 10 * 60; // 10 minutes
const MIN_METERS = 2000;
const MIN_KMH = 8.0;
const MAX_KMH = 35.0;

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

export default function VerifiedBikeTracker({
  userId,
  onPointsUpdated,
  onDone,
}) {
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState("Ready to verify your ride.");
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
      setStatus("Please log in to start a verified ride.");
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
          // Ignore jumps when GPS accuracy is very poor or segment is unrealistically large.
          if (pos.coords.accuracy <= 50 && segment < 1500) {
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
    if (elapsedSeconds < MIN_SECONDS || distanceM < MIN_METERS) {
      return "Bike ride too short. Ride at least 10 minutes and 2 km.";
    }
    if (avgSpeedKmh < MIN_KMH || avgSpeedKmh > MAX_KMH) {
      return "Average speed not in a realistic cycling range.";
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
      const result = await submitVerifiedBike({
        userId,
        distanceM: Math.round(distanceM),
        durationS: elapsedSeconds,
        avgSpeedKmh: Number(avgSpeedKmh.toFixed(2)),
      });

      if (result.success) {
        setStatus(`Ride verified, +${result.awarded_points} points.`);
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
          <p className="eyebrow">Verified Bike Ride</p>
          <h1>Ride Instead of Driving</h1>
          <p className="subtext">
            Ride for at least 10 minutes and 2 km at a steady cycling speed.
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
            Start verified bike ride
          </button>
        ) : (
          <button className="action-btn" onClick={handleSubmit}>
            End ride & submit
          </button>
        )}
      </div>

      <div className="status-pill status-neutral">{status}</div>

      <div className="verified-hint">
        <p>
          Requirements: 10+ minutes, 2+ km, average speed 8–35 km/h.
        </p>
      </div>
    </div>
  );
}
