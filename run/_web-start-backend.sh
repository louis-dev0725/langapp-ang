#!/bin/bash
cd "$(dirname "$0")"
export $(grep -v '^#' dev.env | xargs)
cd ../backend

set -x

composer install
chmod +x ./yii
./yii migrate/up --interactive 0
./yii migrate-data/up --interactive 0