#!/bin/bash
cd "$(dirname "$0")"
cd ..

set -x

./run/bin/unison -socket 5000 -ignore "Path backend-ts/dist/*" -ignore "Path */node_modules/*" -ignore "Path backend/runtime/*"