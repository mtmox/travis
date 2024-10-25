#!/bin/bash
echo "Starting the server..."
python3 app.py &
sleep 5
open http://localhost:5000
echo "Server started and browser opened. You can close this window now."
read -p "Press any key to continue..."
