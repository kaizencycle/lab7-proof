#!/usr/bin/env bash
# Configure GitHub repo variables & secrets for Lab7 PAL deploys.
# Usage:
#   ./configure_lab7.sh #     --repo kaizencycle/lab7-proof #     --api-health https://your-api.onrender.com/v1/health #     --web-health https://your-web.onrender.com/ #     --backend-service-id srv-xxxx #     --frontend-service-id srv-yyyy #     --render-api-key YOUR_RENDER_TOKEN #     [--autolabel-token YOUR_FINE_SCOPED_PAT]

set -euo pipefail

# defaults
REPO=""
API_HEALTH=""
WEB_HEALTH=""
BACKEND_SVC=""
FRONTEND_SVC=""
RENDER_KEY=""
AUTOLABEL_TOKEN=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2;;
    --api-health) API_HEALTH="$2"; shift 2;;
    --web-health) WEB_HEALTH="$2"; shift 2;;
    --backend-service-id) BACKEND_SVC="$2"; shift 2;;
    --frontend-service-id) FRONTEND_SVC="$2"; shift 2;;
    --render-api-key) RENDER_KEY="$2"; shift 2;;
    --autolabel-token) AUTOLABEL_TOKEN="$2"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if [[ -z "$REPO" || -z "$API_HEALTH" || -z "$BACKEND_SVC" || -z "$RENDER_KEY" ]]; then
  echo "Missing required args. See header usage."; exit 1
fi

echo "Setting repo variables on $REPO ..."
gh variable set LAB7_BACKEND_HEALTH_URL --repo "$REPO" --body "$API_HEALTH"
if [[ -n "$WEB_HEALTH" ]]; then
  gh variable set LAB7_FRONTEND_HEALTH_URL --repo "$REPO" --body "$WEB_HEALTH"
fi

echo "Setting repo secrets on $REPO ..."
gh secret set LAB7_RENDER_API_KEY --repo "$REPO" --body "$RENDER_KEY"
gh secret set LAB7_BACKEND_SERVICE_ID --repo "$REPO" --body "$BACKEND_SVC"
if [[ -n "$FRONTEND_SVC" ]]; then
  gh secret set LAB7_FRONTEND_SERVICE_ID --repo "$REPO" --body "$FRONTEND_SVC"
fi
if [[ -n "$AUTOLABEL_TOKEN" ]]; then
  gh secret set LAB7_AUTOLABEL_TOKEN --repo "$REPO" --body "$AUTOLABEL_TOKEN"
fi

echo "Done. Push to main and the canary deploy workflow will use these."
