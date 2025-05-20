#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting SIR application...${NC}"

# Function to check if a command exists
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}$1 is not installed. Please install $1 and try again.${NC}"
    exit 1
  fi
}

# Check for required dependencies
check_command python3
check_command npm
check_command node

# Create logs directory if it doesn't exist
mkdir -p logs

# Start backend
echo -e "${GREEN}Starting backend server...${NC}"
cd backend

# Check if virtual environment exists, if not run run.sh to set it up
if [ ! -d "venv" ]; then
  echo -e "${BLUE}Setting up backend for the first time...${NC}"
  chmod +x run.sh
  ./run.sh &
else
  # Activate virtual environment and start the app
  echo -e "${BLUE}Starting backend with existing setup...${NC}"
  source venv/bin/activate
  python app.py > ../logs/backend.log 2>&1 &
fi

BACKEND_PID=$!
echo -e "${GREEN}Backend started with PID: $BACKEND_PID${NC}"
echo -e "${GREEN}Backend logs available at: logs/backend.log${NC}"
echo -e "${GREEN}Access backend at: http://localhost:8000${NC}"

# Wait a bit for backend to start
sleep 2

# Start frontend
cd ../front
echo -e "${GREEN}Installing frontend dependencies...${NC}"
npm install

echo -e "${GREEN}Starting frontend server...${NC}"
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
echo -e "${GREEN}Frontend logs available at: logs/frontend.log${NC}"
echo -e "${GREEN}Access frontend at: http://localhost:3000${NC}"

# Write the PIDs to a file for easy killing later
echo "$BACKEND_PID $FRONTEND_PID" > ../logs/app_pids.txt

echo -e "${BLUE}Both services are now running!${NC}"
echo -e "${BLUE}To stop the application, run: ./stop_app.sh${NC}"

# Return to the original directory
cd ..

# Create a stop script
cat > stop_app.sh << 'EOL'
#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Stopping SIR application...${NC}"

if [ -f "logs/app_pids.txt" ]; then
  PIDS=$(cat logs/app_pids.txt)
  for PID in $PIDS; do
    if ps -p $PID > /dev/null; then
      echo -e "${GREEN}Stopping process with PID: $PID${NC}"
      kill $PID
    fi
  done
  rm logs/app_pids.txt
  echo -e "${GREEN}All processes stopped.${NC}"
else
  echo -e "${BLUE}No running processes found.${NC}"
fi
EOL

chmod +x stop_app.sh
echo -e "${GREEN}Created stop_app.sh script for stopping the application${NC}" 