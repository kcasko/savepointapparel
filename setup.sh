#!/bin/bash

# Save Point Apparel Setup Script
echo "🎮 Setting up Save Point Apparel Custom Store..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your configuration values"
    echo "   - Add your Stripe API keys"
    echo "   - Add your Printify API token and shop ID"
    echo "   - Update site configuration"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys and configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your store"
echo ""
echo "For production deployment:"
echo "- Use Docker: 'docker-compose up -d'"
echo "- Or build and start: 'npm run build && npm start'"
echo ""
echo "💾 Happy selling! Your retro gaming store is ready to go!"