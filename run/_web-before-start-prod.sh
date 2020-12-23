#!/bin/bash
cd "$(dirname "$0")"
export $(grep -v '^#' dev.env | xargs)
cd ..

set -x

cd backend
./yii migrate/up --interactive
./yii migrate-data/up --interactive 0