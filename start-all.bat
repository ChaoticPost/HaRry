@echo off
echo Starting HaRry AI HR System...
echo.

echo Starting Backend Server in background...
start "Backend Server" cmd /k "cd backend && python -m venv .venv && call .venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
