#!/bin/bash
cd "$(dirname "$0")/.."
eval "$(./run/shdotenv.sh --env .env)"
eval "$(./run/shdotenv.sh --env .env.defaults)"

set -x

cd backend
./yii migrate/up --interactive
./yii migrate-data/up --interactive 0