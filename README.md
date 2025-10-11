# Lab7-proof (OAA) — Civilian Stack

**Online Apprenticeship Agent** that merges:
- **Academics** — mentor ensemble (Gemini/Claude/DeepSeek/Perplexity), rubric scoring, learning quests
- **Personal Diary** — reflections frontend with sessions, drafts, critique
- **Citizen Shield** — policy-driven safety, rate limits, reputation, mint gates
- **GIC Economy** — XP → Level → GIC rewards with attestations + ledger index (MVP)

## Monorepo layout

```
lab7-proof/  
├─ openapi.yaml  
├─ services/  
│  ├─ orchestrator/        # FastAPI: session/turn/submit/critique + Shield/XP/Attest/Reward stubs  
│  └─ rubric/              # FastAPI: /rubric/score (heuristic)  
├─ frontend/reflections-app/  # Next.js app (/mentor) + API proxies + Prisma  
├─ infra/  
│  └─ sql/001_init.sql     # Postgres schema  
├─ clients/  
│  ├─ ts/                  # @lab7/oaa-client  
│  └─ python/              # lab7-oaa-client  
└─ docker-compose.yml  

```

## Quick start
```bash
# 1) Boot stack
cp env.example .env
docker compose up --build

# 2) Open services
# UI:            http://localhost:3000
# Orchestrator:  http://localhost:8080/docs
# Rubric:        http://localhost:8090/docs

# 3) Try the Mentor page
# Visit /mentor → start session → Get Drafts → Combine/Synthesize → Critique → Submit

```

**Public API (v1)**  
	•	POST /v1/session/start  
	•	POST /v1/session/turn  
	•	POST /v1/session/submit  
	•	POST /v1/session/critique  

OpenAPI: lab7-proof/openapi.yaml (validated in CI).  
Typed clients: clients/ts (npm) · clients/python (PyPI).  

**Configuration**  
	•	**Citizen Shield** policy at services/orchestrator/policy/shield.policy.yaml  
	•	Env:  
	•	ENABLE_REWARDS=true  
	•	RUBRIC_BASE_URL=http://rubric:8090  
	•	SHIELD_POLICY_PATH=/policy/shield.policy.yaml  
	•	Model keys (optional): GEMINI_API_KEY, CLAUDE_API_KEY, DEEPSEEK_API_KEY, PERPLEXITY_API_KEY  

**Roadmap (proposed)**  
	•	Streaming drafts (SSE/WS) + live rubric  
	•	Persist sessions/xp/attestations in Postgres (currently in-memory in orchestrator)  
	•	Real ledger/indexer adapter  
	•	Admin policy UI + /v1/policy endpoints  
	•	"Academics" quest engine + Diary timeline view  
