#!/bin/bash
cd "$(dirname "$0")/.."
unisonLocation="$(pwd)/run/bin/unison"
grep -Po '"pathInsideWSL2":.*?[^\\]",' run-wsl2/dev.json
pathInsideWSL2="$(grep -oP '(?<="pathInsideWSL2": ").*?[^\\](?=")' run-wsl2/dev.json)"

echo $unisonLocation
echo $pathInsideWSL2
mkdir -p $pathInsideWSL2
cd $pathInsideWSL2

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
pkill -f unison
$unisonLocation -socket 5000 -host 127.0.0.1