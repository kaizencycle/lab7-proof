# Deployment Guide

## Overview

This guide covers deploying Lab7 OAA to various cloud platforms and environments.

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional)
- Cloud provider account (Render, AWS, etc.)

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OAA_ED25519_PRIVATE_B64` | Base64 encoded private key | `MCowBQYDK2VwAyEA...` |
| `OAA_ED25519_PUBLIC_B64` | Base64 encoded public key | `MCowBQYDK2VwAyEA...` |
| `OAA_ISSUER` | Issuer name | `oaa-lab7` |
| `OAA_SIGNING_VERSION` | Signing version | `ed25519:v1` |
| `OAA_SIGNING_CREATED` | Creation timestamp | `2025-01-27T00:00:00Z` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OAA_VERIFY_TS_WINDOW_MIN` | Timestamp drift tolerance (minutes) | `10` |
| `LEDGER_URL` | External ledger endpoint | `None` |
| `REDIS_URL` | Redis connection string | `None` |
| `LOG_LEVEL` | Logging level | `INFO` |

## Local Development

### Backend

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OAA_ED25519_PRIVATE_B64="your-private-key"
export OAA_ED25519_PUBLIC_B64="your-public-key"
export OAA_ISSUER="oaa-lab7"

# Run the application
uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend/reflections-app

# Install dependencies
npm install

# Set environment variables
export NEXT_PUBLIC_OAA_API_BASE="http://localhost:8000"

# Run the development server
npm run dev
```

## Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Manual Docker Build

```bash
# Build backend image
docker build -f docker/backend.Dockerfile -t lab7-oaa-backend .

# Build frontend image
docker build -f docker/frontend.Dockerfile -t lab7-oaa-frontend .

# Run backend
docker run -p 8000:8000 \
  -e OAA_ED25519_PRIVATE_B64="your-key" \
  -e OAA_ED25519_PUBLIC_B64="your-key" \
  lab7-oaa-backend

# Run frontend
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_OAA_API_BASE="http://localhost:8000" \
  lab7-oaa-frontend
```

## Cloud Deployment

### Render

#### Backend (Web Service)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure the following settings:

| Setting | Value |
|---------|-------|
| Root Directory | `/` |
| Runtime | Python 3.12 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn src.app.main:app --host 0.0.0.0 --port $PORT` |

4. Add environment variables in the Render dashboard
5. Deploy

#### Frontend (Static Site)

1. Create a new Static Site
2. Configure the following settings:

| Setting | Value |
|---------|-------|
| Root Directory | `frontend/reflections-app` |
| Build Command | `npm ci && npm run build && npx next export` |
| Publish Directory | `out` |

3. Add environment variables
4. Deploy

### AWS (ECS)

#### Backend

```yaml
# task-definition.json
{
  "family": "lab7-oaa-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/lab7-oaa-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "OAA_ISSUER",
          "value": "oaa-lab7"
        }
      ],
      "secrets": [
        {
          "name": "OAA_ED25519_PRIVATE_B64",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:oaa-keys"
        }
      ]
    }
  ]
}
```

### Google Cloud Platform

#### Backend (Cloud Run)

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/lab7-oaa-backend', '-f', 'docker/backend.Dockerfile', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/lab7-oaa-backend']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: [
      'run', 'deploy', 'lab7-oaa-backend',
      '--image', 'gcr.io/$PROJECT_ID/lab7-oaa-backend',
      '--platform', 'managed',
      '--region', 'us-central1',
      '--allow-unauthenticated'
    ]
```

## Production Considerations

### Security

1. **Key Management**: Store private keys in secure secret management systems
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Validate all inputs thoroughly
5. **Logging**: Implement comprehensive logging and monitoring

### Performance

1. **Caching**: Implement Redis caching for frequently accessed data
2. **CDN**: Use a CDN for static assets
3. **Load Balancing**: Use load balancers for high availability
4. **Database**: Consider using a managed database service

### Monitoring

1. **Health Checks**: Implement health check endpoints
2. **Metrics**: Collect application metrics
3. **Logging**: Centralized logging with structured logs
4. **Alerting**: Set up alerts for critical issues

## Troubleshooting

### Common Issues

1. **Key Generation**: Ensure Ed25519 keys are properly generated and encoded
2. **Environment Variables**: Verify all required environment variables are set
3. **Port Conflicts**: Check that ports 8000 and 3000 are available
4. **CORS Issues**: Configure CORS properly for cross-origin requests

### Debug Mode

Enable debug mode for development:

```bash
export LOG_LEVEL=DEBUG
export DEBUG=true
```

### Logs

Check application logs:

```bash
# Docker logs
docker logs lab7-oaa-backend

# Render logs
# Check in Render dashboard under "Logs" tab

# AWS CloudWatch
# Check CloudWatch logs for your ECS service
```

## Backup and Recovery

1. **Database Backups**: Regular automated backups
2. **Key Backup**: Secure backup of cryptographic keys
3. **Configuration Backup**: Version control for configuration files
4. **Disaster Recovery**: Documented recovery procedures