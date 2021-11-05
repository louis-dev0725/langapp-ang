load('ext://dotenv', 'dotenv')
load('ext://uibutton', 'cmd_button')

dotenv('run/dev.env')

allow_k8s_contexts(k8s_context()) # Disable check as we currently don't use k8s resources inside Tiltfile

trigger_mode(TRIGGER_MODE_MANUAL)

# Docker Compose support in Tiltfile is a bit buggy, so for now we just call "docker-compose up" using "local_resource"
# local_resource('docker-compose',
#   serve_cmd = 'docker-compose up --build',
#   resource_deps = [],
#   labels = ['1-web'],
#   #readiness_probe = probe(exec = exec_action(["docker-compose", "exec", "web", "echo", "Test"]))
# )

docker_compose('docker-compose.yml')
docker_build('langapp-web',
  context = '.',
  dockerfile = './docker/web/Dockerfile',
  target = 'dev',
  build_args = {'BASE_IMAGE' : 'php-nginx-dev'},
  # live_update = [
  #   sync('.', '/app'),
  #   run('cd backend-ts && NG_CLI_ANALYTICS=ci npm install --no-audit', trigger='./backend-ts/package-lock.json'),
  #   run('cd frontend && NG_CLI_ANALYTICS=ci npm install --no-audit', trigger='./frontend/package-lock.json'),
  #   run('cd backend && composer install', trigger='./backend/composer.lock')
  #   #restart_container()
  # ]
)

dc_resource('web', labels = ['1-web'])
dc_resource('db', labels = ['3-services'])
dc_resource('redis', labels = ['3-services'])
# dc_resource('pgadmin', labels = ['2-tools'])
# dc_resource('adminer', labels = ['2-tools'])
dc_resource('arena', labels = ['2-tools'])
dc_resource('swagger', labels = ['2-tools'])
#dc_resource('es', labels = ['3-services'])
#dc_resource('kibana', labels = ['2-tools'])

local_resource('web-initial-sync',
  cmd = './run/_unison-sync-once.sh',
  cmd_bat = '.\\run\\_unison-sync-once.cmd',
  allow_parallel = True,
  resource_deps = ['web'],
  labels = ['1-web']
)
local_resource('web-sync',
  serve_cmd = './run/_unison-sync-watch.sh',
  serve_cmd_bat = '.\\run\\_unison-sync-watch.cmd',
  allow_parallel = True,
  resource_deps = ['web-initial-sync'],
  labels = ['1-web']
)

local_resource('web-frontend',
  serve_cmd = 'while true; do docker-compose exec -T web /app/run/_web-start-frontend.sh; done',
  serve_cmd_bat = 'FOR /L %N IN () DO docker-compose exec -T web /app/run/_web-start-frontend.sh',
  allow_parallel = True,
  resource_deps = ['web-initial-sync'],
  labels = ['1-web'],
  readiness_probe = probe(http_get = http_get_action(80, host = 'localhost', path ='/app'))
)
cmd_button('web-frontend:cancel_win',
          argv=['wmic', 'Path', 'win32_process', 'Where', '(Name = \'cmd.exe\' and CommandLine Like \'%_web-start-frontend%\')', 'Call', 'Terminate'],
          resource='web-frontend',
          icon_name='cancel',
          text='Cancel (Win)',
)
cmd_button('web-frontend:cancel_linux',
          argv=['pkill', '-f', '_web-start-frontend'],
          resource='web-frontend',
          icon_name='cancel',
          text='Cancel (Linux)',
)
cmd_button('docker-compose:start',
          argv=['docker-compose', 'up', '--build'],
          resource='docker-compose',
          icon_name='cancel',
          text='Start (docker-compose up)',
)
cmd_button('docker-compose:stop',
          argv=['docker-compose', 'down'],
          resource='docker-compose',
          icon_name='cancel',
          text='Stop (docker-compose down)',
)

local_resource('web-backend-php',
  cmd = 'docker-compose exec -T web /app/run/_web-start-backend.sh',
  allow_parallel = True,
  resource_deps = ['web-initial-sync'],
  labels = ['1-web']
)

local_resource('web-backend-ts',
  serve_cmd = 'while true; do docker-compose exec -T web /app/run/_web-start-backend-ts.sh; done',
  serve_cmd_bat = 'FOR /L %N IN () DO docker-compose exec -T web /app/run/_web-start-backend-ts.sh',
  allow_parallel = True,
  resource_deps = ['web-initial-sync'],
  labels = ['1-web'],
  readiness_probe = probe(http_get = http_get_action(80, host = 'localhost', path ='/api/probeBackendTs'))
)
cmd_button('web-backend-ts:cancel_win',
          argv=['wmic', 'Path', 'win32_process', 'Where', '(Name = \'cmd.exe\' and CommandLine Like \'%_web-start-backend-ts%\')', 'Call', 'Terminate'],
          resource='web-backend-ts',
          icon_name='cancel',
          text='Cancel (Win)',
)
cmd_button('web-backend-ts:cancel_linux',
          argv=['pkill', '-f', '_web-start-backend-ts'],
          resource='web-backend-ts',
          icon_name='cancel',
          text='Cancel (Linux)',
)