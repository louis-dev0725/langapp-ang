#!/bin/bash
cd "$(dirname "$0")/.."
eval "$(./run/shdotenv.sh --env .env)"
eval "$(./run/shdotenv.sh --env .env.defaults)"
cd frontend

set -x

NG_CLI_ANALYTICS=ci npm install --no-audit
pkill -f "ng serve"
npm start