load('ext://dotenv', 'dotenv')
load('ext://uibutton', 'cmd_button')

dotenv('run/dev.env')

allow_k8s_contexts(k8s_context()) # Disable check as we currently don't use k8s resources inside Tiltfile


docker_compose('docker-compose.yml')
docker_build('langapp-web',
  context = '.',
  dockerfile = './docker/web/Dockerfile',
  target = 'dev',
  build_args = {'BASE_IMAGE' : 'php-nginx-dev'},
  live_update = [
    fall_back_on([
      #'./Tiltfile',
      './docker/web/Dockerfile'
    ]),
    sync('.', '/app'),
    run('cd backend-ts && NG_CLI_ANALYTICS=ci npm install --no-audit', trigger='./backend-ts/package-lock.json'),
    run('cd frontend && NG_CLI_ANALYTICS=ci npm install --no-audit', trigger='./frontend/package-lock.json'),
    run('cd backend && composer install', trigger='./backend/composer.lock')
    #restart_container()
  ]
)

dc_resource('web', labels = ['1-web'])
dc_resource('db', labels = ['services'])
dc_resource('redis', labels = ['services'])
dc_resource('pgadmin', labels = ['tools'])
dc_resource('adminer', labels = ['tools'])
dc_resource('arena', labels = ['tools'])
#dc_resource('es', labels = ['services'])
#dc_resource('kibana', labels = ['tools'])

local_resource('web-initial-sync',
  cmd = 'docker-compose exec -d -T web /opt/run/_start-unison.sh && ./run/_unison-sync-once.sh',
  cmd_bat = 'docker-compose exec -d -T web /opt/run/_start-unison.sh && .\\run\\_unison-sync-once.cmd',
  allow_parallel = True,
  resource_deps = ['web'],
  labels = ['1-web']
)

local_resource('web-frontend',
  serve_cmd = 'while true; do docker-compose exec -T web /app/run/_web-start-frontend.sh; done',
  serve_cmd_bat = 'FOR /L %N IN () DO docker-compose exec -T web /app/run/_web-start-frontend.sh',
  allow_parallel = True,
  resource_deps = ['web', 'web-initial-sync'],
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

local_resource('web-backend-php',
  cmd = 'docker-compose exec -T web /app/run/_web-start-backend.sh',
  allow_parallel = True,
  resource_deps = ['web', 'web-initial-sync'],
  labels = ['1-web']
)

local_resource('web-backend-ts',
  serve_cmd = 'while true; do docker-compose exec -T web /app/run/_web-start-backend-ts.sh; done',
  serve_cmd_bat = 'FOR /L %N IN () DO docker-compose exec -T web /app/run/_web-start-backend-ts.sh',
  allow_parallel = True,
  resource_deps = ['web', 'web-initial-sync'],
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