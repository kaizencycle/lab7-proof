#!/usr/bin/env bash
set -euo pipefail
branch="${1:-pal/integration}"
git checkout -b "$branch"
git add .
git commit -m "feat(pal): integrate PAL API, trainers, CI, Render deploy, Zeus rollout"
echo "Created branch $branch with PAL integration changes."
