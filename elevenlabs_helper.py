import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

# Load the .env file that sits next to this file
load_dotenv()  # or load_dotenv(dotenv_path=".env") if needed

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY not found in .env")

client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

VOICE_ID = "EXAVITQu4vr4xnSDxMaL"

def generate_recap_audio(actions: dict) -> bytes:
    max_value = max(actions.values()) if actions else 0
    strongest_categories = [k for k, v in actions.items() if v == max_value and v > 0]
    if len(strongest_categories) == 1:
        strongest_category_text = strongest_categories[0]
    elif strongest_categories:
        strongest_category_text = " and ".join(strongest_categories)
    else:
        strongest_category_text = "all categories"

    tts_text = (
        f"This week, you logged {actions.get('transport', 0)} transport, "
        f"{actions.get('waste', 0)} waste, and {actions.get('wellbeing', 0)} wellbeing actions. "
        f"Your Golden Aura is strongest in {strongest_category_text}."
    )

    audio_stream = client.text_to_speech.convert(
        text=tts_text,
        voice_id=VOICE_ID,
    )

    audio_bytes = b"".join(chunk for chunk in audio_stream)
    return audio_bytes

def generate_tts_audio(text: str) -> bytes:
    audio_stream = client.text_to_speech.convert(
        text=text,
        voice_id=VOICE_ID,
    )
    audio_bytes = b"".join(chunk for chunk in audio_stream)
    return audio_bytes

