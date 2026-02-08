const API_BASE_URL = 'http://localhost:8000';

// Log an action for a user
export const logAction = async (userId, actionType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/log-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        action_type: actionType,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to log action');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging action:', error);
    throw error;
  }
};

// Get user summary
export const getUserSummary = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-summary/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user summary');
    }
    
    const data = await response.json();
    return data;
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
      throw new Error('Failed to get voice recap');
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