#!/bin/bash

# MedChain Mobile - Startup Script
echo "🏥 Starting MedChain Mobile App..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    npm install -g @expo/cli
fi

echo "✅ Expo CLI version: $(expo --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if backend is running (optional)
echo "🔍 Checking backend connectivity..."
if curl -s http://localhost:8000/health &> /dev/null; then
    echo "✅ Backend server is running on http://localhost:8000"
else
    echo "⚠️  Backend server is not running on http://localhost:8000"
    echo "   Make sure to start the MedChain backend first:"
    echo "   cd ../backend && python main.py"
    echo ""
fi

echo ""
echo "🚀 Starting MedChain Mobile development server..."
echo "📱 You can now:"
echo "   - Press 'i' to open iOS simulator"
echo "   - Press 'a' to open Android emulator"
echo "   - Press 'w' to open in web browser"
echo "   - Scan QR code with Expo Go app on your phone"
echo ""

# Start the development server
npm start
