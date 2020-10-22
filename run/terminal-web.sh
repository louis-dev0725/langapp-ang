#!/bin/sh
cd "$(dirname "$0")"
export $(grep -v '^#' dev.env | xargs)
cd ..

docker-compose exec -e LOAD_TEST_DATA=$LOAD_TEST_DATA web bash