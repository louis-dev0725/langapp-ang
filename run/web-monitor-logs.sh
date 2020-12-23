#!/bin/bash
cd "$(dirname "$0")"
cd ../logs
bash --init-file <(echo "tail -f frontend.log backend-ts.log juman.log; echo '(inside web docker container)'")