from fastapi import FastAPI, Response, UploadFile, File, Form
from elevenlabs_helper import generate_recap_audio, generate_tts_audio
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from datetime import datetime, date
from dotenv import load_dotenv
from fastapi.responses import FileResponse
import os
import base64
import json
from google import genai
from google.genai import types

load_dotenv()

# Gemini setup (Google GenAI SDK)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_CLIENT = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
class ActionLog(BaseModel):
    user_id: str
    action_type: str  # "walk" | "transport" | "waste" | "wellbeing" | "verified_walk"

class UserSummary(BaseModel):
    user_id: str
    total_points: int
    by_category: Dict[str, int]

class VerifiedWalkPayload(BaseModel):
    user_id: str
    distance_m: float
    duration_s: int
    avg_speed_kmh: float

class VerifiedBikePayload(BaseModel):
    user_id: str
    distance_m: float
    duration_s: int
    avg_speed_kmh: float

class TTSRequest(BaseModel):
    text: str


ACTIONS = []  # list of dicts
# In-memory user store (placeholder for a real DB table).
# Extend this list to add more neighborhoods/users.
USERS = [
    {"user_id": "demo-user", "neighborhood": "Portsmouth Village"},
    {"user_id": "u2", "neighborhood": "University Avenue"},
    {"user_id": "u3", "neighborhood": "Sydenham Ward"},
]

def get_user_neighborhood(user_id: str) -> str:
    # In production, query your DB for the user's neighborhood.
    for user in USERS:
        if user["user_id"] == user_id:
            return user["neighborhood"]
    # Fallback for users not in the in-memory list.
    USERS.append({"user_id": user_id, "neighborhood": "Portsmouth Village"})
    return "Portsmouth Village"
# In-memory per-user, per-day mindfulness counter.
# Replace with persistent storage for production.
MINDFULNESS_USAGE = {}  # { user_id: { "YYYY-MM-DD": count } }
POINTS_PER_ACTION = {
    # Transport points are awarded only via verified walks.
    "transport": 0,
    "walk": 0,  # Plain walk actions are tracked but do not modify points.
    "waste": 0,  # Plain waste actions are tracked but do not modify points.
    "wellbeing": 5,
    "verified_walk": 20,
    "verified_waste": 25,
    "verified_bike": 20,
}

VERIFIED_WALK_MIN_SECONDS = 10  # demo: 10 seconds

# Cycling thresholds based on typical city cycling speeds.
VERIFIED_BIKE_MIN_SECONDS = 10 * 60  # 10 minutes
VERIFIED_BIKE_MIN_METERS = 2000
VERIFIED_BIKE_MIN_KMH = 8.0
VERIFIED_BIKE_MAX_KMH = 35.0

VERIFIED_WASTE_MIN_CONFIDENCE = 0.7

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # hackathon safe
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/set-neighborhood")
def set_neighborhood(payload: Dict[str, str]):
    user_id = payload.get("user_id")
    neighborhood = payload.get("neighborhood")
    if not user_id or not neighborhood:
        return {"success": False, "reason": "Missing user_id or neighborhood"}
    for user in USERS:
        if user["user_id"] == user_id:
            user["neighborhood"] = neighborhood
            return {"success": True}
    USERS.append({"user_id": user_id, "neighborhood": neighborhood})
    return {"success": True}


@app.post("/log-action")
def log_action(payload: ActionLog):
    # Plain walk/waste actions are tracked but do not modify points.
    if payload.action_type in ("walk", "waste"):
        points = 0
    # Daily cap for mindfulness (wellbeing): 2 per day.
    elif payload.action_type == "wellbeing":
        today = date.today().isoformat()
        user_usage = MINDFULNESS_USAGE.setdefault(payload.user_id, {})
        count = user_usage.get(today, 0)
        if count >= 2:
            return {
                "success": False,
                "reason": "Daily mindfulness limit reached (2 per day).",
            }
        user_usage[today] = count + 1
        points = POINTS_PER_ACTION.get(payload.action_type, 0)
    else:
        points = POINTS_PER_ACTION.get(payload.action_type, 0)
    entry = {
        "user_id": payload.user_id,
        "action_type": payload.action_type,
        "points": points,
        "timestamp": datetime.utcnow().isoformat(),
    }
    ACTIONS.append(entry)
    get_user_neighborhood(payload.user_id)

    # compute new total for user
    total = sum(a["points"] for a in ACTIONS if a["user_id"] == payload.user_id)
    response = {"success": True, "new_total_points": total, "awarded_points": points}
    if payload.action_type == "wellbeing":
        today = date.today().isoformat()
        response["mindfulness_today"] = MINDFULNESS_USAGE[payload.user_id][today]
    return response


@app.get("/user-summary/{user_id}", response_model=UserSummary)
def user_summary(user_id: str):
    user_actions = [a for a in ACTIONS if a["user_id"] == user_id]
    # Transport points are awarded only via verified walks or bikes.
    transport_points = sum(
        a["points"]
        for a in user_actions
        if a["action_type"] in ("verified_walk", "verified_bike")
    )
    # Waste points are awarded only via verified cleanups.
    waste_points = sum(
        a["points"]
        for a in user_actions
        if a["action_type"] == "verified_waste"
    )
    wellbeing_points = sum(
        a["points"] for a in user_actions if a["action_type"] == "wellbeing"
    )
    total = transport_points + waste_points + wellbeing_points
    by_category: Dict[str, int] = {
        "transport": transport_points,
        "waste": waste_points,
        "wellbeing": wellbeing_points,
    }
    return UserSummary(user_id=user_id, total_points=total, by_category=by_category)

def get_total_points_for_user(user_id: str) -> int:
    return sum(a["points"] for a in ACTIONS if a["user_id"] == user_id)

@app.get("/city-summary")
async def city_summary():
    # In production, replace this loop with a DB aggregation query.
    neighborhoods = {}
    overall_total_points = 0

    for user in USERS:
        neighborhood = user["neighborhood"]
        total_points = get_total_points_for_user(user["user_id"])
        overall_total_points += total_points

        if neighborhood not in neighborhoods:
            neighborhoods[neighborhood] = {"total_points": 0, "user_count": 0}

        neighborhoods[neighborhood]["total_points"] += total_points
        neighborhoods[neighborhood]["user_count"] += 1

    response = {
        "neighborhoods": [
            {
                "name": name,
                "total_points": data["total_points"],
                "user_count": data["user_count"],
            }
            for name, data in neighborhoods.items()
        ],
        "overall_total_points": overall_total_points,
    }

    return response

@app.post("/verified-walk")
def verified_walk(payload: VerifiedWalkPayload):
    # Server-side validation to prevent spoofing
    if payload.duration_s < VERIFIED_WALK_MIN_SECONDS:
        return {"success": False, "reason": "Walk must be at least 10 seconds"}

    # Transport points are awarded only via verified walks.
    points = POINTS_PER_ACTION["verified_walk"]
    entry = {
        "user_id": payload.user_id,
        "action_type": "verified_walk",
        "points": points,
        "timestamp": datetime.utcnow().isoformat(),
        "meta": {
            "distance_m": payload.distance_m,
            "duration_s": payload.duration_s,
            "avg_speed_kmh": payload.avg_speed_kmh,
        },
    }
    ACTIONS.append(entry)
    get_user_neighborhood(payload.user_id)

    total = sum(a["points"] for a in ACTIONS if a["user_id"] == payload.user_id)
    return {"success": True, "new_total_points": total, "awarded_points": points}

@app.post("/verified-bike")
def verified_bike(payload: VerifiedBikePayload):
    # Cycling thresholds chosen for realistic city cycling ranges.
    if payload.duration_s < VERIFIED_BIKE_MIN_SECONDS or payload.distance_m < VERIFIED_BIKE_MIN_METERS:
        return {
            "success": False,
            "reason": "Bike ride too short. Ride at least 10 minutes and 2 km.",
        }
    if payload.avg_speed_kmh < VERIFIED_BIKE_MIN_KMH or payload.avg_speed_kmh > VERIFIED_BIKE_MAX_KMH:
        return {
            "success": False,
            "reason": "Average speed not in a realistic cycling range.",
        }

    points = POINTS_PER_ACTION["verified_bike"]
    entry = {
        "user_id": payload.user_id,
        "action_type": "verified_bike",
        "points": points,
        "timestamp": datetime.utcnow().isoformat(),
        "meta": {
            "distance_m": payload.distance_m,
            "duration_s": payload.duration_s,
            "avg_speed_kmh": payload.avg_speed_kmh,
        },
    }
    ACTIONS.append(entry)
    get_user_neighborhood(payload.user_id)

    total = sum(a["points"] for a in ACTIONS if a["user_id"] == payload.user_id)
    return {"success": True, "new_total_points": total, "awarded_points": points}

@app.post("/tts")
async def tts(request: TTSRequest):
    """
    Uses elevenlabs_helper to convert text to speech and returns base64 MP3.
    """
    try:
        audio_bytes = generate_tts_audio(request.text)
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
        return {"audio_base64": audio_base64}
    except Exception:
        return {"error": "TTS failed"}

@app.post("/verified-waste")
async def verified_waste(
    user_id: str = Form(...),
    before_image: UploadFile = File(...),
    after_image: UploadFile = File(...),
):
    if not GEMINI_CLIENT:
        return {"success": False, "reason": "Gemini API not configured"}

    try:
        before_bytes = await before_image.read()
        after_bytes = await after_image.read()
        before_part = types.Part.from_bytes(
            data=before_bytes, mime_type=before_image.content_type or "image/jpeg"
        )
        after_part = types.Part.from_bytes(
            data=after_bytes, mime_type=after_image.content_type or "image/jpeg"
        )
    except Exception:
        return {"success": False, "reason": "Failed to read uploaded images"}

    prompt = (
        "You are verifying a community cleanup action.\n"
        "Image A is BEFORE cleanup.\n"
        "Image B is AFTER cleanup.\n\n"
        "Do these images show the same physical location/scene?\n\n"
        "Is there clearly less visible trash or waste in Image B than in Image A?\n"
        "Respond strictly as JSON with the following fields:\n"
        '{ "same_scene": true/false, "cleanup_successful": true/false, '
        '"confidence": 0-1, "short_reason": "..." }.'
    )

    try:
        # Request JSON output from Gemini.
        result = GEMINI_CLIENT.models.generate_content(
            model="gemini-1.5-flash",
            contents=[prompt, before_part, after_part],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            ),
        )
        raw_text = (result.text or "").strip()
        verdict = json.loads(raw_text)
    except Exception:
        return {"success": False, "reason": "Verification failed. Try again."}

    same_scene = bool(verdict.get("same_scene"))
    cleanup_successful = bool(verdict.get("cleanup_successful"))
    confidence = float(verdict.get("confidence", 0))
    short_reason = verdict.get("short_reason") or "Cleanup not verified"

    # Accept only if Gemini is confident and agrees cleanup occurred.
    if not (same_scene and cleanup_successful and confidence >= VERIFIED_WASTE_MIN_CONFIDENCE):
        return {"success": False, "reason": short_reason}

    points = POINTS_PER_ACTION["verified_waste"]
    entry = {
        "user_id": user_id,
        "action_type": "verified_waste",
        "points": points,
        "timestamp": datetime.utcnow().isoformat(),
        "meta": {
            "confidence": confidence,
            "short_reason": short_reason,
        },
    }
    ACTIONS.append(entry)
    get_user_neighborhood(user_id)

    total = sum(a["points"] for a in ACTIONS if a["user_id"] == user_id)
    return {"success": True, "new_total_points": total, "awarded_points": points}

@app.get("/voice-recap/{user_id}")
def voice_recap(user_id: str):
    summary = user_summary(user_id)  # uses your existing function
    actions = {
        "transport": summary.by_category.get("transport", 0),
        "waste": summary.by_category.get("waste", 0),
        "wellbeing": summary.by_category.get("wellbeing", 0),
    }

    audio_bytes = generate_recap_audio(actions)
    return Response(content=audio_bytes, media_type="audio/mpeg")

@app.get("/")
def root():
    return {"message": "API is running"}
