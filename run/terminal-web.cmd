setlocal
FOR /F "eol=# tokens=*" %%i IN (%~dp0\dev.env) DO SET %%i
cd /d %~dp0\..
docker-compose exec -e LOAD_TEST_DATA=%LOAD_TEST_DATA% web bash
endlocal