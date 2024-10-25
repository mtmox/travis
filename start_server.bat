
@echo off
echo Creating database if it doesn't exist...
python create_database.py
echo Starting the server...
start "" python app.py
timeout /t 5 /nobreak
start http://localhost:5000
echo Server started and browser opened. You can close this window now.
pause
