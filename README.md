# Установка

## Windows

1. [Установите Docker](https://docs.docker.com/get-docker/) если ещё не стоит.
2. Запустите PowerShell и запустите `wsl`. Проект будем запускать и хранить внутри WSL.
3. (внутри WSL) `cd ~`
4. (внутри WSL) `git clone git@gitlab.com:mangoproject/langapp.git`
5. (внутри WSL) `cd langapp`
6. (внутри WSL) `./run/start-dev.sh`
7. Дождитесь сообщения `ℹ ｢wdm｣: Compiled successfully.`
8. Откройте в браузере http://localhost/

### Зачем хранить проект внутри WSL?
Чтобы не было [проблем](https://github.com/microsoft/WSL/issues/4197) с производительностью, рекомендуем хранить и запускать проект внутри WSL.

Для редактирования кода, который находится внутри WSL можно использовать [расширение для VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) или сделать симлинк.

Для создания симлинка запустите `cmd` от Администратора, а затем выполните `mklink /D C:\wsl-projects\ \\wsl$\Ubuntu\root\`, в папке `C:\wsl-projects\` будут доступны все файлы из `/root` внутри WSL.

## Linux, macOS

1. [Установите Docker](https://docs.docker.com/get-docker/) если ещё не стоит.
2. `git clone git@gitlab.com:mangoproject/langapp.git`
3. `./run/start-dev.sh`
4. Дождитесь сообщения `ℹ ｢wdm｣: Compiled successfully.`
5. Откройте в браузере http://localhost/

# Запуск

1. Запустите `wsl` в PowerShell в Windows или откройте терминал в Linux или macOS.
2. Запустите `./run/start-dev.sh`
3. Дождитесь сообщения `ℹ ｢wdm｣: Compiled successfully.`
4. Откройте в браузере http://localhost/

Если у вас занят какой-то из портов, который используется при запуске (например 80, 443, 5432), то вы можете поменять его в `run/dev.env`.\
Если вы меняете HTTP_PORT (по умолчанию 80), то его также необходимо поменять в `frontend/src/index.html`.

# Информация
## PostgreSQL
pgAdmin4 доступен по адресу http://localhost:5001/\
adminer доступен по адресу http://localhost:5002/?pgsql=db&username=postgres&db=postgres&ns=public

### Доступ к PostgreSQL:
Хост: 127.0.0.1\
Порт: 5432\
Логин: postgres\
Пароль: postgres\
База данных: postgres\

## Бэкенд
### Yii Debugger
Yii Debugger доступен по адресу http://localhost/debug

### xdebug
Для активации и использования xdebug рекомендуем установить расширение https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc

Также активировать xdebug можно вручную с помощью GET параметра XDEBUG_SESSION_START, например /api/?XDEBUG_SESSION_START=1 и деактивировать с помощью GET параметра XDEBUG_SESSION_STOP, например /api/?XDEBUG_SESSION_STOP=1 подробнее https://xdebug.org/docs/remote#browser_session

# Полезные команды
```bash
# Docker
docker-compose up --build -d # Запуск docker контейнеров
docker-compose stop # Остановка docker контейнеров
docker-compose down # Остановка и удаление docker контейнеров
docker-compose down --volumes # Остановка и удаление docker контейнеров вместе с volumes (база данных, кеши и т.д.)

# Backend
docker-compose exec backend [command] # Запуск команды в контейнере backend
docker-compose exec backend composer install # composer install 
docker-compose exec backend ./yii migrate/up --interactive 0 # Миграции
docker-compose exec backend ./yii migrate-data/up --interactive 0 # Миграции для данных (словарь и т.д.)

# Frontend
docker-compose exec frontend [command] # Запуск команды в контейнере frontend
docker-compose exec frontend sh -c 'NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install
docker-compose exec frontend npm start -- --host 0.0.0.0 # npm start (запускает ng serve)
docker-compose exec frontend npm run ng -- --help # Запуск ng  
docker-compose exec frontend npm run ng -- build --prod # запускает ng build --prod
```