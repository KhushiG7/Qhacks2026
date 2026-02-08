import React, { useEffect, useRef, useState } from "react";
import "../App.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

export default function VerifiedWasteTracker({
  userId,
  onPointsUpdated,
  onDone,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [status, setStatus] = useState("Ready to verify cleanup.");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setStatus("Camera access denied or unavailable.");
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  };

  const handleCaptureBefore = async () => {
    const blob = await captureFrame();
    if (blob) {
      setBeforeImage({
        blob,
        previewUrl: URL.createObjectURL(blob),
      });
      setStatus("Captured BEFORE photo.");
    }
  };

  const handleCaptureAfter = async () => {
    const blob = await captureFrame();
    if (blob) {
      setAfterImage({
        blob,
        previewUrl: URL.createObjectURL(blob),
      });
      setStatus("Captured AFTER photo.");
    }
  };

  const handleSubmit = async () => {
    if (!beforeImage || !afterImage) return;
    if (!userId) {
      setStatus("Please log in first.");
      return;
    }

    setSubmitting(true);
    setStatus("Verifying cleanup...");

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("before_image", beforeImage.blob, "before.jpg");
      formData.append("after_image", afterImage.blob, "after.jpg");

      const response = await fetch(`${API_BASE_URL}/verified-waste`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus(`Cleanup approved! You earned ${result.awarded_points} points.`);
        if (onPointsUpdated) {
          onPointsUpdated(result.new_total_points);
        }
        setTimeout(() => {
          if (onDone) onDone();
        }, 1200);
      } else {
        setStatus(result.reason || "Cleanup not verified.");
      }
    } catch (error) {
      setStatus("Verification failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="actions-page">
      <header className="actions-header">
        <div>
          <p className="eyebrow">Verified Cleanup</p>
          <h1>Reduce Waste</h1>
          <p className="subtext">
            Capture a before-and-after photo to verify your cleanup.
          </p>
        </div>
      </header>

      <div className="verified-camera">
        <video ref={videoRef} autoPlay playsInline className="verified-video" />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <div className="verified-actions">
        <button className="action-btn" onClick={handleCaptureBefore}>
          Capture BEFORE photo
        </button>
        <button
          className="action-btn"
          onClick={handleCaptureAfter}
          disabled={!beforeImage}
        >
          Capture AFTER photo
        </button>
      </div>

      <div className="verified-previews">
        {beforeImage && (
          <div>
            <p className="metric-label">Before</p>
            <img src={beforeImage.previewUrl} alt="Before cleanup" width="140" />
          </div>
        )}
        {afterImage && (
          <div>
            <p className="metric-label">After</p>
            <img src={afterImage.previewUrl} alt="After cleanup" width="140" />
          </div>
        )}
      </div>

      <div className="verified-actions">
        <button
          className="action-btn"
          onClick={handleSubmit}
          disabled={!beforeImage || !afterImage || submitting}
        >
          Submit cleanup
        </button>
      </div>

      <div className="status-pill status-neutral">{status}</div>
    </div>
  );
}
