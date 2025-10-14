# Lab7-Proof × PAL (Predictive Autonomous Learning) Integration Pack

This pack wires your **Lab7-Proof** stack to the **PAL (Predictive Autonomous Learning)** loop:
- Echo → episodes
- Eve → Reward Model (RM)
- Hermes → bandit/RL training & PRs
- Zeus → rollout gates (shadow → canary → full)
- Ledger → model cards & audit trail

It assumes:
- **Backend**: FastAPI (Lab7-Proof API) with `/v1/health`
- **Frontend**: Next.js app (optional) with `/api/health` or `/` health
- **Render** for deploys (backend + frontend services)
- **GitHub Actions** for CI/CD

## What’s inside
- `services/pal_api/app.py` — PAL microservice (FastAPI) tailored for Lab7-Proof
- `pal_config/lab7.yaml` — routes & service names for quick wiring
- `scripts/echo_hook.py` — drop-in example to log Echo events → `ledger/episodes.jsonl`
- `trainers/` — reward model + bandit trainer (offline)
- `ledger/` — seed episodes + model card
- `tests/health_test.py` — simple backend health + PAL smoke tests
- `.github/workflows/lab7-ci.yml` — back/front build+tests
- `.github/workflows/deploy-render.yml` — deploy both services to Render on merge to `main`
- `.github/workflows/zeus-rollout.yml` — rollout gates and optional auto-label for automerge
- `.env.example` — variables you’ll want in GitHub secrets

## Required GitHub Secrets
- `LAB7_RENDER_API_KEY` — Render API token (service-scoped if possible)
- `LAB7_BACKEND_SERVICE_ID` — Render service id for API
- `LAB7_FRONTEND_SERVICE_ID` — Render service id for web (optional)
- (optional) `LAB7_AUTOLABEL_TOKEN` — a fine-scoped PAT/GitHub App token to add labels

## Quick start
1) Commit this pack at the repo root (or a subfolder) and adjust paths if your monorepo layout differs.  
2) Ensure your backend exposes `GET /v1/health` and returns `{"ok": true}`.  
3) Add the GitHub secrets above.  
4) Merge to `main` → CI runs → if green, Render deploy hooks fire.  
5) Start logging Echo events by calling `scripts/echo_hook.py` from your event pipeline.  
6) Kick a training run:
```bash
python trainers/reward_model/train_rm.py --episodes ledger/episodes.jsonl --out ledger/reward_models/rm_v1.pkl
python trainers/bandit/train_linucb.py --episodes ledger/episodes.jsonl --rm ledger/reward_models/rm_v1.pkl --out ledger/policies/linucb_v1.json
```

## Health checks
- Backend: `GET https://<backend-host>/v1/health` → 200 & `{"ok": true}`
- Frontend: `GET https://<frontend-host>/api/health` or `GET /` → 200

Adjust workflow steps if your paths or package managers differ.
