@echo off
title LOOP AI Customer-Feedback Intelligence Platform — Setup & Run
echo ===================================================================
echo   LOOP AI Customer-Feedback Intelligence Platform
echo   Step 1: Installing Dependencies (npm install)...
echo ===================================================================
call npm install
echo.
echo ===================================================================
echo   Step 2: Generating Prisma Client & Syncing Database...
echo ===================================================================
call npx prisma generate
call npx prisma db push --accept-data-loss
echo.
echo ===================================================================
echo   Step 3: Seeding 150+ Verified Feedback Items & Demo Users...
echo ===================================================================
call npx tsx prisma/seed.ts
echo.
echo ===================================================================
echo   Step 4: Launching Server on http://localhost:3000 ...
echo   Demo Login:
echo   - Email: admin@loop.dev
echo   - Password: password123
echo ===================================================================
call npm run dev
pause
