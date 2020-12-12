cd /d %~dp0\..

:loop

vagrant ssh -c "sudo nohup bash -c 'cd /langapp && nohup ./run/bin/unison -socket 5000 &'"
.\run\bin\unison.exe . socket://127.0.0.1:5000/ -batch -prefer newer -repeat watch -ignorelocks -ignore "Path backend-ts/dist/*" -ignore "Path */node_modules/*" -ignore "Path backend/runtime/*"

goto loop