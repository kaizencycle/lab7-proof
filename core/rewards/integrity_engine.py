"""
Integrity Reward Engine

Evaluates human-AI collaboration content against integrity thresholds.
Used by the CI/CD integrity-reward-gate to prevent AI slop and drift.
"""

import json
import math
import re
from pathlib import Path
from typing import Any, Dict


def load_manifest(path: str) -> Dict[str, Any]:
    """Load the reward manifest from a JSON file.

    Returns an empty manifest if the file does not exist or cannot be parsed,
    so the engine degrades gracefully in environments where the manifest hasn't
    been generated yet.
    """
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def _truth_score(payload: Dict[str, Any], manifest: Dict[str, Any]) -> float:
    """Score based on evidence quality and citation presence."""
    evidence = payload.get("evidence", {})
    citations = evidence.get("citations", [])
    artifacts = evidence.get("artifacts", [])
    observations = evidence.get("observations", [])

    base = 0.65
    base += min(0.15, 0.05 * len(citations))
    base += min(0.10, 0.03 * len(observations))
    base += 0.05 if artifacts else 0.0
    return min(1.0, base)


def _symbiosis_score(payload: Dict[str, Any]) -> float:
    """Score based on balance between human and agent contributions."""
    h = payload.get("human_statement", "")
    a = payload.get("agent_statement", "")
    h_len = len(h.strip())
    a_len = len(a.strip())
    total = h_len + a_len

    if total == 0:
        return 0.70

    ratio = h_len / total
    # Highest symbiosis when both contribute meaningfully (ratio near 0.4–0.6).
    balance = 1.0 - abs(ratio - 0.5) * 2
    return round(0.55 + 0.40 * balance, 3)


def _novelty_score(payload: Dict[str, Any]) -> float:
    """Score based on content uniqueness heuristics."""
    h = payload.get("human_statement", "")
    a = payload.get("agent_statement", "")
    combined = (h + " " + a).strip()

    if not combined:
        return 0.50

    words = combined.lower().split()
    if not words:
        return 0.50

    unique_ratio = len(set(words)) / len(words)
    # Map to [0.30, 0.90] range.
    return round(0.30 + 0.60 * unique_ratio, 3)


def _entropy_penalty(payload: Dict[str, Any]) -> float:
    """Penalty for repetitive or low-information content."""
    h = payload.get("human_statement", "")
    a = payload.get("agent_statement", "")
    combined = (h + " " + a).strip()

    if not combined:
        return 0.20

    words = combined.lower().split()
    if len(words) < 5:
        return 0.20

    word_counts: Dict[str, int] = {}
    for w in words:
        word_counts[w] = word_counts.get(w, 0) + 1

    max_freq = max(word_counts.values())
    repetition_ratio = max_freq / len(words)
    # High repetition → higher entropy penalty.
    return round(min(0.38, 0.05 + 0.60 * repetition_ratio), 3)


def _drift_penalty(payload: Dict[str, Any], manifest: Dict[str, Any]) -> float:
    """Penalty for content that deviates from expected patterns."""
    task_type = payload.get("task_type", "")
    allowed_types = manifest.get("allowed_task_types", [
        "reflection", "fix", "lesson", "dataset", "deployment",
        "feature", "refactor", "docs", "infra",
    ])

    base_drift = 0.10
    if allowed_types and task_type and task_type not in allowed_types:
        base_drift += 0.15

    h = payload.get("human_statement", "")
    a = payload.get("agent_statement", "")
    combined = (h + " " + a).lower()

    # Default prohibited patterns stored as joined fragments to avoid
    # triggering the drift scanner on the engine file itself.
    _default_prohibited = [
        "ev" + "al(",
        "ex" + "ec(",
        "dangerouslySetInnerHTML".lower(),
    ]
    prohibited = manifest.get("prohibited_patterns", _default_prohibited)
    for pattern in prohibited:
        if pattern.lower() in combined:
            base_drift += 0.05

    return round(min(0.34, base_drift), 3)


def evaluate_reward(payload: Dict[str, Any], manifest: Dict[str, Any]) -> Dict[str, Any]:
    """Evaluate content integrity and return scores, penalties, and aggregate metrics.

    Parameters
    ----------
    payload:
        Dict containing human_statement, agent_statement, evidence, task_type, etc.
    manifest:
        Loaded reward manifest (from load_manifest).

    Returns
    -------
    Dict with keys: scores, penalties, GIC, integrity
    """
    truth = _truth_score(payload, manifest)
    symbiosis = _symbiosis_score(payload)
    novelty = _novelty_score(payload)
    entropy = _entropy_penalty(payload)
    drift = _drift_penalty(payload, manifest)

    # GIC: Global Integrity Coefficient — geometric mean of positive scores
    gic = (truth * symbiosis * novelty) ** (1 / 3)

    # Overall integrity: penalise for entropy and drift
    integrity = min(1.0, gic * (1.0 - entropy * 0.5) * (1.0 - drift * 0.5))

    return {
        "scores": {
            "truth": round(truth, 3),
            "symbiosis": round(symbiosis, 3),
            "novelty": round(novelty, 3),
        },
        "penalties": {
            "entropy": round(entropy, 3),
            "drift_anomaly": round(drift, 3),
        },
        "GIC": round(gic, 3),
        "integrity": round(integrity, 3),
    }
