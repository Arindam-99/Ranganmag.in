@echo off
echo Starting Ranganmag Blogging System...
echo.

echo [1/4] Starting Backend API Server...
start "Backend API" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/4] Starting Admin Interface...
start "Admin Interface" cmd /k "cd admin && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/4] Generating Static Site...
cd static-site
call npm run generate
timeout /t 2 /nobreak >nul

echo [4/4] Starting Static Site Server...
start "Static Site" cmd /k "cd static-site && npx http-server dist -p 8082 -c-1"
timeout /t 2 /nobreak >nul

echo.
echo ✅ All services started successfully!
echo.
echo 📊 Admin Interface: http://localhost:3001/
echo 🔧 Backend API: http://localhost:5000/
echo 🌐 Static Site: http://localhost:8082/
echo.
echo Press any key to exit...
pause >nul
