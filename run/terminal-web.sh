#!/bin/sh
cd "$(dirname "$0")/.."
eval "$(./run/shdotenv.sh --env .env)"
eval "$(./run/shdotenv.sh --env .env.defaults)"

set -x

docker-compose exec -e LOAD_TEST_DATA=$LOAD_TEST_DATA -e TEST_DATA_URL=$TEST_DATA_URL web bash