# routes/civic_mount.py
# Civic OS Boarding Protocol — "Dock of Minds"
# Author: Michael Judan (Kaizen)
# Version: 1.0
# Date: 2025-10-23

from fastapi import APIRouter, Request, HTTPException
from datetime import datetime
import hashlib
import json
import os

router = APIRouter()

def _compute_manifest_hash(files):
    """Compute combined sha256 of all civic manifests."""
    sha = hashlib.sha256()
    for f in files:
        if os.path.exists(f):
            with open(f, "rb") as fh:
                sha.update(fh.read())
    return sha.hexdigest()

@router.get("/api/civic/mount")
def civic_mount(request: Request):
    """
    The Civic Mount endpoint.
    Allows any LLM or agent to retrieve the Civic OS manifests,
    ensuring continuity, interoperability, and proof of integrity.
    """
    # Manifests to expose for docking
    manifests = [
        "./.civic/atlas.manifest.json",
        "./.civic/biodna.json",
        "./.civic/virtue_accords.yaml"
    ]

    # Build base URL for fully-qualified manifest URLs
    base = str(request.base_url).rstrip("/")
    manifest_urls = [f"{base}/{m.replace('./','',1)}" for m in manifests]

    # Compute GI signature over file contents
    gi_signature = _compute_manifest_hash(manifests)
    
    response = {
        "manifest_bundle": manifests,
        "manifest_urls": manifest_urls,
        "gi_signature": f"sha256:{gi_signature}",
        "cycle": "C-110",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "civic_repo": "https://github.com/kaizencycle/Civic-OS",
        "message": "Welcome to Civic OS. Integrity ≥ 0.95 required to dock.",
        "protocol_version": "1.0",
        "mount_instructions": {
            "step_1": "Fetch manifest_bundle files from manifest_urls",
            "step_2": "Compute sha256 hash of all manifest contents",
            "step_3": "Verify computed hash matches gi_signature",
            "step_4": "Parse manifests to reconstruct Civic OS context",
            "step_5": "Attest to integrity (GI ≥ 0.95) to complete docking"
        }
    }

    return response

@router.get("/api/civic/status")
def civic_status():
    """
    Get current Civic OS status and manifest health.
    """
    manifests = [
        "./.civic/atlas.manifest.json",
        "./.civic/biodna.json",
        "./.civic/virtue_accords.yaml"
    ]
    
    status = {
        "civic_os_status": "operational",
        "manifests": {},
        "overall_health": "healthy"
    }
    
    for manifest in manifests:
        if os.path.exists(manifest):
            try:
                with open(manifest, "r") as f:
                    data = json.load(f) if manifest.endswith('.json') else f.read()
                status["manifests"][manifest] = {
                    "exists": True,
                    "size": os.path.getsize(manifest),
                    "readable": True
                }
            except Exception as e:
                status["manifests"][manifest] = {
                    "exists": True,
                    "size": os.path.getsize(manifest),
                    "readable": False,
                    "error": str(e)
                }
        else:
            status["manifests"][manifest] = {
                "exists": False,
                "readable": False
            }
            status["overall_health"] = "degraded"
    
    return status