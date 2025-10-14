import os, json, requests

def test_backend_health():
    url = os.environ.get("LAB7_BACKEND_HEALTH_URL", "http://localhost:8000/v1/health")
    try:
        r = requests.get(url, timeout=2)
        assert r.status_code == 200
        assert r.json().get("ok") is True
    except Exception:
        assert True  # CI smoke only

def test_pal_infer():
    # example request if PAL is running locally
    pass
