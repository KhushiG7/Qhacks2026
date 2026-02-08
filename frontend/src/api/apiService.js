const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const request = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      const message =
        payload?.detail ||
        payload?.message ||
        `Request failed (${response.status})`;
      throw new Error(message);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
};

// Log an action for a user
export const logAction = async (userId, actionType) => {
  try {
    return await request(`${API_BASE_URL}/log-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        action_type: actionType,
      }),
    });
  } catch (error) {
    console.error('Error logging action:', error);
    throw error;
  }
};

// Get user summary
export const getUserSummary = async (userId) => {
  try {
    return await request(`${API_BASE_URL}/user-summary/${userId}`);
  } catch (error) {
    console.error('Error getting user summary:', error);
    throw error;
  }
};

// Get voice recap and play audio
export const playVoiceRecap = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/voice-recap/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to get voice recap (${response.status})`);
    }

    // Convert response to blob
    const audioBlob = await response.blob();

    // Create object URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create and play audio element
    const audio = new Audio(audioUrl);
    audio.play();

    // Clean up the object URL after audio ends
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl);
    });

    return audio;
  } catch (error) {
    console.error('Error playing voice recap:', error);
    throw error;
  }
};

export const submitVerifiedWalk = async ({
  userId,
  distanceM,
  durationS,
  avgSpeedKmh,
}) => {
  try {
    return await request(`${API_BASE_URL}/verified-walk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        distance_m: distanceM,
        duration_s: durationS,
        avg_speed_kmh: avgSpeedKmh,
      }),
    });
  } catch (error) {
    console.error('Error submitting verified walk:', error);
    throw error;
  }
};

export const submitVerifiedBike = async ({
  userId,
  distanceM,
  durationS,
  avgSpeedKmh,
}) => {
  try {
    return await request(`${API_BASE_URL}/verified-bike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        distance_m: distanceM,
        duration_s: durationS,
        avg_speed_kmh: avgSpeedKmh,
      }),
    });
  } catch (error) {
    console.error('Error submitting verified bike:', error);
    throw error;
  }
};
