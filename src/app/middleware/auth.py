# Lab7-Proof /middleware/auth.py
# Secure API key verification + audit logging

import datetime
import os

from fastapi import HTTPException, Request

API_KEY = os.getenv("API_KEY")

# Identify known labs from headers (for logging)
KNOWN_LABS = {
    "lab4": "Reflections",
    "lab6": "Citizen Shield",
    "ledger": "Civic Protocol Core",
    "lab7": "Online Apprenticeship Agent",
}


async def verify_api_key(request: Request):
    """Verifies the x-api-key header and logs which Lab sent it."""
    key = request.headers.get("x-api-key")
    lab_id = request.headers.get("x-lab-id", "unknown").lower()

    # C-332: fail CLOSED. Previously `if key != API_KEY` passed when API_KEY was
    # unset (None) and the caller sent no header (None) — `None != None` is False,
    # so a misconfigured deploy authenticated everyone. Reject when the server has
    # no key configured, when the caller sends no key, or on mismatch.
    if not API_KEY:
        # Server misconfiguration must not become an open door.
        raise HTTPException(
            status_code=503, detail="Auth unavailable: API_KEY not configured"
        )
    if not key or key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API key")

    # Timestamp + source logging
    timestamp = datetime.datetime.utcnow().isoformat()
    lab_name = KNOWN_LABS.get(lab_id, "Unknown Lab")

    print(f"[{timestamp}] ✅ Verified request from {lab_name} ({lab_id})")

    # Return lab name to routes if needed
    return {"ok": True, "lab": lab_name, "time": timestamp}
