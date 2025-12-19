#!/bin/bash

# Deployment Setup Script for Students
# Run this after setting up your backend URL

echo "🚀 PUP Anonymous Chat - Deployment Setup"
echo "========================================"

# Check if backend URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your backend URL"
    echo "Usage: ./setup-deployment.sh https://your-backend-url"
    echo ""
    echo "Examples:"
    echo "  Railway: https://your-app.up.railway.app"
    echo "  Render:  https://your-app.onrender.com"
    echo "  Vercel:  https://your-app.vercel.app"
    exit 1
fi

BACKEND_URL=$1
echo "✅ Backend URL: $BACKEND_URL"

# Update the frontend code
echo "📝 Updating frontend configuration..."
sed -i "s|http://localhost:3001|$BACKEND_URL|g" src/app/App.tsx

echo "✅ Configuration updated!"
echo ""
echo "📋 Next Steps:"
echo "1. Commit and push these changes to GitHub"
echo "2. GitHub Actions will automatically deploy to GitHub Pages"
echo "3. Test your deployed app!"
echo ""
echo "🌐 Your app will be available at:"
echo "   https://yourusername.github.io/repository-name"
echo ""
echo "🎉 Happy deploying!"