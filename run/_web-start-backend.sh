#!/bin/bash
cd "$(dirname "$0")/.."
eval "$(./run/shdotenv.sh --env .env --env .env.defaults)"
cd backend

set -x

composer install
chmod +x ./yii
./yii migrate/up --interactive 0
./yii migrate-data/up --interactive 0