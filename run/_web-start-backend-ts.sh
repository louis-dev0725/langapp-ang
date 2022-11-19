#!/bin/bash
cd "$(dirname "$0")/.."
eval "$(./run/shdotenv.sh --env .env.defaults --env)"
cd backend-ts

set -x

NG_CLI_ANALYTICS=ci npm install --no-audit
pkill -f "node /app/backend-ts"
npm run start:dev