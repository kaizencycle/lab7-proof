# Sentinel Starter Pack (Jade • Eve • Hermes • Zeus)

This pack wires an agent-controlled PR→CI→Deploy loop.

## Includes
- `sentinel.py` (FastAPI control plane stub)
- `.github/workflows/agent-pr.yml` (agent PR pipeline)
- `.github/workflows/deploy.yml` (Render deploy on main)
- `.github/workflows/zeus-automerge.yml` (guarded automerge)
- `.github/agent/apply_patch.py` (applies Jade plan to repo)
- `plan.example.json` / `review.example.json`

## Quick start
1. Create a GitHub App with minimal repo permissions (contents:write, pull-requests:write).
2. Add secrets to your repo:
   - `RENDER_SERVICE_ID`
   - `RENDER_API_KEY`
3. Optionally add branch protection on `main` with required checks.
4. POST an intent to your Sentinel endpoint (see `sentinel.py`) or run a `repository_dispatch` event with type `agent-run` and a `plan.json` committed to the branch.

> NOTE: `sentinel.py` is a stub. Replace `jade_plan`, `eve_review`, `hermes_implement_and_open_pr` with your agent calls. 
