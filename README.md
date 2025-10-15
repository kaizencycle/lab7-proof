# 🧠 Lab7 — Open Attestation Authority (OAA)
### A Cryptographic Verification Engine for Digital Integrity  
> _"Proof of Integrity is the new Proof of Work."_

```
┌───────────────────────────────────────────┐
│ OAA CENTRAL HUB — Plan • Act • Learn • Seal │
└───────────────────────────────────────────┘
```

---
---
## 🌟 Overview

**Lab7 (OAA)** is an **Open Attestation Authority** that provides cryptographic verification and digital integrity services. It bridges **education**, **AI mentorship**, and **verifiable credentials** through secure attestation endpoints and learning dashboards.

### 🧠 OAA Central Hub

The **OAA Central Hub** serves as the central nervous system, orchestrating all labs and tools through a unified **Plan • Act • Learn • Seal** architecture:

- **🧠 Jade (Planner)** — Intelligent decision making and goal planning
- **⚡ Zeus (Executor)** — Policy-enforced tool execution with circuit breakers  
- **🛡️ Eve (Human Gate)** — Human approval and safety controls
- **📊 Hermes (I/O)** — Status monitoring and observability
- **🔒 Sealing** — Immutable audit trails and integrity verificationrds.## 🚀 Key Features

- 🔐 **Cryptographic Verification** — Ed25519 digital signatures for integrity proofs
- 🧩 **FastAPI Backend** — High-performance API for attestation services
- 🎓 **Learning Integration** — Educational tools and mentorship platforms
- 🌐 **Cloud Deployment** — Ready for Render, AWS, or other cloud providers
- 📊 **Dashboard Interface** — User-friendly verification and management tools
- 🧠 **Central Hub** — Unified orchestration of all labs and tools
- ⚡ **Circuit Breakers** — Automatic failure protection and recovery
- 🛡️ **Policy Enforcement** — Security controls and access management
- 📈 **Observability** — Real-time monitoring and performance trackingent tools

<!-- PAL BADGES START -->
![PAL Rollout](docs/badges/pal_rollout.svg) ![PAL Safety](docs/badges/pal_safety.svg)
<!-- PAL BADGES END -->

<!-- PAL DASHBOARD START -->

_This section will be auto-populated by the dashboard workflow._

<!-- PAL DASHBOAR## 🏗️ Architecture

OAA is built with modern, secure technologies:

- 🧩 **FastAPI Backend** — High-performance Python API for attestation services
- ⚙️ **Ed25519 Cryptography** — Secure digital signatures using public/private key pairs
- 🧭 **Next.js Frontend** — Modern React-based dashboard and verification interface
- 🔗 **Cloud-Ready** — Designed for easy deployment on Render, AWS, or other platforms
- 🧠 **Extensible Design** — Modular architecture for custom integrations
- 🎯 **Central Hub** — TypeScript-based orchestration layer with Express.js
- 🔄 **Circuit Breakers** — Automatic failure detection and service protection
- 📊 **Observability** — Comprehensive monitoring and logging systemcustom integrations  

---

## 🏛️ System Architecture

```plaintext
             ┌─────────────────────┐
             │  Frontend (UI)      │
             │  Next.js / React    │
             │  → /verify          │
             │  → /keys            │
             │  → /dashboard       │
             └─────────┬───────────┘
                       │
                       ▼
             ┌─────────────────────┐
             │  OAA API (FastAPI)  │
             │  /oaa/verify        │
             │  /oaa/keys          │
             │  /oaa/state         │
             │  /health            │
             └─────────┬───────────┘
                       │
                       ▼
             ┌─────────────────────┐
             │  Crypto Engine      │
             │  Ed25519, SHA-256   │
             │  + Nonce Defense    │
             └─────────┬───────────┘
                       │
                       ▼
             ┌─────────────────────┐
             │  External Ledger    │
             │  (Optional)         │
             │  Immutable Storage  │
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

Copy `env.example` to `.env` and configure:

| **Variable** | **Description** | **Example** |
|--------------|-----------------|-------------|
| OAA_ED25519_PUBLIC_B64 | Base64 public key | MCowBQYDK2VwAyEA... |
| OAA_ISSUER | Issuer name | oaa-lab7 |
| OAA_SIGNING_VERSION | Version | ed25519:v1 |
| OAA_SIGNING_CREATED | Timestamp | 2025-10-12T00:00:00Z |
| OAA_VERIFY_TS_WINDOW_MIN | Allowed timestamp drift | 10 |
| LEDGER_URL | External ledger endpoint | https://your-ledger-url.onrender.com |

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
| Environment Variables | NEXT_PUBLIC_OAA_API_BASE=https://your-api-url.onrender.com |

---

## 🪄 One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Environment variables:

| Name | Description | Example |
|------|--------------|----------|
| `NEXT_PUBLIC_OAA_API_BASE` | URL of your OAA backend | `https://your-api-url.onrender.com` |

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

## 🎯 Use Cases

**OAA (Lab7)** is perfect for:  
- **Educational Platforms** — Verify student achievements and credentials
- **AI Systems** — Provide cryptographic proof for AI-generated content
- **Digital Identity** — Create verifiable digital identities and attestations
- **Content Verification** — Ensure integrity of digital documents and data
- **Learning Management** — Track and verify educational progress

## 🔧 API Endpoints

| **Endpoint** | **Method** | **Description** |
|--------------|------------|-----------------|
| `/health` | GET | Health check and service status |
| `/oaa/verify` | POST | Verify digital attestations |
| `/oaa/keys` | GET | Retrieve public keys for verification |
| `/oaa/state` | GET | Get current system state |
| `/.well-known/oaa-keys.json` | GET | Public key discovery endpoint |

---

## 🔄 Data Flow

```
                ┌─────────────────────────────────────────────────┐
                │                Users & Devices                  │
                │   (web, mobile, CLI, API clients)              │
                └───────────────┬─────────────────────────────────┘
                                │
                     (HTTPS JSON / WebSocket)
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                          Frontend (Next.js)                         │
 │  Pages: /verify  /keys  /dashboard  /api/*                         │
 │  Env: NEXT_PUBLIC_OAA_API_BASE                                     │
 └───────────────┬─────────────────────────────────────────────────────┘
                 │
                 │ fetch()
                 │
                 ▼
    ┌────────────────────────┐
    │  Lab7 (OAA, this repo) │
    │  FastAPI               │
    │  https://…/lab7        │
    └─────────┬──────────────┘
              │
              │  attestation/verify
              │  /oaa/verify
              │  /oaa/keys
              │  /.well-known/oaa-keys.json
              │
              ▼
    ┌────────────────────────────────┐
    │  Crypto Engine (Ed25519, SHA) │
    │  Environment Variables:        │
    │   OAA_ED25519_PRIVATE_B64     │
    │   OAA_ED25519_PUBLIC_B64      │
    │   OAA_SIGNING_VERSION         │
    └───────────────┬───────────────┘
                    │
                    │ optional anti-replay
                    ▼
     ┌──────────────────────────────┐
     │ Redis (nonce store)          │
     │ OAA_NONCE_REDIS_URL          │
     └───────────────┬──────────────┘
                     │
                     │ (if enabled)
                     ▼
     ┌──────────────────────────────┐
     │ External Ledger (optional)   │
     │ https://…/ledger             │
     │  /ledger/attest              │
     │  /ledger/verify              │
     └───────────────┬──────────────┘
                     │
         anchor hash / receipt
                     │
                     └──────────────────→
                        Attestation receipt (JWS + ledger tx)
```

**How it works:**

1. **Users** interact with the frontend dashboard
2. **Frontend** calls the OAA API for verification services
3. **OAA API** processes requests using cryptographic engine
4. **Crypto Engine** signs/verifies using Ed25519 keys
5. **Optional Ledger** provides immutable storage for audit trails

---

## 📄 License

**MIT License**  
This project is open source and available under the MIT License.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📞 Support

For questions and support, please open an issue on GitHub.

---

## ✨ Acknowledgments

Built with ❤️ for the open source community.


