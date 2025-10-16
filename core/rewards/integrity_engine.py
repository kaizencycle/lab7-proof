# core/rewards/integrity_engine.py
import hashlib, json, time
from typing import Dict, Any

def _hash_payload(payload: Dict[str, Any]) -> str:
    data = json.dumps(payload, sort_keys=True).encode("utf-8")
    return hashlib.sha256(data).hexdigest()

def _clip(x: float) -> float:
    return max(0.0, min(1.0, float(x)))

def evaluate_reward(payload: Dict[str, Any], manifest: Dict[str, Any]) -> Dict[str, Any]:
    weights = manifest["scoring"]["weights"]
    penalties_w = manifest["scoring"]["penalties"]
    base = manifest["issuance"]["base"]

    truth         = _clip(payload.get("scores", {}).get("truth", 0.0))
    symbiosis     = _clip(payload.get("scores", {}).get("symbiosis", 0.0))
    verification  = _clip(payload.get("scores", {}).get("verification", 0.0))
    novelty       = _clip(payload.get("scores", {}).get("novelty", 0.0))

    entropy        = _clip(payload.get("penalties", {}).get("entropy", 0.0))
    duplication    = _clip(payload.get("penalties", {}).get("duplication", 0.0))
    policy_violation = 1.0 if payload.get("penalties", {}).get("policy_violation", False) else 0.0
    drift_anomaly  = _clip(payload.get("penalties", {}).get("drift_anomaly", 0.0))

    I = (weights["truth"] * truth +
         weights["symbiosis"] * symbiosis +
         weights["verification"] * verification +
         weights["novelty"] * novelty)

    P = (penalties_w["entropy"] * entropy +
         penalties_w["duplication"] * duplication +
         penalties_w["policy_violation"] * policy_violation +
         penalties_w["drift_anomaly"] * drift_anomaly)

    gic = max(0.0, base * (I - P))
    if policy_violation >= 1.0 or drift_anomaly > 0.5:
        gic = 0.0

    seal = _hash_payload(payload)
    return {"ok": True, "GIC": gic, "integrity": I, "penalty": P, "seal": seal, "timestamp": time.time()}
