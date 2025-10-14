import json, pathlib
from jsonschema import Draft202012Validator

SCHEMA = json.loads(pathlib.Path("global-health-sentinel/schema/pulse.schema.json").read_text())

def validate(payload):
    v = Draft202012Validator(SCHEMA)
    return sorted([f"{'/'.join(map(str,e.path))}: {e.message}" for e in v.iter_errors(payload)])

def test_min_valid_payload():
    payload = {
        "timestamp": "2025-10-13T12:00:00Z",
        "regions": [{"code": "US"}],
        "signals": {
            "epidemic": [{"region": "US", "indicator": "admissions_index", "value": 0.42, "confidence": 0.8}],
            "climate_health": [{"region": "US", "indicator": "AQI", "value": 55, "confidence": 0.9}]
        },
        "summary": {"headline": "OK", "one_liner": "Stable"},
        "fingerprint_sha256": "0"*64
    }
    assert validate(payload) == []

def test_missing_required_fields():
    payload = {"timestamp": "2025-10-13T12:00:00Z"}  # incomplete
    errs = validate(payload)
    assert any("regions" in e for e in errs)
    assert any("signals" in e for e in errs)
    assert any("summary" in e for e in errs)
    assert any("fingerprint_sha256" in e for e in errs)
