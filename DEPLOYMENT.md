# Deployment Guide

## Local Development

```bash
# Start with docker-compose (includes all services)
docker-compose up -d

# Access
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Mongo: localhost:27017
- Redis: localhost:6379
- Chroma: http://localhost:8000
```

## Production Deployment

### Prerequisites
- Docker & Docker Compose installed
- Environment variables configured (.env.production)
- OpenAI API key
- Domain/IP address

### Quick Start

```bash
# 1. Configure environment
cp .env.production .env
# Edit .env with production values

# 2. Deploy
bash infrastructure/scripts/deploy.sh

# 3. View logs
bash infrastructure/scripts/logs.sh

# 4. Stop services
bash infrastructure/scripts/stop.sh
```

### Docker Compose Services

```yaml
- mongo        (Database)
- redis        (Cache)
- chroma       (Vector DB)
- backend      (API Server on :3001)
- frontend     (Next.js on :3000)
- nginx        (Reverse proxy on :80)
```

### Vercel Deployment (Frontend)

```bash
# Connect repo to Vercel
# Set environment variables:
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com

# Deploy
vercel deploy
```

### Railway Deployment (Backend)

```bash
# Connect GitHub repo
# Create service for backend
# Configure environment:
MONGODB_URI=<your-mongodb-uri>
REDIS_URL=<your-redis-url>
OPENAI_API_KEY=<your-api-key>
JWT_SECRET=<generate-secure-secret>

# Railway auto-deploys on push
```

### Self-Hosted with Digital Ocean / AWS

```bash
# 1. Create VM (Ubuntu 22.04)
# 2. Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Clone repo
git clone <repo-url>
cd ai-workspace

# 4. Copy env
cp .env.production .env
nano .env  # Edit with production values

# 5. Deploy
bash infrastructure/scripts/deploy.sh

# 6. Set up SSL with Certbot
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

### SSL/HTTPS Setup

Update `infrastructure/default.conf`:

```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring

### Health Checks
```bash
curl http://localhost:3001/health
```

### Database
```bash
docker exec ai-workspace-mongo mongosh
```

### Logs
```bash
docker logs ai-workspace-backend -f
docker logs ai-workspace-frontend -f
docker logs ai-workspace-nginx -f
```

### Resource Usage
```bash
docker stats
```

## Scaling

### Horizontal Scaling
- Run multiple backend containers with load balancing
- Nginx handles distribution
- Shared MongoDB/Redis for state

### Vertical Scaling
- Increase container resource limits in docker-compose.prod.yml
- Add more MongoDB replicas for HA

## Environment Variables

```env
# Required
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=<min-32-chars>

# Database
MONGODB_URI=mongodb://mongo:27017/ai-workspace

# Optional
REDIS_URL=redis://redis:6379
LOG_LEVEL=info
MAX_FILE_SIZE=52428800
```

## Troubleshooting

### Backend won't start
```bash
docker logs ai-workspace-backend
# Check: MongoDB connection, API keys, ports
```

### High memory usage
```bash
docker stats ai-workspace-mongo
# Check: MongoDB query optimization, indexes
```

### WebSocket issues
```bash
# Check nginx config includes socket.io proxy settings
# Verify: proxy_read_timeout 86400
```

## Backup & Restore

### Backup MongoDB
```bash
docker exec ai-workspace-mongo mongodump \
  --uri="mongodb://localhost:27017/ai-workspace" \
  --out=/backup
```

### Restore MongoDB
```bash
docker exec ai-workspace-mongo mongorestore \
  --uri="mongodb://localhost:27017/ai-workspace" \
  /backup/ai-workspace
```
