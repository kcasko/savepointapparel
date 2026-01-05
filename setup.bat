@echo off
echo 🎮 Setting up Save Point Apparel Custom Store...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create environment file if it doesn't exist
if not exist .env.local (
    echo ⚙️ Creating environment file...
    copy .env.example .env.local
    echo 📝 Please edit .env.local with your configuration values
    echo    - Add your Stripe API keys
    echo    - Add your Printify API token and shop ID
    echo    - Update site configuration
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your API keys and configuration
echo 2. Run 'npm run dev' to start the development server
echo 3. Visit http://localhost:3000 to see your store
echo.
echo For production deployment:
echo - Use Docker: 'docker-compose up -d'
echo - Or build and start: 'npm run build && npm start'
echo.
echo 💾 Happy selling! Your retro gaming store is ready to go!
pause