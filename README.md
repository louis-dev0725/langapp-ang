# LangApp

- [LangApp](#langapp)
  - [How to start](#how-to-start)
    - [Option 1: Quick (via codespace)](#option-1-quick-via-codespace)
    - [Option 2: locally](#option-2-locally)
  - [Launch](#launch)
- [References and passwords](#references-and-passwords)
  - [The application itself](#the-application-itself)
    - [Test administrator](#test-administrator)
    - [Test user](#test-user)
  - [API documentation](#api-documentation)
  - [PostgreSQL](#postgresql)
    - [Access to PostgreSQL:](#access-to-postgresql)
  - [PHP backend (Yii2)](#php-backend-yii2)
    - [Yii Debugger](#yii-debugger)
    - [xdebug](#xdebug)
- [Tilt information](#tilt-information)
- [Useful commands](#useful-commands)
- [Useful scripts](#useful-scripts)

## How to start

### Option 1: Quick (via codespace)

From the browser:
1. [Create codespace](https://github.com/codespaces/new?hide_repo_select=true&ref=master&repo=568000975&machine=standardLinux32gb) and run it.

If you are using VS Code ([detailed instructions](https://docs.github.com/en/codespaces/developing-in-codespaces/using-github-codespaces-in-visual-studio-code#creating-a-codespace-in-vs-code)):
1. Install the [GitHub Codespaces](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) extension
2. Switch to "Remote Explorer" tab
3. Select "GitHub Codespaces" from the drop-down list.
4. Click the "+" button and create a codespace for the current repository.

If you are using an IDE from JetBrains:
1. [Detailed instructions](https://docs.github.com/en/codespaces/developing-in-codespaces/using-github-codespaces-in-your-jetbrains-ide)

### Option 2: locally
1. Install [Tilt](https://docs.tilt.dev/install.html), and [Docker](https://docs.docker.com/get-docker/) (if not already installed).

2. Clone this repository.

## Launch
1. Run in the terminal:
```bash
tilt up
```

2. Open [http://localhost:10350/](http://localhost:10350/).\
On this page you can check logs, build status and other information. The first run may take some time, please wait until all resources are green.\

If necessary (e.g. if you change the port) you can restart the desired containers with the "Trigger update" button next to the container.

3. Open [http://localhost:8080/app/](http://localhost:8080/app/) in your browser.
This is the application itself.

4. If you want to install any dependencies, you can do it inside the `web` container (the console can be opened with the `run/terminal-web.sh` script).

**Additionally:**

If you run locally and want to stop the project, run
`docker-compose stop`. To remove created containers, run `tilt down`.

If you have any of the ports you use at startup (like 8080, 443, 5432) busy, you can change it in `.env`.

# References and passwords
## The application itself
http://localhost/app

### Test administrator
Login name: admin@example.org\
Password: adminpassword

### Test user
Login: user@example.org\
Password: userpassword

## API documentation
In Swagger UI: http://localhost:5005

## PostgreSQL
<!--pgAdmin4 available at http://localhost:5001/\
adminer available at http://localhost:5002/?pgsql=db&username=postgres&db=postgres&ns=public-->

### Access to PostgreSQL:
Host: 127.0.0.1\
Port: 5432\
Login: postgres\
Password: postgres
Database: postgres

## PHP backend (Yii2)
### Yii Debugger
The Yii Debugger is available at http://localhost/debug

### xdebug
To activate and use xdebug, you can install the extension https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc

You can also activate xdebug manually with the GET parameter `XDEBUG_SESSION_START`, for example `/api/?XDEBUG_SESSION_START=1` and deactivate it with the GET parameter XDEBUG_SESSION_STOP, for example `/api/?XDEBUG_SESSION_STOP=1` more https://xdebug.org/docs/remote#browser_session


# Tilt information
You can see the logs for each resource, and you can also restart it.

The resources in Tilt:\
**web** - web container (from docker-composer)\
**web-initial-sync** - (Windows only) initial synchronization of files with the container\
**web-sync** - (Windows only) continuous file synchronization with a container\
**web-frontend** - `ng serve` for Angular (inside web container)\
**web-backend-php** - runs `composer install` and migration for PHP backend (Yii2, folder `backend/`) <!--(first time only, then Tilt will run `composer install` if composer.json is changed and show results in `web`)-->\
**web-backend-ts** - executes `nest start --watch` for TypeScript backend (nestjs)\
**db** - container with PostgreSQL (from docker-composer)\
**redis** - container with Redis (from docker-composer)\
**swagger** - container with Swagger UI (API documentation) (from docker-composer)\
**arena** - arena container (from docker-composer)\
**(Tiltfile)** - Tilt configuration
<!--**adminer**, **arena**, **pgadmin** - containers with adminer, arena, pgadmin (from docker-composer)\-->

`node_modules` inside the container are located on a separate volume and are not synchronized with the host, so after running `npm install` on the host you need to click on "Update" next to the `web-frontend` (or `web-backend-ts`) in Tilt, or manually run `npm install` in the desired folder

# Useful commands


```bash
# Tilt and Docker
tilt up # Start the project
docker-compose stop # Stop the project
tilt down # Stopping the project and removing containers
docker-compose down --volumes # Stopping and removing docker containers along with volumes (database, caches, etc.)

# Container web (backend and frontend)
docker-compose exec web [command] # Runs a command in the web container
docker-compose execute web bash # Run bash in the web container (see also run/terminal-web.sh)

# composer install and migration can also be triggered by pressing "Trigger update" on web-backend-php in Tilt
docker-compose exec web composer install # composer install 
docker-compose exec web ./yii migrate/up --interactive 0 # Migrations
docker-compose exec web ./yii migrate-data/up --interactive 0 # Migrations for data (dictionary, etc.)

The # npm install can also be run by pressing Trigger update" at web-frontend/web-backend-ts in Tilt
docker-compose exec -w /app/backend-ts web sh -c 'NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install for backend-ts
docker-compose exec -w /app/frontend web sh -c 'cd backend-ts && NG_CLI_ANALYTICS=ci npm install --no-audit' # npm install for frontend

docker-compose exec -w /app/frontend web npm start -- --host 0.0.0.0 # npm start (starts ng serve)
docker-compose exec -w /app/frontend web npm run ng -- --help # ng start  
docker-compose exec -w /app/frontend web npm run ng -- build --prod # run ng build --prod
```

# Useful scripts

- `run/terminal-web.sh` opens the terminal in the Docker container web (access to the yii console, npm and so on)