# API Documentation

## Overview

The Lab7 OAA API provides cryptographic verification and digital integrity services through a RESTful interface built with FastAPI.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API does not require authentication for public endpoints. Future versions will implement OAuth 2.0 and API key authentication.

## Endpoints

### Health Check

#### GET /health

Check the health status of the OAA service.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T10:30:00Z",
  "version": "0.1.0",
  "services": {
    "crypto": "operational",
    "ledger": "operational"
  }
}
```

### Verification

#### POST /oaa/verify

Verify a digital attestation.

**Request Body:**
```json
{
  "attestation": "eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSldTIn0...",
  "data": "base64-encoded-data",
  "timestamp": "2025-01-27T10:30:00Z"
}
```

**Response:**
```json
{
  "valid": true,
  "verified_at": "2025-01-27T10:30:00Z",
  "issuer": "oaa-lab7",
  "signature_version": "ed25519:v1",
  "integrity_score": 0.95
}
```

### Keys

#### GET /oaa/keys

Retrieve public keys for verification.

**Response:**
```json
{
  "keys": [
    {
      "kid": "oaa-lab7-2025-01-27",
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "MCowBQYDK2VwAyEA...",
      "use": "sig",
      "alg": "Ed25519"
    }
  ],
  "issuer": "oaa-lab7",
  "issued_at": "2025-01-27T10:30:00Z"
}
```

### System State

#### GET /oaa/state

Get current system state and configuration.

**Response:**
```json
{
  "version": "0.1.0",
  "environment": "production",
  "crypto_engine": "ed25519",
  "ledger_connected": true,
  "uptime": "2d 5h 30m",
  "total_verifications": 1250
}
```

## Error Handling

All errors follow the standard HTTP status codes and return JSON error responses:

```json
{
  "error": "validation_error",
  "message": "Invalid attestation format",
  "details": {
    "field": "attestation",
    "issue": "malformed_jwt"
  },
  "timestamp": "2025-01-27T10:30:00Z"
}
```

## Rate Limiting

- **Free Tier**: 100 requests per hour
- **Pro Tier**: 1000 requests per hour
- **Enterprise**: Custom limits

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests per hour
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## SDKs and Libraries

### Python
```python
from lab7_oaa import OAAClient

client = OAAClient(api_base="https://api.lab7-oaa.com")
result = client.verify_attestation(attestation_data)
```

### JavaScript/TypeScript
```typescript
import { OAAClient } from '@lab7/oaa-client';

const client = new OAAClient({ apiBase: 'https://api.lab7-oaa.com' });
const result = await client.verifyAttestation(attestationData);
```

### cURL Examples

```bash
# Health check
curl -X GET "https://api.lab7-oaa.com/health"

# Verify attestation
curl -X POST "https://api.lab7-oaa.com/oaa/verify" \
  -H "Content-Type: application/json" \
  -d '{"attestation": "eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSldTIn0..."}'

# Get public keys
curl -X GET "https://api.lab7-oaa.com/oaa/keys"
```