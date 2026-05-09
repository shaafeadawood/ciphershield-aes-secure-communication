#!/bin/bash
# CipherShield Advanced Frontend - Setup Script

echo "🚀 CipherShield Advanced Frontend - Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo -e "${YELLOW}Available commands:${NC}"
echo "  npm run dev     - Start development server at http://localhost:5173"
echo "  npm run build   - Build for production"
echo "  npm run preview - Preview production build"
echo ""
echo -e "${BLUE}Make sure the backend is running:${NC}"
echo "  cd ../backend"
echo "  python app.py"
echo ""
echo "🎯 CipherShield Advanced will be available at: http://localhost:5173"
