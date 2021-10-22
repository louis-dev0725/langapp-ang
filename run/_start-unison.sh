#!/bin/bash
set -x

runuser -l application -c 'cd /app && /opt/run/bin/unison -socket 5000'