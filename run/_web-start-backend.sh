#!/bin/bash
cd "$(dirname "$0")/.."
eval "$(./run/shdotenv.sh --env .env)"
eval "$(./run/shdotenv.sh --env .env.defaults)"
cd backend

set -x

composer install
chmod +x ./yii
./yii migrate/up --interactive 0

env

if [ "$LOAD_TEST_DATA" == "1" ]; then
    ./yii migrate-data/up --interactive 0
fi