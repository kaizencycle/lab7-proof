# Lab7 × PAL (Predictive Autonomous Learning) — Integration PR

This PR adds a closed-loop learning layer to Lab7:
- **PAL API** (`/services/pal_api`) with endpoints: `/pal/feedback`, `/pal/reward/log`, `/pal/policy/infer`, `/pal/train`, `/pal/model-card/:version`
- **Echo hook** (`/scripts/echo_hook.py`) to log episodes to `ledger/episodes.jsonl`
- **Offline trainers** (`/trainers/`) for Reward Model and Bandit policy
- **Model card + episodes** seeds in `ledger/`
- **CI** for backend + optional Next.js frontend (`.github/workflows/lab7-ci.yml`)
- **Render deploy** for API + Web on merge to `main` (`.github/workflows/deploy-render.yml`)
- **Zeus rollout** (`.github/workflows/zeus-rollout.yml`) for shadow/canary gates

## Secrets needed
- `LAB7_RENDER_API_KEY`
- `LAB7_BACKEND_SERVICE_ID`
- (optional) `LAB7_FRONTEND_SERVICE_ID`
- (optional) `LAB7_AUTOLABEL_TOKEN` — for auto-labeling `automerge:safe`

## Canary health (post-deploy)
Add `LAB7_BACKEND_HEALTH_URL` (e.g., `https://<api-host>/v1/health`) in your repo variables for CI smoke checks. The deploy workflow triggers Render and expects your service to become healthy; you can extend it with a curl-retry block if desired.

## Next steps
- Start appending Echo events (see `scripts/echo_hook.py` example).
- Train RM + Bandit periodically (or schedule via CI).
- Promote from shadow → canary with Zeus gates.
