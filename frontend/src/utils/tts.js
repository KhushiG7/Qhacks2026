export async function playTTS(text) {
  try {
    const res = await fetch("http://localhost:8000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!data.audio_base64) return;
    const audio = new Audio(`data:audio/mpeg;base64,${data.audio_base64}`);
    audio.play();
  } catch (e) {
    console.error("TTS error", e);
  }
}
