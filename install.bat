@echo off
echo Installing Minh Duc Web Event dependencies...
echo.
echo [1/2] Installing backend dependencies...
cd /d c:\MyProject\minh_duc_web_event\backend && npm install
echo.
echo [2/2] Installing frontend dependencies...
cd /d c:\MyProject\minh_duc_web_event\frontend && npm install
echo.
echo Installation complete!
echo Run start.bat to launch the application.
pause
