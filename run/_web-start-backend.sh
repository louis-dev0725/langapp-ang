#!/bin/bash
cd "$(dirname "$0")/.."
eval "$(./run/shdotenv.sh --env .env.defaults --env)"
cd backend

set -x

composer install
chmod +x ./yii
./yii migrate/up --interactive 0
./yii migrate-data/up --interactive 0