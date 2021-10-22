#!/bin/bash
set -x

chown application:application /app -R
runuser -l application -c 'cd /app && /opt/run/bin/unison -socket 5000'