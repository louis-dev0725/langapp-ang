#!/bin/bash
cd /app

set -x

runuser -l application -c '/opt/run/bin/unison -socket 5000'