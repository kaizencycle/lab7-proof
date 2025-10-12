# app/routers/oaa/keys.py
import base64, os, time
from typing import List, Dict

def _kid_from_pub(b64_pub: str) -> str:
    # short key ID based on first 8 bytes
    raw = base64.b64decode(b64_pub)
    return "oaa-" + base64.urlsafe_b64encode(raw[:8]).decode("ascii").rstrip("=")

def current_key_entry() -> Dict:
    pub_b64 = os.getenv("OAA_ED25519_PUBLIC_B64", "")
    ver = os.getenv("OAA_SIGNING_VERSION", "oaa:ed25519:v1")
    if not pub_b64:
        return {}
    return {
        "kid": _kid_from_pub(pub_b64),
        "kty": "OKP",
        "crv": "Ed25519",
        "x": pub_b64,                 # base64 raw key (no PEM)
        "alg": "EdDSA",
        "use": "sig",
        "version": ver,
        "created": os.getenv("OAA_SIGNING_CREATED",""),
    }

def legacy_keys() -> List[Dict]:
    # comma-separated older public keys in env (optional)
    # OAA_ED25519_PUBLIC_B64_LEGACY="b64pub1|oaa:ed25519:v0, b64pub2|oaa:ed25519:v0.9"
    legacy = os.getenv("OAA_ED25519_PUBLIC_B64_LEGACY","").strip()
    out = []
    if not legacy:
        return out
    for item in legacy.split(","):
        item = item.strip()
        if not item:
            continue
        if "|" in item:
            pub, ver = item.split("|",1)
        else:
            pub, ver = item, "oaa:ed25519:legacy"
        out.append({
            "kid": _kid_from_pub(pub),
            "kty": "OKP",
            "crv": "Ed25519",
            "x": pub,
            "alg": "EdDSA",
            "use": "sig",
            "version": ver,
        })
    return out

def keyset() -> Dict:
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    cur = current_key_entry()
    keys = ([cur] if cur else []) + legacy_keys()
    return {
        "issuer": os.getenv("OAA_ISSUER","oaa.lab7"),
        "updated": now,
        "keys": keys
    }
