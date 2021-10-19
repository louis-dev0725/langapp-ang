#!/bin/bash
cd "$(dirname "$0")"
export $(grep -v '^#' dev.env | xargs)
cd ../backend-ts

set -x

npm run start:prod