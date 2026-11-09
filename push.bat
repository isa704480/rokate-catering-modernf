@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

REM ============================================================
REM  GitHub'ga yuklash. Repo havolasi allaqachon yozilgan.
REM  Shart: GitHub'da shu nomli BO'SH repo bo'lsin
REM  (README ham, .gitignore ham qo'shilmagan).
REM ============================================================
set "REPO=https://github.com/isa704480/rokate-catering.git"
set "BRANCH=main"
REM ============================================================

echo.
echo === Rokate Catering -^> GitHub ===
echo Papka : %CD%
echo Repo  : %REPO%
echo.

git --version >nul 2>&1
if errorlevel 1 (
  echo [XATO] Git o'rnatilmagan. https://git-scm.com/download/win dan o'rnating.
  goto :end
)

for /f "tokens=*" %%i in ('git config user.email 2^>nul') do set "GEMAIL=%%i"
if not defined GEMAIL (
  echo [XATO] Git'da ism/email sozlanmagan. Bir marta quyidagini bajaring:
  echo    git config --global user.name "Ismingiz"
  echo    git config --global user.email "email@example.com"
  goto :end
)

if not exist ".git" (
  echo [1/5] Git ombori yaratilmoqda...
  git init -b %BRANCH% || goto :fail
) else (
  echo [1/5] Git ombori allaqachon bor.
  git checkout -B %BRANCH% || goto :fail
)

echo [2/5] Remote sozlanmoqda...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin "%REPO%" || goto :fail
) else (
  git remote set-url origin "%REPO%" || goto :fail
)

if not exist ".gitignore" (
  echo       .gitignore yaratilmoqda...
  >".gitignore" echo node_modules/
  >>".gitignore" echo .next/
  >>".gitignore" echo out/
  >>".gitignore" echo *.tsbuildinfo
  >>".gitignore" echo next-env.d.ts
  >>".gitignore" echo .env
  >>".gitignore" echo .env.local
  >>".gitignore" echo .vercel
)
findstr /c:"admin*.png" ".gitignore" >nul 2>&1
if errorlevel 1 (
  echo       .gitignore to'ldirilmoqda ^(test rasmlari, materials^)...
  >>".gitignore" echo.
  >>".gitignore" echo # Test skrinshotlari va mijoz materiallari - GitHub'ga ketmasin
  >>".gitignore" echo admin*.png
  >>".gitignore" echo materials/
)

echo [3/5] Fayllar qo'shilmoqda...
git add -A || goto :fail

echo [4/5] Commit...
git diff --cached --quiet
if not errorlevel 1 (
  echo       O'zgarish yo'q, commit o'tkazib yuborildi.
) else (
  git commit -m "Rokate Catering: yakuniy sayt, Decap CMS, Swiper sharhlar karuseli" -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" || goto :fail
)

echo [5/5] GitHub'ga yuborilmoqda...
git push -u origin %BRANCH%
if errorlevel 1 (
  echo.
  echo [XATO] Push o'tmadi. Ko'p uchraydigan sabablar:
  echo   - Repo bo'sh emas ^(README bor^). Yechim: GitHub'da repo'ni o'chirib,
  echo     bo'sh holda qaytadan yarating, keyin shu faylni yana ishlatib ko'ring.
  echo   - Parol so'ragan oynada oddiy parol emas, Personal Access Token kerak:
  echo     GitHub -^> Settings -^> Developer settings -^> Personal access tokens.
  goto :end
)

echo.
echo === TAYYOR ===
echo Keyingi qadam: public\admin\config.yml faylida
echo   repo: foydalanuvchi/repo-nomi
echo qatorini shu repo nomiga moslang.
goto :end

:fail
echo.
echo [XATO] Yuqoridagi buyruq bajarilmadi. Xato matnini menga yuboring.

:end
echo.
pause
