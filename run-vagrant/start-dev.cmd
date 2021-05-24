cd /d %~dp0\..
vagrant up
call .\run-vagrant\sync-once.cmd
start "rsync to vagrant" .\run-vagrant\start-sync.cmd
vagrant ssh -c "sudo bash -c 'LISTEN_HOST=0.0.0.0 bash /langapp/run/start-dev.sh'"
pause