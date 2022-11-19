#!/bin/bash
cd "$(dirname "$0")"
cd ..

docker-compose exec -d -T web /opt/run/_start-unison.sh

./run/bin/unison . socket://127.0.0.1:5000/ -batch -prefer newer -ignorelocks -ignore "Path */backend-ts/dist" -ignore "Path */frontend/dist" -ignore "Path */node_modules" -ignore "Path backend/runtime" -ignore "Path .git" -ignore "Name .vscode" -ignore "Name .unison" -ignore "Name backend/web/yii-assets" -repeat watch