import json, pathlib, subprocess, sys

plan_path = 'plan.json'
with open(plan_path) as f:
    plan = json.load(f)

for change in plan.get("changes", []):
    p = pathlib.Path(change["path"])
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(change["content"])

subprocess.run(["git", "add", "-A"], check=True)
subprocess.run(["git", "config", "user.name", "agent-bot"], check=True)
subprocess.run(["git", "config", "user.email", "agent-bot@users.noreply.github.com"], check=True)
subprocess.run(["git", "commit", "-m", "agent: apply plan"], check=True)
