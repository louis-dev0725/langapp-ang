#!/bin/bash
cd "$(dirname "$0")"
cd ..

set -x

./run/bin/jumanpp-jumandic-grpc --config=/app/run/bin/jumandic.config --port=51231 --threads=1