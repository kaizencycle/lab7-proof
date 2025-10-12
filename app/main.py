from fastapi import FastAPI
from app.routers.oaa import router as oaa_router
import os

app = FastAPI(
    title="Lab7 – Open Attestation Authority (OAA)",
    description="Cryptographic attestation and verification engine for the Kaizen DVA ecosystem",
    version="1.0.0"
)

# Include OAA router
app.include_router(oaa_router)

# Set admin token from environment
oaa_router.ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")

@app.get("/")
def root():
    return {
        "ok": True,
        "service": "Lab7-Proof OAA",
        "version": "1.0.0",
        "endpoints": {
            "keys": "/.well-known/oaa-keys.json",
            "verify": "/oaa/verify",
            "state": "/oaa/state/snapshot",
            "anchor": "/oaa/state/anchor"
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "lab7-proof-oaa"}
