#!/bin/bash
cd "$(dirname "$0")"
export $(grep -v '^#' dev.env | xargs)
cd ../backend-ts

set -x

NG_CLI_ANALYTICS=ci npm install --no-audit
pkill -f "node /app/backend-ts"
npm run start:dev