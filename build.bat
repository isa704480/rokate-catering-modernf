@echo off
setlocal
chcp 65001 >nul
title Rokate Catering - statik build
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js topilmadi. Yuklab oling: https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Paketlar o'rnatilmoqda...
  call npm install
  if errorlevel 1 goto :err
)

echo Sayt yig'ilmoqda...
call npm run build
if errorlevel 1 goto :err

echo.
echo Tayyor. Natija: out\ papkasi - Cloudflare Pages aynan shuni joylaydi.
echo Tekshirish uchun brauzer ochilmoqda...
echo.
start "" http://localhost:4000
call npm run preview
exit /b 0

:err
echo.
echo XATO! Yuqoridagi xabarni o'qing.
pause
exit /b 1
