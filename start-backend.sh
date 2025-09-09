#!/bin/bash
echo "Starting Backend Server..."
cd backend
echo "Creating virtual environment..."
python3 -m venv .venv
echo "Activating virtual environment..."
source .venv/bin/activate
echo "Installing dependencies..."
pip install -r requirements.txt
echo "Starting FastAPI server..."
uvicorn app.main:app --reload --port 8000
