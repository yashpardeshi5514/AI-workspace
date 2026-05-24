#!/bin/bash

# Setup script for Vercel + Railway deployment
# Run this once to configure everything

set -e

echo "🔧 AI Workspace Deployment Setup"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: GitHub Repos
echo "${BLUE}Step 1: GitHub Repositories${NC}"
echo "You need to create two GitHub repositories:"
echo "  1. ai-workspace-frontend"
echo "  2. ai-workspace-backend"
echo ""
read -p "Enter your GitHub username: " GITHUB_USER
read -p "Have you created both repos? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Please create the repositories first"
  exit 1
fi
echo "${GREEN}✓ GitHub repos ready${NC}"
echo ""

# Step 2: MongoDB Atlas
echo "${BLUE}Step 2: MongoDB Atlas${NC}"
read -p "Enter MongoDB connection string: " MONGODB_URI
echo "${GREEN}✓ MongoDB configured${NC}"
echo ""

# Step 3: Redis Cloud
echo "${BLUE}Step 3: Redis Cloud${NC}"
read -p "Enter Redis URL: " REDIS_URL
echo "${GREEN}✓ Redis configured${NC}"
echo ""

# Step 4: OpenAI
echo "${BLUE}Step 4: OpenAI API${NC}"
read -sp "Enter OpenAI API key: " OPENAI_API_KEY
echo ""
echo "${GREEN}✓ OpenAI configured${NC}"
echo ""

# Step 5: Vercel
echo "${BLUE}Step 5: Vercel Setup${NC}"
echo "Installing Vercel CLI..."
npm install -g vercel
echo ""
echo "Logging into Vercel..."
vercel login
echo ""
read -p "Enter Vercel organization ID: " VERCEL_ORG_ID
echo "${GREEN}✓ Vercel configured${NC}"
echo ""

# Step 6: Railway
echo "${BLUE}Step 6: Railway Setup${NC}"
echo "Installing Railway CLI..."
npm install -g @railway/cli
echo ""
echo "Logging into Railway..."
railway login
echo ""
read -p "Enter Railway project ID: " RAILWAY_PROJECT_ID
echo "${GREEN}✓ Railway configured${NC}"
echo ""

# Step 7: Domain
echo "${BLUE}Step 7: Custom Domain${NC}"
read -p "Enter your domain (e.g., example.com): " DOMAIN
echo "${GREEN}✓ Domain configured${NC}"
echo ""

# Create .env.deployment file
cat > infrastructure/.env.deployment << EOF
# Vercel
VERCEL_ORG_ID=$VERCEL_ORG_ID
VERCEL_TOKEN=$(vercel whoami --token 2>/dev/null || echo "REQUIRED")

# Railway
RAILWAY_TOKEN=$(railway whoami --token 2>/dev/null || echo "REQUIRED")
RAILWAY_PROJECT_ID=$RAILWAY_PROJECT_ID

# Database & Cache
MONGODB_URI=$MONGODB_URI
REDIS_URL=$REDIS_URL

# API Keys
OPENAI_API_KEY=$OPENAI_API_KEY

# Domain
DOMAIN=$DOMAIN
API_DOMAIN=api.$DOMAIN

# Generated
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
EOF

echo "${BLUE}Creating environment file...${NC}"
echo "${GREEN}✓ .env.deployment created${NC}"
echo ""

# Create .env.vercel
cat > frontend/.env.vercel << EOF
NEXT_PUBLIC_API_URL=https://api.$DOMAIN
NEXT_PUBLIC_WS_URL=wss://api.$DOMAIN
EOF

echo "${GREEN}✓ .env.vercel created${NC}"
echo ""

# Final checklist
echo "${YELLOW}📋 Deployment Checklist:${NC}"
echo ""
echo "Frontend (Vercel):"
echo "  [ ] Connect GitHub repo (ai-workspace-frontend)"
echo "  [ ] Set environment variables"
echo "  [ ] Deploy"
echo ""
echo "Backend (Railway):"
echo "  [ ] Connect GitHub repo (ai-workspace-backend)"
echo "  [ ] Set environment variables"
echo "  [ ] Deploy"
echo ""
echo "Domain Setup:"
echo "  [ ] Point domain to Vercel nameservers"
echo "  [ ] Add CNAME for api subdomain"
echo "  [ ] Wait for DNS propagation (24-48h)"
echo ""
echo "Testing:"
echo "  [ ] Test frontend at https://$DOMAIN"
echo "  [ ] Test backend at https://api.$DOMAIN/health"
echo "  [ ] Test login/signup"
echo "  [ ] Test chat functionality"
echo ""
echo "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Source the environment file: source infrastructure/.env.deployment"
echo "2. Deploy frontend: vercel deploy --prod"
echo "3. Deploy backend: railway deploy"
echo "4. Configure custom domains"
echo "5. Test everything works"
