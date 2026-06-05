from datetime import datetime
from typing import Any, Literal

from pydantic import AnyHttpUrl, BaseModel


class Endpoint(BaseModel):
    path: str
    method: Literal["GET", "POST", "PUT", "DELETE", "PATCH"] = "GET"
    schema: str | None = None
    notes: str | None = None


class Source(BaseModel):
    id: str  # e.g. "src:public-apis:open-meteo"
    name: str
    domain: str
    category: list[str] = []
    auth: Literal["none", "apiKey", "oauth2", "other"] = "none"
    license: str | None = None
    owner: dict[str, str] | None = None
    endpoints: list[Endpoint] = []
    meta: dict[str, str] = {}
    last_update: datetime | None = None
    tags: list[str] = []


class SourceScore(BaseModel):
    source_id: str
    scores: dict[
        str, float
    ]  # provenance, permission, freshness, quality, safety, reputation
    composite: float
    policy_gate: Literal["pass", "deny", "review"]


class IngestRequest(BaseModel):
    # Option A: provide a URL to a JSON list of sources
    url: AnyHttpUrl | None = None
    # Option B: inline sources in request
    sources: list[Source] | None = None
    # Optional: label for where we ingested from
    origin: str = "manual"


class FilterRequest(BaseModel):
    source: Source


class FilterResult(BaseModel):
    score: SourceScore
    reasons: list[str] = []  # which rules fired


class ReputeVote(BaseModel):
    source_id: str
    voter_id: str
    stake_gic: float = 0.0
    opinion: Literal["up", "down", "neutral"] = "neutral"
    comment: str | None = None


class ReputeResult(BaseModel):
    ok: bool
    new_reputation: float
    total_votes: int
    attestation: dict[str, Any] | None = None  # NEW


class VerifyRequest(BaseModel):
    attestation: dict[str, Any]


class VerifyResponse(BaseModel):
    ok: bool
    reason: str | None = None
    recomputed_hash: str | None = None
    signer_known: bool | None = None
    ts_ok: bool | None = None
    nonce_ok: bool | None = None
