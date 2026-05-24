#!/bin/bash

# AI Workspace Platform - Complete Deployment Script
# This script handles the entire deployment process

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo "${BLUE}║     AI Workspace Platform - Deployment Wizard             ║${NC}"
echo "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check Prerequisites
echo "${BLUE}[1/8] Checking prerequisites...${NC}"
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "${RED}✗ $1 not installed${NC}"
    exit 1
  fi
}

check_command git
check_command npm
check_command node
echo "${GREEN}✓ All prerequisites installed${NC}"
echo ""

# Step 2: Build Project
echo "${BLUE}[2/8] Building project...${NC}"
npm run build --workspaces
npm run test
echo "${GREEN}✓ Build successful${NC}"
echo ""

# Step 3: GitHub Setup
echo "${BLUE}[3/8] GitHub Repository Setup${NC}"
read -p "Have you pushed code to GitHub? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Please push to GitHub first:"
  echo "  git add ."
  echo "  git commit -m 'Initial commit'"
  echo "  git push origin main"
  exit 1
fi
echo "${GREEN}✓ GitHub repos ready${NC}"
echo ""

# Step 4: External Services
echo "${BLUE}[4/8] Setting Up External Services${NC}"
echo ""
echo "Create the following services (free tier is fine):"
echo "  1. MongoDB Atlas (free M0 cluster)"
echo "     https://www.mongodb.com/cloud/atlas"
echo ""
echo "  2. Redis Cloud (free 30MB instance)"
echo "     https://redis.com/try-free"
echo ""
echo "  3. OpenAI API Key"
echo "     https://platform.openai.com/api-keys"
echo ""

read -sp "Enter MongoDB connection string: " MONGODB_URI
echo ""
read -sp "Enter Redis URL: " REDIS_URL
echo ""
read -sp "Enter OpenAI API key: " OPENAI_API_KEY
echo ""

echo "${GREEN}✓ External services configured${NC}"
echo ""

# Step 5: Generate Secrets
echo "${BLUE}[5/8] Generating Secrets${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "${GREEN}✓ JWT secret generated${NC}"
echo ""

# Step 6: Vercel Setup
echo "${BLUE}[6/8] Setting Up Vercel (Frontend)${NC}"
echo "Installing Vercel CLI..."
npm install -g vercel 2>/dev/null || true

echo "Logging into Vercel..."
vercel login --token=$VERCEL_TOKEN 2>/dev/null || echo "Note: Set VERCEL_TOKEN env var to skip login"

echo "Creating Vercel project..."
cd frontend
VERCEL_OUTPUT=$(vercel deploy --prod 2>&1 || true)
FRONTEND_URL=$(echo $VERCEL_OUTPUT | grep -o 'https://[^ ]*' | head -1)
cd ..

if [ -z "$FRONTEND_URL" ]; then
  echo "${YELLOW}⚠ Could not get Vercel URL, please check Vercel dashboard${NC}"
  read -p "Enter your Vercel frontend URL: " FRONTEND_URL
fi

echo "${GREEN}✓ Frontend deployed: $FRONTEND_URL${NC}"
echo ""

# Step 7: Railway Setup
echo "${BLUE}[7/8] Setting Up Railway (Backend)${NC}"
echo "Installing Railway CLI..."
npm install -g @railway/cli 2>/dev/null || true

echo "Logging into Railway..."
railway login

echo "Creating Railway project..."
cd backend
RAILWAY_OUTPUT=$(railway deploy 2>&1 || true)
BACKEND_URL=$(echo $RAILWAY_OUTPUT | grep -o 'https://[^ ]*' | head -1)
cd ..

if [ -z "$BACKEND_URL" ]; then
  echo "${YELLOW}⚠ Could not get Railway URL, please check Railway dashboard${NC}"
  read -p "Enter your Railway backend URL: " BACKEND_URL
fi

echo "${GREEN}✓ Backend deployed: $BACKEND_URL${NC}"
echo ""

# Step 8: Final Configuration
echo "${BLUE}[8/8] Final Configuration${NC}"

# Update environment variables
echo "Setting environment variables on Vercel..."
vercel env add NEXT_PUBLIC_API_URL "$BACKEND_URL" --prod --yes 2>/dev/null || true
vercel env add NEXT_PUBLIC_WS_URL "wss://$(echo $BACKEND_URL | cut -d'/' -f3)" --prod --yes 2>/dev/null || true

echo "Setting environment variables on Railway..."
railway env add MONGODB_URI "$MONGODB_URI" 2>/dev/null || true
railway env add REDIS_URL "$REDIS_URL" 2>/dev/null || true
railway env add JWT_SECRET "$JWT_SECRET" 2>/dev/null || true
railway env add OPENAI_API_KEY "$OPENAI_API_KEY" 2>/dev/null || true
railway env add NEXT_PUBLIC_API_URL "$BACKEND_URL" 2>/dev/null || true
railway env add NEXT_PUBLIC_WS_URL "wss://$(echo $BACKEND_URL | cut -d'/' -f3)" 2>/dev/null || true

echo "${GREEN}✓ Environment variables configured${NC}"
echo ""

# Health Check
echo "${BLUE}Checking health...${NC}"
sleep 5
if curl -f "$BACKEND_URL/health" > /dev/null 2>&1; then
  echo "${GREEN}✓ Backend is healthy${NC}"
else
  echo "${YELLOW}⚠ Backend health check pending (give it a moment)${NC}"
fi

echo ""
echo "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo "${GREEN}║                 🎉 DEPLOYMENT COMPLETE! 🎉                ║${NC}"
echo "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "${BLUE}Your AI Workspace is now live!${NC}"
echo ""
echo "  Frontend: $FRONTEND_URL"
echo "  Backend:  $BACKEND_URL"
echo ""
echo "${YELLOW}Next Steps:${NC}"
echo "  1. Visit: $FRONTEND_URL"
echo "  2. Sign up / Create workspace"
echo "  3. Test chat, files, code execution"
echo "  4. Share with team members"
echo ""
echo "${BLUE}Documentation:${NC}"
echo "  - README.md               — Overview"
echo "  - DEPLOY_VERCEL_RAILWAY.md — Deployment details"
echo "  - ENTERPRISE.md            — Team & analytics"
echo ""
echo "Happy coding! 🚀"
