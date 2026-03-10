@echo off
echo Starting Minh Duc Web Event...
start cmd /k "cd /d c:\MyProject\minh_duc_web_event\backend && npm run dev"
timeout /t 2
start cmd /k "cd /d c:\MyProject\minh_duc_web_event\frontend && npm run dev"
echo Done! Backend: http://localhost:5000 ^| Frontend: http://localhost:5173
pause
