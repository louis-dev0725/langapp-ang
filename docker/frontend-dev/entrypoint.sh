#!/usr/bin/env bash

cd /app/frontend

#NG_CLI_ANALYTICS=ci npm install --no-audit
#exec npm start -- --host 0.0.0.0

# https://github.com/docker/compose/issues/1926#issuecomment-422351028
trap : TERM INT
exec tail -f /dev/null & wait