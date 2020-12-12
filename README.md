# LangApp

- [LangApp](#langapp)
- [Установка](#установка)
  - [Windows](#windows)
  - [Windows (Vagrant)](#windows-vagrant)
  - [Windows (WSL)](#windows-wsl)
  - [Linux, macOS](#linux-macos)
- [Запуск](#запуск)
- [Ссылки и пароли](#ссылки-и-пароли)
  - [Само приложение](#само-приложение)
  - [PostgreSQL](#postgresql)
    - [Доступ к PostgreSQL:](#доступ-к-postgresql)
  - [Бэкенд](#бэкенд)
    - [Yii Debugger](#yii-debugger)
    - [xdebug](#xdebug)
- [Полезные команды](#полезные-команды)
- [Полезные скрипты](#полезные-скрипты)
  - [WSL, Linux, macOS](#wsl-linux-macos)
  - [Windows (Vagrant)](#windows-vagrant-1)

# Установка

## Windows

Рекомендуем вместо запуска проекта напрямую с файловой системы Windows (`C:\..`, `D:\...` и так далее), запускать через Vagrant либо с диска внутри WSL (`/root/...`). Если использовать WSL2/Docker напрямую из Windows, то проект запускается и работает очень медленно. Это происходит из-за медленной работы файловой системы Windows внутри WSL ([issue в WSL](https://github.com/microsoft/WSL/issues/4197)). Эта рекомендация так же указана в [Best practices к Docker Desktop для Windows)](https://docs.docker.com/docker-for-windows/wsl/#best-practices)).

## Windows (Vagrant)

Запускает docker внутри виртуальной машины (создается автоматически с помощью Vagrant).

1. [Установите Vagrant](https://www.vagrantup.com/downloads) и [Virtualbox](https://www.virtualbox.org/wiki/Downloads) если ещё не установлены.
2. Запустите `run-vagrant/start-dev.cmd` (через Проводник, PowerShell или Windows Terminal)
3. Дождитесь сообщения `ℹ ｢wdm｣: Compiled successfully.`
4. Откройте в браузере http://localhost/

Вы можете подключится к терминалу в контейнере web запустив `run-vagrant/terminal-webcmd`.\
Вы можете подключится к терминалу внутри виртуальной машины запустив `run-vagrant/terminal-vagrant.cmd`.

## Windows (WSL)

Удобный вариант если не мешают ограничения WSL (нюансы при использовании в PhpStorm, возможные проблемы с одновременным использованием 
виртуальных машин VMware).

1. [Установите WSL](https://www.omgubuntu.co.uk/how-to-install-wsl2-on-windows-10) если ещё не установлен.
2. [Установите Docker](https://docs.docker.com/get-docker/) если ещё не установлен.
3. Запустите PowerShell (либо [Windows Terminal](https://github.com/microsoft/terminal)) и запустите `wsl`. Проект будем запускать и хранить внутри WSL.
4. (внутри WSL) `cd ~`
5. (внутри WSL) `git clone git@gitlab.com:mangoproject/langapp.git`
6. (внутри WSL) `cd langapp`
7. (внутри WSL) `./run/start-dev.sh`
8. Дождитесь сообщения `ℹ ｢wdm｣: Compiled successfully.`
9. Откройте в браузере http://localhost/

Для редактирования кода, который находится внутри WSL можно использовать [расширение для VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) или сделать симлинк.

Для создания симлинка запустите `cmd` от Администратора, а затем выполните `mklink /D C:\wsl-projects\ \\wsl$\Ubuntu\root\`, в папке `C:\wsl-projects\` будут доступны все файлы из `/root` внутри WSL.

## Linux, macOS

1. [Установите Docker](https://docs.docker.com/get-docker/) если ещё не стоит.
2. `git clone git@gitlab.com:mangoproject/langapp.git`
3. `./run/start-dev.sh`
4. Дождитесь сообщения `ℹ ｢wdm｣: Compiled successfully.`
5. Откройте в браузере http://localhost/

# Запуск

1. Запустите `wsl` в PowerShell/Terminal в Windows или откройте терминал в Linux или macOS. Если вы используете Vagrant, то используйте инструкцию из раздела "Windows (Vagrant)".
2. Запустите `./run/start-dev.sh`
3. Дождитесь сообщения `ℹ ｢wdm｣: Compiled successfully.`
4. Откройте в браузере http://localhost/

Если у вас занят какой-то из портов, который используется при запуске (например 80, 443, 5432), то вы можете поменять его в `run/dev.env`.\
Если вы меняете HTTP_PORT (по умолчанию 80), то его также необходимо поменять в `frontend/src/index.html`.

# Ссылки и пароли
## Само приложение
http://localhost/

## PostgreSQL
pgAdmin4 доступен по адресу http://localhost:5001/\
adminer доступен по адресу http://localhost:5002/?pgsql=db&username=postgres&db=postgres&ns=public

### Доступ к PostgreSQL:
Хост: 127.0.0.1\
Порт: 5432\
Логин: postgres\
Пароль: postgres\
База данных: postgres

## Бэкенд
### Yii Debugger
Yii Debugger доступен по адресу http://localhost/debug

### xdebug
Для активации и использования xdebug рекомендуем установить расширение https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc

Также активировать xdebug можно вручную с помощью GET параметра XDEBUG_SESSION_START, например /api/?XDEBUG_SESSION_START=1 и деактивировать с помощью GET параметра XDEBUG_SESSION_STOP, например /api/?XDEBUG_SESSION_STOP=1 подробнее https://xdebug.org/docs/remote#browser_session

# Полезные команды

В случае запуска через Vagrant, команды нужно выполнять в терминале внутри виртуальной машины (используйте `run-vagrant/terminal-vagrant.cmd`).

```bash
# Docker
docker-compose up --build -d # Запуск docker контейнеров
docker-compose stop # Остановка docker контейнеров
docker-compose down # Остановка и удаление docker контейнеров
docker-compose down --volumes # Остановка и удаление docker контейнеров вместе с volumes (база данных, кеши и т.д.)

# Контейнер web (backend и frontend)
docker-compose exec web [command] # Запуск команды в контейнере web
docker-compose exec web bash # Запуск bash в контейнере web (см. также run/terminal-web.sh)
docker-compose exec web composer install # composer install 
docker-compose exec web ./yii migrate/up --interactive 0 # Миграции
docker-compose exec web ./yii migrate-data/up --interactive 0 # Миграции для данных (словарь и т.д.)

docker-compose exec web sh -c 'NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install
docker-compose exec web npm start -- --host 0.0.0.0 # npm start (запускает ng serve)
docker-compose exec web npm run ng -- --help # Запуск ng  
docker-compose exec web npm run ng -- build --prod # запускает ng build --prod
docker-compose exec web screen -ls # Список процессов, запущеных через screen (frontend, backend-ts, juman и другие)
docker-compose exec web screen -r frontend # Приконнектится к консоли, в которой запущен frontend (например)
```

# Полезные скрипты

## WSL, Linux, macOS
- `run/start-dev.sh` запуск всего необходимого для разработки (запускает docker контейнеры, применяет миграции, устанавливает пакеты composer и npm, запускает ng serve)
- `run/stop-dev.sh` остановка (останавливает контейнеры docker)
- `run/terminal-web.sh` открывает терминал в Docker контейнере web (доступ к консоли yii, npm и так далее)

## Windows (Vagrant)
- `run-vagrant/start-dev.cmd` запуск всего необходимого для разработки (подготавливает виртуальную машину через Vagrant, запускает в ней `run/start-dev.sh`, запускает автоматическую синхронизацию файлов)
- `run-vagrant/stop-dev.cmd` остановка виртуальных машин (через Vagrant)
- `run-vagrant/start-sync.cmd` запуск автоматической синхронизации файлов через unsion (этот скрипт автоматически запускается из `run-vagrant/start-dev.cmd`)
- `run-vagrant/terminal-web.cmd` открывает терминал в Docker контейнере web (доступ к консоли yii, npm и так далее)
- `run-vagrant/terminal-vagrant.cmd` открывает терминал в виртуальной машине, созданной через Vagrant
