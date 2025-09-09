#!/bin/bash
echo "Starting HaRry AI HR System..."
echo

echo "Starting Backend Server in background..."
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "Waiting 5 seconds for backend to start..."
sleep 5

echo "Starting Frontend Server..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop all servers..."

# Wait for user to stop
wait
