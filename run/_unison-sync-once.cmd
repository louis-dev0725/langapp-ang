cd /d %~dp0\..

.\run\bin\unison.exe . socket://127.0.0.1:5000/ -batch -prefer newer -ignorelocks -ignore "Path */backend-ts/dist" -ignore "Path */frontend/dist" -ignore "Path */node_modules" -ignore "Path */backend/runtime/*" -ignore "Path .git" -ignore "Name .vscode" -ignore "Name .unison"