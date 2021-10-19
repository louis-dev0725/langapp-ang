#!/bin/bash
cd "$(dirname "$0")"
export $(grep -v '^#' dev.env | xargs)
cd ../frontend

set -x

NG_CLI_ANALYTICS=ci npm install --no-audit
pkill -f "ng serve"
npm start