from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv
import os

actions = {
    "transport": 0,
    "waste": 34,
    "wellbeing": 34
}

max_value = max(actions.values())
strongest_categories = [k for k, v in actions.items() if v == max_value]
if len(strongest_categories) == 1:
    strongest_category_text = strongest_categories[0]
else:
    strongest_category_text = " and ".join(strongest_categories)

tts_text = (
    f"This week, you logged {actions['transport']} transport, "
    f"{actions['waste']} waste, and {actions['wellbeing']} wellbeing actions. "
    f"Your Golden Aura is strongest in {strongest_category_text}."
)

load_dotenv()

api_key = os.getenv("ELEVENLABS_API_KEY")
if not api_key:
    raise RuntimeError("ELEVENLABS_API_KEY not found. Please set it in your .env file.")
client = ElevenLabs(api_key=api_key)

audio_stream = client.text_to_speech.convert(

    text= tts_text,
    voice_id="EXAVITQu4vr4xnSDxMaL"
)

with open("output.mp3", "wb") as f:
    for chunk in audio_stream:
        f.write(chunk)

print("Audio generated successfully: output.mp3")
