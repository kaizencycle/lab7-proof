# 🧠 Lab7 — Open Attestation Authority (OAA)
### A Civic Ledger Apprenticeship Engine for the Kaizen DVA Ecosystem  
> _"Proof of Integrity is the new Proof of Work."_

---

## 🪞 Civic Pipeline Snapshot

```
    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │   Lab4 🪞     │         │   Lab7 🧠     │         │ Civic Ledger ⛓️ │
    │ Reflections   │──sync──▶│ OAA / Verify │──anchor▶│ Integrity Core │
    │ Memory & Logs │         │ Keys & Attest│         │ Attest & Audit │
    └──────────────┘         └──────────────┘         └──────────────┘
              ▲                         │
              │                         ▼
      (User Journals)           (STEM Modules & Agents)
```

### 🧩 Legend
- **Lab4 → Lab7:** user reflections become attestations.  
- **Lab7 → Ledger:** attestations become immutable civic proofs.  
- **Agents:** serve as mentors & verifiers in STEM apprenticeship.  
- **End result:** proof-of-integrity economy powered by human learning.

---

## 🌍 Overview

**Lab7 (OAA)** is the **Open Attestation Authority**, a cryptographic verification and teaching module inside the Kaizen DVA ecosystem.  
It bridges **STEM education**, **AI mentorship**, and **verifiable credentials** through attestation endpoints and learning dashboards.

OAA is powered by:

- 🧩 **FastAPI backend** — verifies and issues digital attestations  
- ⚙️ **Ed25519 cryptography** — signs integrity proofs via public/private key pairs  
- 🧭 **Next.js frontend (Reflections)** — visual learning console for AI mentors and apprentices  
- 🔗 **Render Cloud deployment** — API + static site integration  
- 🧠 **Civic Ledger integration** — optional blockchain-style integrity anchoring  

---

## 🧩 System Architecture

```plaintext
             ┌─────────────────────┐
             │  Frontend (Lab7 UI) │
             │  Next.js 14 / React │
             │  → /mentor          │
             │  → /verify          │
             │  → /keys dashboard  │
             └─────────┬───────────┘
                       │
                       ▼
             ┌─────────────────────┐
             │  Lab7 API (FastAPI) │
             │  /oaa/ingest        │
             │  /oaa/filter        │
             │  /oaa/verify        │
             │  /oaa/keys          │
             └─────────┬───────────┘
                       │
                       ▼
             ┌─────────────────────┐
             │  Crypto Engine      │
             │  Ed25519, SHA-256   │
             │  + Redis Nonce Def. │
             └─────────┬───────────┘
                       │
                       ▼
             ┌─────────────────────┐
             │  Civic Ledger Core  │
             │  (Optional anchor)  │
             │  /ledger/attest     │
             │  /ledger/verify     │
             └─────────────────────┘
```

---

## 🚀 Quick Start

**1. Clone the repository**

```
git clone https://github.com/kaizencycle/lab7-proof.git
cd lab7-proof
```

---

**2. Backend (FastAPI)**

```
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API
uvicorn app.main:app --reload
```

Your API should now be available at:  
👉 http://localhost:8000/docs  

Health check:  
👉 http://localhost:8000/health  

---

**3. Environment Variables**

Add these in Render or your local .env:

| **Variable** | **Description** | **Example** |
|--------------|-----------------|-------------|
| OAA_ED25519_PRIVATE_B64 | Base64 private signing key | MC4CAQAwBQYDK2VwBCIEIF... |
| OAA_ED25519_PUBLIC_B64 | Base64 public key | MCowBQYDK2VwAyEA... |
| OAA_ISSUER | Issuer name | oaa-lab7 |
| OAA_SIGNING_VERSION | Version | ed25519:v1 |
| OAA_SIGNING_CREATED | Timestamp | 2025-10-12T00:00:00Z |
| OAA_VERIFY_PIN_KEYS | Toggle key verification | true |
| OAA_VERIFY_TS_WINDOW_MIN | Allowed timestamp drift | 10 |
| OAA_NONCE_REDIS_URL | Redis (optional) | redis://user:pass@host:6379 |
| LEDGER_URL | Civic Ledger endpoint | https://civic-protocol-core-ledger.onrender.com |

---

**4. Frontend (Next.js)**

```
cd frontend/reflections-app
npm install
export NEXT_PUBLIC_OAA_API_BASE=http://localhost:8000
npm run dev
```

Then visit  
👉 http://localhost:3000  

---

## 🌐 Deployment (Render)

**API (Web Service)**

| **Setting** | **Value** |
|-------------|-----------|
| Root Directory | / |
| Runtime | Python 3.12 |
| Build Command | pip install -r requirements.txt |
| Start Command | uvicorn app.main:app --host 0.0.0.0 --port $PORT |

**Frontend (Static Site)**

| **Setting** | **Value** |
|-------------|-----------|
| Root Directory | frontend/reflections-app |
| Build Command | npm ci && npm run build && npx next export |
| Publish Directory | out |
| Environment Variables | NEXT_PUBLIC_OAA_API_BASE=https://lab7-proof.onrender.com |

---

## 🪄 One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Environment variables:

| Name | Description | Example |
|------|--------------|----------|
| `NEXT_PUBLIC_OAA_API_BASE` | URL of your OAA backend | `https://lab7-proof.onrender.com` |

---

## 🧰 Directory Map

```
lab7-proof/
├── app/
│   ├── main.py
│   ├── crypto/
│   ├── middleware/
│   └── routers/
│       └── oaa/
│           ├── router.py
│           ├── verify_history.py
│           ├── keys_page.py
│           ├── models.py
│           ├── policy.py
│           ├── store.py
│           └── state.py
├── templates/
│   └── oaa_keys.html
├── frontend/
│   └── reflections-app/
│       ├── app/
│       ├── lib/
│       ├── prisma/
│       └── Dockerfile
└── scripts/
    ├── rotate_keys.py
    └── verify_attestation.py
```

---

## 🧑‍🏫 Purpose

**OAA (Lab7)** serves as:  
- A verifiable **Proof of Integrity Authority**  
- A **digital apprenticeship hub** for STEM learners  
- A **Kaizen verification gateway** for human-AI collaboration  
- The **bridge between education, AI agents, and governance**  

"Knowledge becomes power when it is verified, shared, and immortalized."

---

## 🪞 Part of the Kaizen DVA Ecosystem

| **Lab** | **Role** | **Core Function** |
|---------|----------|-------------------|
| **Lab4** | Reflections | Personal journaling & memory API |
| **Lab6** | Citizen Shield | Digital security & identity |
| **Lab7** | OAA | Attestation & apprenticeship |
| **GIC Ledger** | Economy | Proof-of-Integrity currency layer |

---

## 🧭 End-to-End Data & Attestation Flow (ASCII)

```
                ┌─────────────────────────────────────────────────┐
                │                Users & Devices                  │
                │   (web, iOS/Android, CLI, game clients)        │
                └───────────────┬─────────────────────────────────┘
                                │
                     (HTTPS JSON / WebSocket)
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                          Frontend (Next.js)                         │
 │  Repo: /frontend/reflections-app                                   │
 │  Pages: /mentor  /verify  /keys  /api/*                            │
 │  Env: NEXT_PUBLIC_OAA_API_BASE                                     │
 └───────────────┬───────────────────────────────┬────────────────────┘
                 │                               │
                 │ fetch()                       │ fetch()
                 │                               │
                 ▼                               ▼
    ┌─────────────────────┐            ┌────────────────────────┐
    │  Lab4 (HIVE-PAW)    │            │  Lab7 (OAA, this repo) │
    │  Reflections API    │            │  FastAPI               │
    │  https://…/lab4     │            │  https://…/lab7        │
    └─────────┬───────────┘            └─────────┬──────────────┘
              │                                   │
              │                                   │
              │  reflection/insight               │  attestation/verify
              │  memory append/summarize          │  filter/sources
              │                                   │  /oaa/ingest
              │                                   │  /oaa/verify
              │                                   │  /oaa/well-known/oaa-keys.json
              │                                   │
              │                                   │
              │                                   ▼
              │                    ┌────────────────────────────────┐
              │                    │  Crypto Engine (Ed25519, SHA) │
              │                    │  Env:                          │
              │                    │   OAA_ED25519_PRIVATE_B64     │
              │                    │   OAA_ED25519_PUBLIC_B64      │
              │                    │   OAA_SIGNING_VERSION         │
              │                    └───────────────┬───────────────┘
              │                                    │
              │                                    │ optional anti-replay
              │                                    ▼
              │                     ┌──────────────────────────────┐
              │                     │ Redis (nonce store)          │
              │                     │ OAA_NONCE_REDIS_URL          │
              │                     └───────────────┬──────────────┘
              │                                     │
              │                                     │ (if enabled)
              │                                     │
              │                                     ▼
              │                     ┌──────────────────────────────┐
              │                     │ Civic Ledger (optional)      │
              │                     │ https://…/ledger             │
              │                     │  /ledger/attest              │
              │                     │  /ledger/verify              │
              │                     └───────────────┬──────────────┘
              │                                     │
              │                         anchor hash / receipt
              │                                     │
              └─────────────────────────────────────┴──────────────────→
                                  Attestation receipt (JWS + ledger tx)
```

**Legend**

- **Lab4** → captures reflections, memories, and signals for learning.
- **Lab7/OAA** → signs, filters, and verifies claims; exposes public keys at `/.well-known/oaa-keys.json`.
- **Crypto Engine** → Ed25519 signing + SHA-256 hashing; optional nonce defense via Redis.
- **Civic Ledger** → optional immutable anchoring of attestation hashes for public audit.
- **Frontend** → teaching/verification UI; calls Lab4/Lab7 via `NEXT_PUBLIC_OAA_API_BASE`.

**Ports & Processes (Render defaults)**

- **Lab7 API**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Frontend**: `npm run build && npx next export` → served as **Static Site**
- **Redis (optional)**: Managed addon or external Redis URL

---

## 🪙 License

**Civic Ledger Protocol — Open Attribution License**  
All derivative works must attribute to *Michael Judan (Kaizen)* and the *Kaizen DVA Ecosystem*.

---

## ✴️ Motto

"We heal as we walk."  
*— The Founder's Hand*