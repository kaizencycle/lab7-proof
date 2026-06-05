# app/routers/health_auth.py
from datetime import datetime

from fastapi import APIRouter, Depends

from ..middleware.auth import verify_api_key

router = APIRouter()


@router.get("/health/auth")
async def health_auth(_=Depends(verify_api_key)):
    return {"ok": True, "auth": True, "ts": datetime.utcnow().isoformat() + "Z"}
