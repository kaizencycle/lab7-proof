# app/routers/health.py
from datetime import datetime

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    return {"ok": True, "ts": datetime.utcnow().isoformat() + "Z"}
