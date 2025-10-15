#!/bin/bash

# HealthVault Web Frontend - Deployment Setup Script

echo "🚀 Setting up HealthVault Web Frontend for Render deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Check if API key is set
if grep -q "your-api-key-here" .env; then
    echo "⚠️  Warning: Please update your API key in .env file before deploying!"
    echo "   Edit .env and replace 'your-api-key-here' with your actual API key."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test build
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Your app is ready for deployment."
    echo ""
    echo "📋 Next steps:"
    echo "1. Update .env with your actual API key"
    echo "2. Push your code to GitHub/GitLab/Bitbucket"
    echo "3. Connect your repository to Render"
    echo "4. Set environment variables in Render dashboard"
    echo "5. Deploy!"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi