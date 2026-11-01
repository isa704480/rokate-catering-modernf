@echo off
setlocal
chcp 65001 >nul
title Rokate Catering - ishlab chiqish rejimi
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js topilmadi.
  echo Yuklab oling: https://nodejs.org  ^(LTS versiyasi^)
  echo O'rnatgandan keyin shu faylni qayta ishga tushiring.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Birinchi ishga tushish - paketlar o'rnatilmoqda. Bu 1-3 daqiqa oladi...
  call npm install
  if errorlevel 1 goto :err
)

echo.
echo   Sayt (Asosiy - Inglizcha): http://localhost:3000
echo   Ruscha:                   http://localhost:3000/ru
echo   Admin panel (CMS):        http://localhost:3000/admin (login-parolsiz)
echo.
echo   To'xtatish uchun: Ctrl+C yoki shu oynani yoping.
echo.

start "" http://localhost:3000
call npm run dev
exit /b 0

:err
echo.
echo XATO! Yuqoridagi xabarni o'qing.
pause
exit /b 1
