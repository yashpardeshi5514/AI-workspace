# Backend
FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* yarn.lock* ./

# Copy workspace packages
COPY backend ./backend
COPY ai-services ./ai-services
COPY shared ./shared

# Install dependencies
RUN npm ci --omit=dev

# Build TypeScript
RUN npm run build --workspaces

EXPOSE 3001

CMD ["npm", "run", "start", "--workspace=backend"]
