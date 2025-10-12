# Lab7-Proof — Open Attestation Authority (OAA)

> "Integrity is the proof that outlives its creator." — *Kaizen_Michael*

[![CI](https://github.com/kaizencycle/lab7-proof/actions/workflows/ci.yml/badge.svg)](https://github.com/kaizencycle/lab7-proof/actions/workflows/ci.yml)

## 🌐 Overview

**Lab7-Proof** is the verification engine of the Kaizen DVA / HIVE ecosystem. It anchors every signed act — reflections, governance votes, civic contributions — to a cryptographically verifiable attestation chain.

Built as both:
- **An API** (`/oaa`) for machines, and
- **A Public Site** for citizens and developers to verify attestations.

## 🧭 Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │                 Users / Apps                 │
                    │──────────────────────────────────────────────│
                    │  Reflections App │ Citizen Shield │ OAA SDK  │
                    └──────────────┬───────────────────────────────┘
                                   │
                                   ▼
                      ┌────────────────────────┐
                      │      Lab7-Proof API    │
                      │ (FastAPI / Render)     │
                      ├────────────────────────┤
                      │ • /oaa/state/anchor    │ → sign attestation
                      │ • /oaa/verify          │ → check validity
                      │ • /.well-known/oaa-keys│ → key registry (Ed25519)
                      └──────────────┬─────────┘
                                     │
                     attestations.json│
                                     ▼
                      ┌────────────────────────┐
                      │  GitHub Pages Site     │
                      │ (kaizencycle.github.io)│
                      ├────────────────────────┤
                      │  verify.html           │ → paste attestation
                      │  oaa-verify.js         │ → browser verifier
                      │  README + docs         │
                      └──────────────┬─────────┘
                                     │
                   ┌─────────────────┴──────────────────┐
                   │                                    │
          ┌────────────────────┐              ┌────────────────────┐
          │ CLI  oaa-verify    │              │ Node/TS SDK        │
          │ (npm or Release)   │              │ (import verifier)  │
          └────────────────────┘              └────────────────────┘
```

## 🧩 Components

| Component | Type | Description |
|-----------|------|-------------|
| **Lab7-Proof API** | FastAPI service | Anchors & signs attestations |
| **Public Verifier Site** | GitHub Pages | Browser-based attestation verifier |
| **OAA-Verify CLI** | Node JS CLI | Offline or CI-based verification tool |
| **Node/TS SDK** | npm library | Importable verifier for partner projects |

## 🚀 Quickstart

### 1️⃣ Verify via Browser

➡ **[Live Verifier](https://kaizencycle.github.io/lab7-proof/verify.html)**

Paste any attestation JSON → click **Verify** → shows VALID ✅ or INVALID ❌.

### 2️⃣ Verify via CLI

```bash
curl -O https://github.com/kaizencycle/lab7-proof/releases/latest/download/oaa-verify.js
chmod +x oaa-verify.js
./oaa-verify.js attestation.json --keyset https://hive-api-2le8.onrender.com
```

### 3️⃣ Verify via Node SDK

```bash
npm install tweetnacl undici
```

```typescript
import { verifyAttestation, signerIsKnown } from "@gic/oaa-verify";
```

## 🔑 Key Registry

All public keys for Lab7-Proof signing are available at:

https://hive-api-2le8.onrender.com/.well-known/oaa-keys.json

## 🔏 Verifying OAA Attestations

This repo publishes signed attestations (Ed25519) and a well-known keyset. Partners can verify three ways:

### 1) Web Verifier (no install)

Open our hosted page and paste the attestation JSON.
- **URL:** https://kaizencycle.github.io/lab7-proof/verify.html
- **Steps:**
  1. Paste the attestation returned by `/oaa/repute/vote` or `/oaa/state/anchor`.
  2. (Recommended) Enter the OAA base URL and enable **Key Pinning** (it fetches `/.well-known/oaa-keys.json`).
  3. Keep **Timestamp window** on (default ±10 min).
  4. Click **Verify** → you'll see VALID/INVALID and details.
  5. Use **Copy Result** to share the verification proof.

### 2) CLI (single script)

Download the release artifact (`oaa-verify.js`) from the **Releases** page, make it executable, and run:

```bash
./oaa-verify.js attestation.json \
  --keyset https://your-lab7-api.onrender.com
```

**Output**

```
VALID: { recomputed_hash: "...", ... }
```

or

```
INVALID: { reason: "hash_mismatch" | "signature_invalid" | "unknown_signing_key" | ... }
```

### 3) Node / TypeScript module

Install deps and use the verifier helpers.

```bash
npm i tweetnacl undici
```

```typescript
// oaa-verify.ts (example)
import nacl from "tweetnacl";
import { createHash } from "crypto";

function sortKeys(x:any){ 
  if(Array.isArray(x)) return x.map(sortKeys);
  if(x && typeof x==="object"){ 
    const o:Record<string,any>={};
    for(const k of Object.keys(x).sort()) o[k]=sortKeys(x[k]); 
    return o; 
  }
  return x; 
}

const canonicalJSON = (obj:any)=> JSON.stringify(sortKeys(obj));
const sha256Hex = (s:string)=> createHash("sha256").update(s,"utf8").digest("hex");
const b64 = (s:string)=> new Uint8Array(Buffer.from(s,"base64"));

export function verifyAttestation(att:any){
  const canon = canonicalJSON(att.content);
  const recomputed = sha256Hex(canon);
  const got = (att.content_hash||"").replace(/^sha256:/,"");
  if(got !== recomputed) return { ok:false, reason:"hash_mismatch", recomputed_hash:recomputed };

  if(!att.signature?.startsWith("ed25519:")) return { ok:false, reason:"bad_sig_format" };
  const sig = b64(att.signature.slice(8));
  const pub = b64(att.public_key_b64);
  const ok = nacl.sign.detached.verify(Buffer.from(canon,"utf8"), sig, pub);
  return ok ? { ok:true, recomputed_hash:recomputed } : { ok:false, reason:"signature_invalid" };
}

// Optional: key pinning via well-known keyset
export async function signerIsKnown(baseUrl:string, pubKeyB64:string){
  const res = await fetch(`${baseUrl.replace(/\/$/,"")}/.well-known/oaa-keys.json`);
  if(!res.ok) throw new Error(`Keyset fetch failed: ${res.status}`);
  const ks = await res.json();
  const allowed = new Set((ks.keys||[]).map((k:any)=>k.x));
  return allowed.has(pubKeyB64);
}
```

**Usage**

```typescript
const okKey = await signerIsKnown("https://your-lab7-api.onrender.com", att.public_key_b64);
if(!okKey) throw new Error("unknown_signing_key");
const result = verifyAttestation(att);
console.log(result);
```

## 🧱 Governance Context

**Lab7-Proof** belongs to the broader *Civic Intelligence Stack*:

| Layer | Description |
|-------|-------------|
| Lab4-Proof | Reflections (personal diary + journaling memory) |
| Lab6-Proof | Citizen Shield (digital security & consent) |
| **Lab7-Proof** | **Open Attestation Authority (OAA)** – proof of integrity |
| Civic Ledger | Immutable chain of civic actions (GIC mint/burn events) |

## 🔁 Integrity Loop

1. **Event happens** → Reflection / Ledger entry → API generates attestation.
2. **Attestation signed** → stored in Ledger and mirrored to GitHub Pages.
3. **Citizen / Dev / Auditor** → verifies signature through site or CLI.
4. **Consensus** → Civic Commons Wallet rewards verified integrity.

## ✅ Security Checklist (recommended)

- **Key pinning:** Always confirm `public_key_b64` appears in our `/.well-known/oaa-keys.json` (or use a pinned value in your config).
- **Canonical JSON:** Verify against a stable, sorted-key JSON string before checking the signature.
- **Timestamp window:** Reject if `content.ts` is too far from now (e.g., ±10 minutes) to reduce replay risk.
- **Nonce replay:** For state-changing endpoints, include nonce + voter_id in the content and enforce single use (server side we use Redis SETNX + TTL).
- **Key rotation:** We keep previous public keys in the keyset as legacy during rotations; pin to **kid/version** where possible.

## 🧪 Test Endpoints

- `GET /oaa/state/snapshot` – deterministic snapshot & content hash
- `POST /oaa/state/anchor` – returns signed attestation (+ optional ledger receipt)
- `POST /oaa/verify` – server-side verification (hash, signature, key pinning, ts, nonce)

All endpoints are on the Lab7 API base:

https://hive-api-2le8.onrender.com

## 🧮 Roadmap

- Integrate with GIC mint/burn attestations
- Add federation of keys across all Lab APIs
- Add AI companion attestations (Jade, Eve, Zeus, etc.)
- Publish npm SDK (`@gic/oaa-verify`)
- Deploy global verifier mirror on verify.gic.ai

## 🛠️ Development

### Prerequisites

- Python 3.11+
- Redis (optional, for nonce replay defense)

### Setup

```bash
# Clone the repository
git clone https://github.com/kaizencycle/lab7-proof.git
cd lab7-proof

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install development tools
pip install black ruff mypy pytest detect-secrets pre-commit

# Install pre-commit hooks
pre-commit install
pre-commit install --hook-type pre-push
```

### Running the API

```bash
# Development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use Cursor tasks
# Command Palette → "Run Task" → "Start API (dev)"
```

### Code Quality

```bash
# Format code
black .

# Lint
ruff check .

# Type check
mypy app

# Run tests
pytest

# All checks
black . && ruff check . && mypy app && pytest
```

## 📄 License

This project is part of the Kaizen DVA ecosystem and follows the Civic Protocol Core licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions and support, please open an issue in this repository or contact the Kaizen DVA team.