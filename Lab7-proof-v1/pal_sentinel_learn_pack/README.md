# PAL (Predictive Autonomous Learning) — Sentinel-Learn Pack

This pack adds a closed-loop learning layer to your agent nervous system:
- **Echo** emits episodes
- **Eve** provides a Reward Model (RM) interface
- **Hermes** trains bandit/RL policies offline
- **Zeus** gates rollouts (shadow → canary → full)
- **Ledger** stores episodes, model cards, and metrics

## Components
- `services/pal_api/` FastAPI microservice exposing:
  - `POST /pal/feedback` (explicit thumbs)
  - `POST /pal/reward/log` (implicit signals)
  - `POST /pal/policy/infer` (context → action with uncertainty)
  - `POST /pal/train` (kick scheduled retrain)
  - `GET  /pal/model-card/{version}` (transparency)
- `trainers/bandit/` Contextual Bandit (LinUCB) + offline trainer
- `trainers/reward_model/` Reward model stub (scikit-learn logistic baseline)
- `ledger/` Model cards + episodes are stored here (jsonl & json)
- `.github/workflows/zeus-rollout.yml` Shadow/Canary rollout gates

## Quick start (local)
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn services.pal_api.app:app --reload
```
Then:
```bash
curl -X POST http://localhost:8000/pal/policy/infer -H "Content-Type: application/json" -d '{"context":{"user_tier":"free","task":"summarize","hour":14}}'
```

## Training (offline)
```bash
python trainers/reward_model/train_rm.py --episodes ledger/episodes.jsonl --out ledger/reward_models/rm_v1.pkl
python trainers/bandit/train_linucb.py --episodes ledger/episodes.jsonl --rm ledger/reward_models/rm_v1.pkl --out ledger/policies/linucb_v1.json
```

## Rollout
- Commit a new policy file in `ledger/policies/`
- Zeus workflow (GitHub Actions) runs shadow eval → if KPIs good, labels PR `automerge:safe`

## Notes
- This is a skeleton for you to extend (connect to your real Echo logs, Eve RM, and Zeus policies)
- Files are small and readable—safe to customize.
