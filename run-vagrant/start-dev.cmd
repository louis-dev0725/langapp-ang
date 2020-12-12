cd /d %~dp0\..
vagrant up
REM start "rsync to vagrant" .\run-vagrant\start-sync.cmd
vagrant ssh -c "sudo bash -c 'LISTEN_HOST=0.0.0.0 bash /langapp/run/start-dev.sh'"
pause