from fastapi import FastAPI, Response
from elevenlabs_helper import generate_recap_audio
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from datetime import datetime
from dotenv import load_dotenv
from fastapi.responses import FileResponse
import os

load_dotenv()

class ActionLog(BaseModel):
    user_id: str
    action_type: str  # "transport" | "waste" | "wellbeing"

class UserSummary(BaseModel):
    user_id: str
    total_points: int
    by_category: Dict[str, int]


ACTIONS = []  # list of dicts
POINTS_PER_ACTION = {
    "transport": 2,
    "waste": 2,
    "wellbeing": 1,
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # hackathon safe
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/log-action")
def log_action(payload: ActionLog):
    points = POINTS_PER_ACTION.get(payload.action_type, 0)
    entry = {
        "user_id": payload.user_id,
        "action_type": payload.action_type,
        "points": points,
        "timestamp": datetime.utcnow().isoformat(),
    }
    ACTIONS.append(entry)

    # compute new total for user
    total = sum(a["points"] for a in ACTIONS if a["user_id"] == payload.user_id)
    return {"success": True, "new_total_points": total}


@app.get("/user-summary/{user_id}", response_model=UserSummary)
def user_summary(user_id: str):
    user_actions = [a for a in ACTIONS if a["user_id"] == user_id]
    by_category: Dict[str, int] = {"transport": 0, "waste": 0, "wellbeing": 0}
    for a in user_actions:
        by_category[a["action_type"]] += a["points"]
    total = sum(by_category.values())
    return UserSummary(user_id=user_id, total_points=total, by_category=by_category)

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