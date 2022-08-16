#!/bin/sh
cd "$(dirname "$0")"
export $(grep -v '^#' dev.env | xargs)
cd ..

set -x

docker-compose exec -e LOAD_TEST_DATA=$LOAD_TEST_DATA -e TEST_DATA_URL=$TEST_DATA_URL web bash