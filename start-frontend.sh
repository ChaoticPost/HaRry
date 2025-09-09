#!/bin/bash
echo "Starting Frontend Server..."
cd frontend
echo "Installing dependencies..."
npm install
echo "Starting development server..."
npm run dev
