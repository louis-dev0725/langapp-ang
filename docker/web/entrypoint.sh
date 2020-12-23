#!/usr/bin/env bash

HOST_DOMAIN="host.docker.internal"
ping -q -c1 $HOST_DOMAIN > /dev/null 2>&1
if [ $? -ne 0 ]; then
  HOST_IP=$(ip route | awk 'NR==1 {print $3}')
  echo -e "$HOST_IP\t$HOST_DOMAIN" >> /etc/hosts
fi

cd /app/backend

if [[ -n "$DISABLE_BEFORE_START_PROD" ]]; then
  exec /app/run/_web-before-start-prod.sh
fi

## Start services
exec /opt/docker/bin/service.d/supervisor.sh