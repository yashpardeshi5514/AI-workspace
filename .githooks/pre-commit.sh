#!/bin/bash

# Pre-commit hook - runs before committing
# Install: cp pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

set -e

echo "🔍 Running pre-commit checks..."

# Lint
echo "📋 Linting..."
npm run lint --workspaces || (echo "❌ Lint failed"; exit 1)

# Type check
echo "🔷 Type checking..."
npm run build --workspaces || (echo "❌ Type check failed"; exit 1)

# Format check
echo "💅 Format checking..."
npx prettier --check . || (echo "⚠️  Code not formatted (run: npm run format)"; exit 1)

# Unit tests
echo "🧪 Running tests..."
npm run test --workspaces || (echo "❌ Tests failed"; exit 1)

echo "✅ All checks passed!"
