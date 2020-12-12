#!/bin/bash
cd "$(dirname "$0")"
cd ../logs

screen -wipe > /dev/null 2>&1
screen -c ../run/_screen.conf -dmSL "juman" -Logfile "juman.log" -t "juman" bash -c "trap 'echo gotsigint' INT; /app/run/_web-start-juman.sh; bash"
screen -c ../run/_screen.conf -dmSL "backend-ts" -Logfile "backend-ts.log" -t "backend-ts" bash -c "trap 'echo gotsigint' INT; /app/run/_web-start-backend-ts.sh; bash"
screen -c ../run/_screen.conf -dmSL "frontend" -Logfile "frontend.log" -t "frontend" bash -c "trap 'echo gotsigint' INT; /app/run/_web-start-frontend.sh; bash"