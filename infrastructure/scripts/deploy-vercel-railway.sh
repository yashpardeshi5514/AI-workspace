#!/bin/bash

# Deploy to Vercel + Railway
# Usage: ./deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-production}
VERCEL_ORG_ID=${VERCEL_ORG_ID}
VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID}
RAILWAY_TOKEN=${RAILWAY_TOKEN}

echo "🚀 Deploying to $ENVIRONMENT"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
check_prerequisites() {
  echo "${BLUE}Checking prerequisites...${NC}"

  if ! command -v vercel &> /dev/null; then
    echo "${RED}✗ Vercel CLI not installed${NC}"
    echo "  Install: npm i -g vercel"
    exit 1
  fi

  if ! command -v git &> /dev/null; then
    echo "${RED}✗ Git not installed${NC}"
    exit 1
  fi

  echo "${GREEN}✓ Prerequisites checked${NC}"
  echo ""
}

# Build all packages
build_all() {
  echo "${BLUE}Building packages...${NC}"
  npm run build --workspaces
  echo "${GREEN}✓ Build complete${NC}"
  echo ""
}

# Run tests
run_tests() {
  echo "${BLUE}Running tests...${NC}"
  npm run test
  echo "${GREEN}✓ Tests passed${NC}"
  echo ""
}

# Deploy frontend to Vercel
deploy_frontend() {
  echo "${BLUE}Deploying frontend to Vercel...${NC}"

  cd frontend

  if [ "$ENVIRONMENT" = "staging" ]; then
    vercel deploy --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
  else
    vercel deploy --prod --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
  fi

  echo "${GREEN}✓ Frontend deployed${NC}"
  cd ..
  echo ""
}

# Deploy backend to Railway
deploy_backend() {
  echo "${BLUE}Deploying backend to Railway...${NC}"

  cd backend

  if [ "$ENVIRONMENT" = "staging" ]; then
    railway deploy --service backend --environment staging
  else
    railway deploy --service backend --environment production
  fi

  echo "${GREEN}✓ Backend deployed${NC}"
  cd ..
  echo ""
}

# Run health checks
health_check() {
  echo "${BLUE}Running health checks...${NC}"

  if [ "$ENVIRONMENT" = "staging" ]; then
    API_URL="https://staging-api.example.com"
  else
    API_URL="https://api.example.com"
  fi

  # Wait for deployment
  sleep 10

  # Check API health
  if curl -f "$API_URL/health" > /dev/null 2>&1; then
    echo "${GREEN}✓ API health check passed${NC}"
  else
    echo "${RED}✗ API health check failed${NC}"
    exit 1
  fi

  echo ""
}

# Notify Slack
notify_slack() {
  echo "${BLUE}Sending Slack notification...${NC}"

  if [ -z "$SLACK_WEBHOOK" ]; then
    echo "  (Slack webhook not configured)"
    return
  fi

  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  curl -X POST $SLACK_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d "{
      \"text\": \"Deployment: $ENVIRONMENT\",
      \"attachments\": [{
        \"color\": \"good\",
        \"fields\": [
          {\"title\": \"Environment\", \"value\": \"$ENVIRONMENT\", \"short\": true},
          {\"title\": \"Status\", \"value\": \"✓ Deployed\", \"short\": true},
          {\"title\": \"Timestamp\", \"value\": \"$TIMESTAMP\"}
        ]
      }]
    }"

  echo "${GREEN}✓ Notification sent${NC}"
  echo ""
}

# Main execution
main() {
  check_prerequisites
  build_all
  run_tests

  echo "${BLUE}Starting $ENVIRONMENT deployment...${NC}"
  echo ""

  deploy_frontend
  deploy_backend
  health_check
  notify_slack

  echo "${GREEN}✅ Deployment complete!${NC}"
  echo ""
  echo "URLs:"
  if [ "$ENVIRONMENT" = "staging" ]; then
    echo "  Frontend: https://staging.example.com"
    echo "  Backend: https://staging-api.example.com"
  else
    echo "  Frontend: https://app.example.com"
    echo "  Backend: https://api.example.com"
  fi
}

main
