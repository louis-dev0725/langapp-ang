#!/bin/bash
cd "$(dirname "$0")"
export $(grep -v '^#' dev.env | xargs)
cd ..

set -x

docker-compose up --build -d # Запуск docker контейнеров
docker-compose exec -w /app/backend web composer install # composer install 
docker-compose exec -w /app/backend web ./yii migrate/up --interactive 0 # Миграции
docker-compose exec -w /app/backend -e LOAD_TEST_DATA=$LOAD_TEST_DATA web ./yii migrate-data/up --interactive 0 # Миграции для данных (словарь и т.д.)
docker-compose exec -w /app/frontend web sh -c 'NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install
docker-compose exec -w /app/backend-ts web sh -c 'NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install
docker-compose exec -w /app/ web /app/run/_web-start-all.sh
docker-compose exec -w /app/ web /app/run/web-monitor-logs.sh

while true; do
    read -p 'Exited. Stop docker containers exit? (will run "docker-compose stop") (y/n) ' yn
    case $yn in
        [Yy]* ) docker-compose stop; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer y or n.";;
    esac
done