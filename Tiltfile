load('ext://uibutton', 'cmd_button')
# Disable analytics
analytics_settings(enable=False)

# Extend https://github.com/tilt-dev/tilt-extensions/blob/master/dotenv/Tiltfile
def dotenv(fn='.env'):
  f = read_file(fn, '')
  lines = str(f).splitlines()
  for line in lines:
    v = line.split('=', 1)
    if len(v) < 2:
      continue # skip empty lines
    if (os.getenv(v[0]) == None): # Do not override existing env variables
      os.putenv(v[0], v[1])

dotenv('.env.defaults')
dotenv('.env')

is_win = os.getenv('OS') == 'Windows_NT'
http_port = int(os.getenv('HTTP_PORT'))

# Mount paths directly (except Windows)
if (not is_win):
  os.putenv('MOUNT_PATH_APP', './')
  os.putenv('MOUNT_PATH_NODE_MODULES_FRONTEND', './frontend/node_modules')
  os.putenv('MOUNT_PATH_NODE_MODULES_BACKEND', './backend-ts/node_modules')
  os.putenv('MOUNT_PATH_NODE_MODULES_EXTENSION', './extension/node_modules')

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


if (os.getenv('OS') == 'Windows_NT'):
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
    resource_deps = ['web-initial-sync'] if is_win else [],
    labels = ['1-web']
  )

local_resource('web-frontend',
  serve_cmd = 'while true; do docker-compose exec  -e LOAD_TEST_DATA=$LOAD_TEST_DATA -e TEST_DATA_URL=$TEST_DATA_URL -T web bash /app/run/_web-start-frontend.sh; done',
  serve_cmd_bat = 'FOR /L %N IN () DO docker-compose exec -e LOAD_TEST_DATA=%LOAD_TEST_DATA% -e TEST_DATA_URL=%TEST_DATA_URL% -T web bash /app/run/_web-start-frontend.sh',
  allow_parallel = True,
  resource_deps = ['web-initial-sync', 'web'] if is_win else ['web'],
  labels = ['1-web'],
  readiness_probe = probe(http_get = http_get_action(http_port, host = 'localhost', path ='/app'))
)

if (is_win):
  cmd_button('web-frontend:cancel_win',
            argv=['wmic', 'Path', 'win32_process', 'Where', '(Name = \'cmd.exe\' and CommandLine Like \'%_web-start-frontend%\')', 'Call', 'Terminate'],
            resource='web-frontend',
            icon_name='cancel',
            text='Cancel',
  )
else:
  cmd_button('web-frontend:cancel_linux',
            argv=['pkill', '-f', '_web-start-frontend'],
            resource='web-frontend',
            icon_name='cancel',
            text='Cancel',
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
  cmd = 'docker-compose exec -T web bash /app/run/_web-start-backend.sh',
  allow_parallel = True,
  resource_deps = ['web-initial-sync', 'web'] if is_win else ['web'],
  labels = ['1-web']
)

local_resource('web-backend-ts',
  serve_cmd = 'while true; do docker-compose exec -T web bash /app/run/_web-start-backend-ts.sh; done',
  serve_cmd_bat = 'FOR /L %N IN () DO docker-compose exec -T web bash /app/run/_web-start-backend-ts.sh',
  allow_parallel = True,
  resource_deps = ['web-initial-sync', 'web'] if is_win else ['web'],
  labels = ['1-web'],
  readiness_probe = probe(http_get = http_get_action(http_port, host = 'localhost', path ='/api/probeBackendTs'))
)

if (is_win):
  cmd_button('web-backend-ts:cancel_win',
            argv=['wmic', 'Path', 'win32_process', 'Where', '(Name = \'cmd.exe\' and CommandLine Like \'%_web-start-backend-ts%\')', 'Call', 'Terminate'],
            resource='web-backend-ts',
            icon_name='cancel',
            text='Cancel',
  )
else:
  cmd_button('web-backend-ts:cancel_linux',
            argv=['pkill', '-f', '_web-start-backend-ts'],
            resource='web-backend-ts',
            icon_name='cancel',
            text='Cancel',
  )