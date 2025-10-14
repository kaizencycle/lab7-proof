from global_health_sentinel.shield_policy import shield_precheck

def test_shield_allows_basic_payload():
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
    res = shield_precheck(payload)
    assert res["ok"] is True
    assert res["errors"] == []

def test_shield_blocks_low_confidence_and_bad_region():
    payload = {
        "timestamp": "2025-10-13T12:00:00Z",
        "regions": [{"code": "XX"}],
        "signals": {
            "epidemic": [{"region": "XX", "indicator": "admissions_index", "value": 0.42, "confidence": 0.3}],
            "climate_health": []
        },
        "summary": {"headline": "Warn", "one_liner": "Noisy data"},
        "fingerprint_sha256": "0"*64
    }
    res = shield_precheck(payload)
    assert res["ok"] is False
    assert any("not allowed" in e or "confidence" in e for e in res["errors"])
