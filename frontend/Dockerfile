# Frontend Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* yarn.lock* ./

# Copy workspace packages
COPY frontend ./frontend
COPY shared ./shared

# Install dependencies
RUN npm ci --omit=dev

# Build Next.js
WORKDIR /app/frontend
RUN npm run build

# Frontend Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install serve to run Next.js in standalone mode
RUN npm install -g serve

# Copy built app
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./.next/static
COPY --from=builder /app/frontend/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
