#!/bin/sh
export $(grep -v '^#' run-dev.env | xargs)

docker-compose exec -e LOAD_TEST_DATA=$LOAD_TEST_DATA backend bash