from fastapi import FastAPI
from app.routers.oaa import router as oaa_router
from app.routers.health import router as health_router
from app.routers.health_auth import router as health_auth_router
from app.routers.health_redis import router as health_redis_router
import os

app = FastAPI(
    title="Lab7 – Open Attestation Authority (OAA)",
    description="Cryptographic attestation and verification engine for the Kaizen DVA ecosystem",
    version="1.0.0"
)

# Include routers
app.include_router(oaa_router)
app.include_router(health_router)
app.include_router(health_auth_router)
app.include_router(health_redis_router)

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
            "anchor": "/oaa/state/anchor",
            "health": "/health",
            "health_auth": "/health/auth",
            "redis_health": "/_health/redis"
        }
    }
