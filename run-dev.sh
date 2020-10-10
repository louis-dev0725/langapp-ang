#!/bin/sh
export $(grep -v '^#' run-dev.env | xargs)

docker-compose up --build -d # Запуск docker контейнеров
docker-compose exec backend composer install # composer install 
docker-compose exec backend ./yii migrate/up --interactive 0 # Миграции
docker-compose exec backend ./yii migrate-data/up --interactive 0 # Миграции для данных (словарь и т.д.)
docker-compose exec frontend sh -c 'NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install
docker-compose exec frontend npm start -- --host 0.0.0.0 # npm start (запускает ng serve)

while true; do
    read -p 'Exited. Stop docker compose before exit? (will run "docker-compose stop") (y/n) ' yn
    case $yn in
        [Yy]* ) docker-compose stop; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer y or n.";;
    esac
done