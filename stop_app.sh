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
