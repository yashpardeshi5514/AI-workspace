# CI/CD Pipeline Guide

## Overview

Complete automated testing, linting, building, and deployment pipeline using GitHub Actions.

---

## Pipeline Stages

### Stage 1: Code Quality ✅
- **ESLint** — Code style & best practices
- **Prettier** — Code formatting
- **TypeScript** — Type checking
- **Runs on:** All PRs and commits

### Stage 2: Testing ✅
- **Unit tests** — Jest with coverage
- **Integration tests** — Database + services
- **Coverage reporting** — Codecov
- **Threshold:** 70% coverage required
- **Services:** MongoDB, Redis (mocked)

### Stage 3: Security ✅
- **Trivy** — Vulnerability scanning
- **NPM audit** — Dependency vulnerabilities
- **GitHub Security** — SARIF upload
- **Non-blocking** (warning level)

### Stage 4: Build Docker Images ✅
- **Multi-image build:**
  - Frontend (Next.js)
  - Backend (Express)
  - Nginx (Reverse proxy)
- **Registry:** GitHub Container Registry (ghcr.io)
- **Tagging:**
  - Branch: `develop`, `main`
  - Semver: `v1.2.3`, `v1.2`, `v1`
  - Commit: SHA
  - Latest: on main branch

### Stage 5: Deploy to Staging ✅
- **Trigger:** Push to `develop` branch
- **Target:** Staging environment
- **Steps:**
  1. SSH to staging server
  2. Update docker-compose.yml
  3. Pull images
  4. Restart services
  5. Health check (30 attempts, 10s intervals)
  6. Smoke tests (Playwright)
- **Rollback:** Automatic on health check failure

### Stage 6: Deploy to Production ✅
- **Trigger:** Push to `main` branch
- **Target:** Production environment
- **Protection:** Concurrency lock (one deploy at a time)
- **Steps:**
  1. Create GitHub deployment
  2. Backup database
  3. SSH to prod server
  4. Update services
  5. Run migrations
  6. Health check
  7. Rollback on failure
  8. Update deployment status
- **Notifications:** Slack

### Stage 7: Notifications ✅
- **Slack message** with pipeline status
- **Links:** GitHub Actions logs
- **Triggered:** On pipeline completion

---

## Setup Instructions

### 1. Local Setup

**Install pre-commit hooks:**
```bash
npm run setup-hooks
```

**Run tests locally:**
```bash
npm test
npm test:watch
npm test:coverage
```

**Lint code:**
```bash
npm run lint
npm run lint:fix
npm run format
```

### 2. GitHub Secrets

Add these to GitHub Settings → Secrets:

**Staging Deployment:**
```
STAGING_HOST          = staging.example.com
STAGING_USER          = deploy
STAGING_DEPLOY_KEY    = <private-key>
```

**Production Deployment:**
```
PROD_HOST             = app.example.com
PROD_USER             = deploy
PROD_DEPLOY_KEY       = <private-key>
PROD_DB_HOST          = db.example.com
PROD_DB_USER          = admin
PROD_DB_PASS          = <password>
PROD_DATABASE_URL     = mongodb://...
```

**Notifications:**
```
SLACK_WEBHOOK         = https://hooks.slack.com/...
```

### 3. Create Deploy Keys

**On staging/prod server:**
```bash
ssh-keygen -t ed25519 -f deploy_key -N ""
cat deploy_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Copy private key to GitHub secrets:**
```bash
cat deploy_key | base64
# Paste to STAGING_DEPLOY_KEY / PROD_DEPLOY_KEY
```

---

## Workflow Files

**Main workflow:** `.github/workflows/cicd.yml`

**Triggers:**
```yaml
on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]
```

---

## Environment Variables

**Development:**
```
NODE_ENV=development
DEBUG=*
```

**Testing:**
```
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/ai-workspace-test
REDIS_URL=redis://localhost:6379
JWT_SECRET=test-secret
OPENAI_API_KEY=test-openai-key
```

**Staging:**
```
NODE_ENV=staging
# From GitHub secrets
```

**Production:**
```
NODE_ENV=production
# From GitHub secrets
```

---

## Test Coverage

### Unit Tests
```bash
npm test

# Watch mode (TDD)
npm test:watch

# With coverage
npm test:coverage
```

**Coverage Threshold:**
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

### Integration Tests
```bash
# Run with services
docker-compose up -d
npm test -- auth.integration.test.ts
```

**Services Required:**
- MongoDB
- Redis

### Smoke Tests
```bash
# Production smoke tests
npx playwright test tests/smoke.spec.ts --project=prod
```

---

## Pre-Commit Hooks

**Automatic checks before commit:**
```bash
npm run precommit
```

**Checks:**
1. ESLint (fixes automatically)
2. Prettier (formats automatically)
3. Type check
4. Unit tests

**Configuration:** `.githooks/pre-commit.sh`

**Lint-staged config:** `package.json`

---

## Code Quality Tools

### ESLint
```bash
npm run lint                 # Check
npm run lint:fix            # Auto-fix
```

**Config:** `.eslintrc.json`

### Prettier
```bash
npm run format              # Format all files
npm run format:check        # Check formatting
```

**Config:** `.prettierrc`

### Type Check
```bash
npm run type-check          # TypeScript
```

---

## Database Migrations

**Run migrations:**
```bash
npm run migrate:up
```

**Rollback:**
```bash
npm run migrate:down
```

**Create new migration:**
```bash
# backend/migrations/NNN_description.ts
export async function migrate() {
  // Migration code
}

export async function rollback() {
  // Rollback code
}
```

**Location:** `backend/migrations/`

---

## Deployment Process

### Staging Flow
```
Push to develop
    ↓
Quality checks (lint, type-check)
    ↓
Run tests + coverage
    ↓
Security scan
    ↓
Build Docker images
    ↓
Deploy to staging
    ↓
Health check
    ↓
Smoke tests
    ↓
✓ Done (or rollback)
```

### Production Flow
```
Push to main
    ↓
All staging checks
    ↓
Build Docker images
    ↓
Backup database
    ↓
Deploy to production
    ↓
Run migrations
    ↓
Health check
    ↓
Update GitHub deployment
    ↓
Slack notification
    ↓
✓ Done (or rollback)
```

---

## Rollback Strategy

### Automatic Rollback
- Health check fails (30 attempts)
- Deployment automatically reverts to previous image
- Database rollback skipped (destructive)

### Manual Rollback
```bash
# SSH to server
ssh deploy@app.example.com

# Pull previous image
docker pull ghcr.io/org/repo/backend:main-prev

# Update compose
sed -i 's/backend:.*/backend:main-prev/' docker-compose.yml

# Restart
docker-compose up -d
```

---

## Monitoring & Logs

### GitHub Actions Logs
```
GitHub → Actions → Run logs
```

### Deployment Logs
```bash
ssh deploy@app.example.com
docker logs ai-workspace-backend -f
docker logs ai-workspace-frontend -f
docker logs ai-workspace-nginx -f
```

### Slack Notifications
```
CI/CD Pipeline Status
├─ Status: ✓ Passed / ✗ Failed
├─ Branch: main / develop
└─ Commit: sha1234567
```

---

## Secrets Management

**GitHub Secrets:**
```
Settings → Secrets and variables → Actions
```

**Never commit:**
- `.env` files
- Private keys
- API keys
- Database passwords

**Safe practices:**
- Use GitHub Secrets for all sensitive data
- Rotate keys regularly
- Use deploy-specific keys
- Different keys per environment

---

## Performance Optimization

**Build Cache:**
- Docker layer caching
- Registry cache for artifacts
- Dependency cache (npm)

**Parallel Jobs:**
- Quality checks run in parallel
- Tests run in parallel
- Build runs after tests pass

**Estimated Times:**
- Quality: 2-3 min
- Tests: 3-5 min
- Security: 1 min
- Build: 5-10 min
- Deploy: 2-5 min
- **Total:** ~15-25 min

---

## Troubleshooting

### Tests Failing
```bash
# Run locally first
npm test
npm test:watch

# Check coverage
npm test:coverage

# Debug specific test
npm test -- auth.integration.test.ts --verbose
```

### Deployment Stuck
```bash
# Cancel workflow
GitHub → Actions → Click workflow → Cancel

# Check server
ssh deploy@host
docker-compose ps
docker-compose logs backend
```

### Health Check Failing
```bash
# Verify endpoint
curl http://localhost:3001/health

# Check logs
docker logs ai-workspace-backend

# Manual health check
docker exec ai-workspace-backend npm run health
```

---

## Best Practices

✅ **DO:**
- Write tests for new features
- Keep migrations reversible
- Use feature branches
- Review PRs before merge
- Test locally before pushing
- Keep secrets in GitHub Secrets

❌ **DON'T:**
- Skip tests in CI
- Commit secrets
- Force push to main
- Manual deployments
- Ignore failing checks
- Deploy without tests

---

## Extending the Pipeline

### Add New Test Step
```yaml
- name: E2E Tests
  run: npm run test:e2e
```

### Add New Linter
```yaml
- name: Spell Check
  run: npm run spell-check
```

### Add New Deployment Target
```yaml
deploy-canary:
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main'
```

---

## Commands Reference

```bash
# Development
npm run dev              # Start all services
npm run build            # Build all packages

# Testing
npm test                 # Run tests
npm test:watch          # Watch mode
npm test:coverage       # Coverage report

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run format           # Format code
npm run format:check     # Check formatting
npm run type-check       # TypeScript check

# Database
npm run migrate:up       # Run migrations
npm run migrate:down     # Rollback

# Git Hooks
npm run setup-hooks      # Install pre-commit hooks
npm run precommit        # Run pre-commit manually

# CI
npm run ci              # Full CI pipeline (lint + test + coverage)
```

---

**Production-Grade CI/CD Pipeline Complete!**

Automated testing, building, and deployment with:
- Multi-stage pipeline
- Staging & production deployment
- Automatic rollback
- Health checks
- Smoke tests
- Security scanning
- Pre-commit hooks
- Database migrations
- Slack notifications
