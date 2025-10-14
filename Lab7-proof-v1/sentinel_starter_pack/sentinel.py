from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
import hmac, hashlib, os, json

app = FastAPI()

SHARED_SECRET = os.environ.get("SENTINEL_HMAC", "replace-me")

class Task(BaseModel):
    repo: str
    branch: str
    intent: str
    constraints: dict | None = None

def _verify(sig_header: str, body: bytes) -> bool:
    mac = hmac.new(SHARED_SECRET.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(f"sha256={mac}", sig_header)

def jade_plan(intent: str, repo: str, constraints: dict | None):
    # TODO: call Jade agent; here we return a toy plan
    return {
        "changes": [
            {"path": "api/routes/health.py", "content": "from fastapi import APIRouter\nrouter = APIRouter()\n@router.get('/v1/health')\ndef health():\n    return {'ok': True}\n"}
        ],
        "constraints": constraints or {"allow_paths": ["api/", "tests/"], "max_added_lines": 400}
    }

def eve_review(plan: dict):
    # TODO: call Eve agent; soft checks only in stub
    too_big = sum(c['content'].count('\n') for c in plan["changes"]) > 400
    allowed = all(c["path"].startswith(tuple(plan["constraints"]["allow_paths"])) for c in plan["changes"])
    return {"approved": (not too_big) and allowed, "reason": None if (not too_big and allowed) else "Policy check failed"}

def hermes_implement_and_open_pr(repo: str, branch: str, plan: dict):
    # TODO: call Hermes agent or trigger repository_dispatch to GH Actions
    # In a real system, Hermes would push a branch and open a PR using a GitHub App token.
    return f"https://github.com/{repo}/pulls"

@app.post("/sentinel/dispatch")
def dispatch(task: Task, x_signature_256: str = Header("sha256-dev")):
    body = json.dumps(task.dict()).encode()
    if not _verify(x_signature_256, body):
        raise HTTPException(401, "bad signature")
    plan = jade_plan(task.intent, task.repo, task.constraints or {})
    review = eve_review(plan)
    if not review["approved"]:
        return {"status": "rejected", "reason": review["reason"]}
    pr_url = hermes_implement_and_open_pr(task.repo, task.branch, plan)
    return {"status": "submitted", "pr": pr_url}
