#!/bin/bash
echo "Starting Ludo Performance Testing Suite..."

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "Starting Backend..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

echo "Starting Frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
