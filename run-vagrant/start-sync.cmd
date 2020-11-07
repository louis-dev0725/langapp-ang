:loop

vagrant ssh -c "sudo nohup bash -c 'cd /langapp && nohup ./run/bin/unison -socket 5000 &'"
.\run\bin\unison.exe . socket://127.0.0.1:5000/ -batch -prefer newer -repeat watch -ignorelocks

goto loop