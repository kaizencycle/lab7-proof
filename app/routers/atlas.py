# app/routers/atlas.py
from fastapi import APIRouter, Header, HTTPException, Depends
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
import os
import json
import hashlib
import base64
from app.crypto.ed25519 import ed25519_verify, canonical_json, sha256_hex
from app.utils.capsule_verify import verify_capsule as verify_capsule_util
from app.utils.security import validate_shield_headers, log_security_event

router = APIRouter(prefix="/api/atlas", tags=["atlas"])

# Constants
GI_MIN = 0.95
CYCLE_PREFIX = "C-"

# Mock data for now - in production this would come from service discovery
SERVICES_DATA = [
    {"name": "lab7-oaa", "status": "healthy", "version": "1.3.2", "hash": "b665ba8"},
    {"name": "lab4-reflections", "status": "healthy", "version": "1.2.1", "hash": "910b67a"},
    {"name": "lab6-shield", "status": "degraded", "version": "0.9.8", "hash": "2cae11"}
]

REPOS_DATA = [
    {
        "name": "OAA-API-Library",
        "url": "https://github.com/kaizencycle/OAA-API-Library",
        "manifest": "/.civic/atlas.manifest.json"
    },
    {
        "name": "lab7-proof",
        "url": "https://github.com/kaizencycle/lab7-proof",
        "manifest": "/.civic/atlas.manifest.json"
    }
]

# Mock capsule storage - in production this would be persistent
CAPSULES_STORE = []

def get_current_cycle() -> str:
    """Generate current cycle identifier"""
    # Simple implementation - in production this might be more sophisticated
    now = datetime.now(timezone.utc)
    cycle_num = (now.year - 2025) * 12 + now.month
    return f"{CYCLE_PREFIX}{cycle_num}"

# Security validation functions are now imported from app.utils.security

def verify_capsule_simple(capsule: Dict[str, Any], min_gi: float = GI_MIN) -> Dict[str, Any]:
    """
    Capsule verification using the capsule_verify utility
    """
    return verify_capsule_util(capsule, min_gi=min_gi)

@router.get("/audit")
def audit():
    """Returns the current Civic OS integrity view"""
    return {
        "cycle": get_current_cycle(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "gi_score": 0.972,
        "virtue_accords": ["Virtue Accord v1", "Yautja Kernel v1"],
        "services": SERVICES_DATA,
        "ledger_ref": "ledger://atlas/audit/pending",
        "capsules_latest": [capsule["id"] for capsule in CAPSULES_STORE[-5:]]  # Last 5 capsules
    }

@router.get("/catalog")
def catalog():
    """Lists repos, OpenAPI links, and atlas.manifest locations"""
    return {
        "repos": REPOS_DATA
    }

@router.post("/attest")
async def attest(
    attestation: Dict[str, Any],
    x_gi_score: Optional[str] = Header(None),
    x_sig: Optional[str] = Header(None),
    x_key_id: Optional[str] = Header(None)
):
    """Submit signed attestations"""
    # Validate all Shield headers
    gi_score, sig, key_id = validate_shield_headers(x_gi_score, x_sig, x_key_id, GI_MIN)
    
    # Log security event
    log_security_event("attest_submission", key_id, gi_score, True, {"attestation_type": attestation.get("type", "unknown")})
    
    # TODO: Implement actual signature verification
    # For now, just validate the structure
    if not attestation.get("content"):
        raise HTTPException(status_code=400, detail="Attestation must include content")
    
    # Generate ledger reference (mock)
    content_hash = hashlib.sha256(canonical_json(attestation).encode()).hexdigest()
    ledger_ref = f"ledger://attest/{content_hash[:8]}"
    
    # TODO: Actually write to ledger via Civic-Protocol-Core
    # For now, just return success
    
    return {
        "accepted": True,
        "ledger_ref": ledger_ref,
        "gi": gi_score
    }

@router.get("/capsules")
def get_capsules(limit: int = 10):
    """Returns the last N .gic capsule IDs + metadata"""
    return {
        "items": CAPSULES_STORE[-limit:] if CAPSULES_STORE else []
    }

@router.post("/capsules/verify")
def capsules_verify(
    capsule: Dict[str, Any],
    x_gi_score: Optional[str] = Header(None),
    x_sig: Optional[str] = Header(None),
    x_key_id: Optional[str] = Header(None)
):
    """Verify a capsule (YAML/JSON)"""
    # Validate all Shield headers
    gi_score, sig, key_id = validate_shield_headers(x_gi_score, x_sig, x_key_id, GI_MIN)
    
    # Verify capsule
    result = verify_capsule_simple(capsule)
    
    if not result["ok"]:
        log_security_event("capsule_verify_failed", key_id, gi_score, False, {"errors": result["errors"]})
        raise HTTPException(status_code=400, detail=result["errors"])
    
    log_security_event("capsule_verify_success", key_id, gi_score, True, {"capsule_id": capsule.get("id")})
    return {"ok": True, "errors": []}

@router.post("/capsules/ingest")
def ingest_capsule(
    capsule: Dict[str, Any],
    x_gi_score: Optional[str] = Header(None),
    x_sig: Optional[str] = Header(None),
    x_key_id: Optional[str] = Header(None)
):
    """Ingest a verified capsule into the store"""
    # Validate all Shield headers
    gi_score, sig, key_id = validate_shield_headers(x_gi_score, x_sig, x_key_id, GI_MIN)
    
    # Verify capsule first
    result = verify_capsule_simple(capsule)
    if not result["ok"]:
        log_security_event("capsule_ingest_failed", key_id, gi_score, False, {"errors": result["errors"]})
        raise HTTPException(status_code=400, detail=result["errors"])
    
    # Add to store
    CAPSULES_STORE.append(capsule)
    
    log_security_event("capsule_ingest_success", key_id, gi_score, True, {"capsule_id": capsule.get("id")})
    return {
        "ok": True,
        "capsule_id": capsule.get("id"),
        "stored": True
    }