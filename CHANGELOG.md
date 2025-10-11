# Changelog

## v0.1.0 — 2025-10-11

### Added
- **Orchestrator (FastAPI)**
  - Public: POST /v1/session/start, POST /v1/session/turn, POST /v1/session/submit, POST /v1/session/critique
  - Internal: POST /v1/attest/commit, POST /v1/reward/intent, GET /v1/ledger/balance/:user_id
  - Mentor adapters (stubs), XP/level curve, attestation + reward minter (stub), in-memory indexer
  - Policy-driven **Citizen Shield** with YAML gates
- **Rubric service (FastAPI)**: POST /rubric/score + async client in orchestrator
- **Reflections App (Next.js)**
  - /mentor page: start session, get drafts, compare (matrix + A/B), combine, **weighted synthesis**, **critique**
  - API proxies mirroring orchestrator (incl. /session/critique)
  - Prisma layer + simple user upsert
- **Data & Infra**
  - Postgres schema: users, sessions, xp_events, attestations, rewards
  - Dockerfiles + unified docker-compose.yml
  - Seed scaffold, smoke script, env examples

### Changed
- Enforced mint gates (integrity + average rubric thresholds) before level-up rewards.

### Security
- Centralized Shield policy (blocked keywords, rate limits, mint gates).
- Attestation stub with Merkle root + signature placeholder.

### Notes
- Ledger balance is in-memory for MVP; replace with real indexer when ledger is wired.
- Model calls are stubbed; adapters ready for real SDKs.
