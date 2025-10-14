PY=python3
VENV=.venv
PIP=$(VENV)/bin/pip
PYTHON=$(VENV)/bin/python
PYTEST=$(VENV)/bin/pytest

SETUP=$(PY) -m venv $(VENV) && $(PIP) install -U pip && $(PIP) install -r requirements.txt

.PHONY: setup test validate pulse attest echo clean

setup:
	$(SETUP)

test:
	$(PYTEST) -q

validate:
	$(PYTHON) - <<'PY'
from json import loads
from pathlib import Path
from jsonschema import Draft202012Validator
schema = loads(Path("global-health-sentinel/schema/pulse.schema.json").read_text())
payload = loads(Path("global-health-sentinel/attestations/example_attestation.json").read_text()) if Path("global-health-sentinel/attestations/example_attestation.json").exists() else None
if not payload:
    print("No example_attestation.json found; skipping schema validate target.")
else:
    v = Draft202012Validator(schema)
    errs = sorted([f"{'/'.join(map(str,e.path))}: {e.message}" for e in v.iter_errors(payload)])
    print("Schema OK" if not errs else "Schema ERRORS:\n- "+"\n- ".join(errs))
PY

pulse:
	$(PYTHON) global-health-sentinel/pulse_sentinel.py

attest:
	ATTEST=1 $(PYTHON) global-health-sentinel/pulse_sentinel.py

echo:
	$(PYTHON) global-health-sentinel/echo_bridge.py

echo_attachless:
	$(PYTHON) - <<'PY'
from global_health_sentinel.echo_bridge import run_once
run_once(attach_global=False)
PY

clean:
	rm -rf $(VENV) sentinel_logs */__pycache__ .pytest_cache
