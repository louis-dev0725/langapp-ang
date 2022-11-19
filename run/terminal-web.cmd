setlocal
FOR /F "eol=# tokens=*" %%i IN (%~dp0\..\.env.defaults) DO SET %%i
FOR /F "eol=# tokens=*" %%i IN (%~dp0\..\.env) DO SET %%i
cd /d %~dp0\..
docker-compose exec -e LOAD_TEST_DATA=%LOAD_TEST_DATA% -e TEST_DATA_URL=%TEST_DATA_URL% web bash
endlocal