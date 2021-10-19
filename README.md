# LangApp

- [LangApp](#langapp)
- [Установка и запуск](#установка-и-запуск)
  - [Подготовка](#подготовка)
  - [Запуск](#запуск)
- [Информация о Tilt](#информация-о-tilt)
- [Ссылки и пароли](#ссылки-и-пароли)
  - [Само приложение](#само-приложение)
  - [PostgreSQL](#postgresql)
    - [Доступ к PostgreSQL:](#доступ-к-postgresql)
  - [Бэкенд на PHP (Yii2)](#бэкенд-на-php-yii2)
    - [Yii Debugger](#yii-debugger)
    - [xdebug](#xdebug)
- [Полезные команды](#полезные-команды)
- [Полезные скрипты](#полезные-скрипты)

# Установка и запуск

## Подготовка
1\) Установите [Tilt](https://docs.tilt.dev/install.html)

В Windows запустите в Powershell:
```powershell
iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.ps1'))
```
В Linux:
```bash
curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
```

2\) Установите [Docker](https://docs.docker.com/desktop/windows/install/) (если ещё не установлен).

3\) Склонируйте репозиторий любым удобным для вас способом, например в терминале:
```bash
git clone git@gitlab.com:mangoproject/langapp.git && cd langapp
```

## Запуск
1\) Запустите в терминале:
```bash
tilt up
```

2\) Нажмите пробел или откройте [http://localhost:10350/](http://localhost:10350/).\
На этой странице можно посмотреть логи, статус сборки и другую информацию. Первый запуск может занять некоторое время, дождитесь пока все ресурсы не станут зелеными.

3\) Откройте в браузере [http://localhost/app/](http://localhost/app/)\
Это само приложение.

4\) Когда захотите остановить проект, запустите
```bash
tilt down
```

Если у вас занят какой-то из портов, который используется при запуске (например 80, 443, 5432), то вы можете поменять его в `run/dev.env`.\
Если вы меняете HTTP_PORT (по умолчанию 80), то его также необходимо поменять в `frontend/src/index.html`.

# Информация о Tilt
Для каждого ресурса можно посмотреть логи, а также перезапустить его.

Ресурсы в Tilt:\
**web** - контейнер web (из docker-composer)\
**web-initial-sync** - синхронизация файлов с контейнером (при запуске, далее этим занимается сам Tilt)\
**web-frontend** - `ng serve` для Angular (внутри контейнера web)\
**web-backend-php** - выполняет `composer install` и миграции для бэкенда на PHP (Yii2, папка `backend/`) (только первый раз при запуске, далее Tilt выполняет `composer install` если composer.json изменился и показывает результат в `web`)\
**web-backend-ts** - выполняет `nest start --watch` для бэкенда на TypeScript (nestjs)\
**db** - контейнер с PostgreSQL (из docker-composer)\
**redis** - контейнер с Redis (из docker-composer)\
**adminer**, **arena**, **pgadmin** - контейнеры с adminer, arena, pgadmin (из docker-composer)\
**(Tiltfile)** - Конфигурация Tilt

# Ссылки и пароли
## Само приложение
http://localhost/app

## PostgreSQL
pgAdmin4 доступен по адресу http://localhost:5001/\
adminer доступен по адресу http://localhost:5002/?pgsql=db&username=postgres&db=postgres&ns=public

### Доступ к PostgreSQL:
Хост: 127.0.0.1\
Порт: 5432\
Логин: postgres\
Пароль: postgres\
База данных: postgres

## Бэкенд на PHP (Yii2)
### Yii Debugger
Yii Debugger доступен по адресу http://localhost/debug

### xdebug
Для активации и использования xdebug рекомендуем установить расширение https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc

Также активировать xdebug можно вручную с помощью GET параметра XDEBUG_SESSION_START, например /api/?XDEBUG_SESSION_START=1 и деактивировать с помощью GET параметра XDEBUG_SESSION_STOP, например /api/?XDEBUG_SESSION_STOP=1 подробнее https://xdebug.org/docs/remote#browser_session

# Полезные команды


```bash
# Tilt и Docker
tilt up # Запуск проекта
docker-compose stop # Остановка проекта
tilt down # Остановка проекта и удаление контейнеров
docker-compose down --volumes # Остановка и удаление docker контейнеров вместе с volumes (база данных, кеши и т.д.)

# Контейнер web (backend и frontend)
docker-compose exec web [command] # Запуск команды в контейнере web
docker-compose exec web bash # Запуск bash в контейнере web (см. также run/terminal-web.sh)

# composer install и миграции также можно запустить нажав "Trigger update" у web-backend-php в Tilt
docker-compose exec web composer install # composer install 
docker-compose exec web ./yii migrate/up --interactive 0 # Миграции
docker-compose exec web ./yii migrate-data/up --interactive 0 # Миграции для данных (словарь и т.д.)

# npm install также можно запустить нажав Trigger update" у web-frontend/web-backend-ts в Tilt
docker-compose exec -w /app/backend-ts web sh -c 'NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install для backend-ts
docker-compose exec -w /app/frontend web sh -c 'cd backend-ts && NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install для frontend

docker-compose exec -w /app/frontend web npm start -- --host 0.0.0.0 # npm start (запускает ng serve)
docker-compose exec -w /app/frontend web npm run ng -- --help # Запуск ng  
docker-compose exec -w /app/frontend web npm run ng -- build --prod # запускает ng build --prod
```

# Полезные скрипты

- `run/terminal-web.sh` открывает терминал в Docker контейнере web (доступ к консоли yii, npm и так далее)