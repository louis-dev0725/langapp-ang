#!/bin/bash
cd "$(dirname "$0")/.."
eval "$(./run/shdotenv.sh --env .env)"
eval "$(./run/shdotenv.sh --env .env.defaults)"
cd backend-ts

set -x

npm run start:prod