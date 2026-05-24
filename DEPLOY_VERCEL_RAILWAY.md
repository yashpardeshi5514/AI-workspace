# Deployment Guide: Vercel + Railway

**Estimated Time:** 15-20 minutes  
**Cost:** ~$20-30/month (can be free tier to start)  
**Uptime:** 99.9%+

---

## Architecture

```
Domain (your-domain.com)
    ↓
Vercel (Frontend)          Railway (Backend)
├─ Next.js app            ├─ Express API
├─ Auto-scaling           ├─ Auto-scaling
└─ CDN                     └─ Health monitoring
                                ↓
                          MongoDB Atlas
                          ├─ Managed DB
                          └─ Auto-backup
                                ↓
                          Redis Cloud
                          ├─ Managed Cache
                          └─ Auto-failover
                                ↓
                          Chroma Cloud
                          ├─ Vector DB
                          └─ Scaled search
```

---

## Step 1: Prepare Repositories

### Create GitHub Repos

```bash
# Frontend repo
cd frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-workspace-frontend
git push -u origin main

# Backend repo
cd ../backend
git init
git add .
git commit -m "Initial backend commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-workspace-backend
git push -u origin main
```

Or fork these into your GitHub account.

---

## Step 2: MongoDB Atlas Setup

**Create Free Cluster:**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account
4. Create organization
5. Create project
6. Build a Cluster:
   - Choose **M0 Sandbox** (free)
   - Region: Pick closest to you
   - Cluster name: `ai-workspace`

**Create Database User:**

1. Database Access → Add Database User
   - Username: `ai-workspace`
   - Password: Generate strong password (copy it!)
   - Built-in Role: `Read and write to any database`

**Get Connection String:**

1. Clusters → Connect → Drivers
2. Copy connection string:
   ```
   mongodb+srv://<username>:YOUR_PASSWORD@cluster.mongodb.net/ai-workspace?retryWrites=true&w=majority
   ```
3. Replace `<username>` and `YOUR_PASSWORD` with actual credentials

**Whitelist IPs:**

1. Network Access → Add IP Address
2. Add `0.0.0.0/0` (allow all) for development
3. Production: Use Railway's static IPs only

---

## Step 3: Redis Cloud Setup

**Create Free Redis Instance:**

1. Go to https://redis.com/try-free
2. Create account
3. Create database:
   - Name: `ai-workspace`
   - Region: Pick closest
   - Plan: Free tier

**Get Connection String:**

1. Database → View Details
2. Copy Public endpoint:
   ```
   redis-12345.c123.us-east-1-2.ec2.cloud.redislabs.com:12345
   ```
3. Copy password

**Connection URL:**
```
redis://:PASSWORD@redis-12345.c123.us-east-1-2.ec2.cloud.redislabs.com:12345
```

---

## Step 4: Chroma Cloud Setup

**Create Chroma Account:**

1. Go to https://console.trychroma.com
2. Sign up
3. Create project: `ai-workspace`

**Get API Key:**

1. Settings → API Keys
2. Create new key
3. Copy key and URL

---

## Step 5: Deploy Backend to Railway

**Create Railway Account:**

1. Go to https://railway.app
2. Sign up with GitHub
3. New Project

**Connect GitHub Repo:**

1. New Project → GitHub Repo
2. Select `ai-workspace-backend`
3. Railway auto-detects Node.js
4. Confirm deployment

**Configure Environment Variables:**

1. Project Settings → Variables
2. Add all environment variables:

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-workspace
REDIS_URL=redis://:PASSWORD@redis-host:port
CHROMA_HOST=api.trychroma.com
CHROMA_PORT=443
JWT_SECRET=your-super-secret-key-min-32-chars
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4-turbo
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_WS_URL=wss://api.your-domain.com
FRONTEND_URL=https://your-domain.com
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Deploy:**

1. Railway will auto-deploy on git push
2. View logs: Railway Dashboard
3. Get backend URL: `https://ai-workspace-production.up.railway.app`

---

## Step 6: Deploy Frontend to Vercel

**Create Vercel Account:**

1. Go to https://vercel.com
2. Sign up with GitHub
3. New Project

**Import GitHub Repo:**

1. Import Project → Select `ai-workspace-frontend`
2. Framework: Next.js
3. Root Directory: `frontend` (if monorepo)

**Configure Environment Variables:**

1. Project Settings → Environment Variables
2. Add:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_WS_URL=wss://api.your-domain.com
```

**Deploy:**

1. Click Deploy
2. Wait for build (2-3 min)
3. Get frontend URL: `https://your-project.vercel.app`

---

## Step 7: Connect Custom Domain

### Frontend (Vercel)

1. Project Settings → Domains
2. Add Domain:
   - Enter: `your-domain.com`
   - Type: `A` record
   - Copy Vercel nameservers
3. Add to domain registrar (GoDaddy, Namecheap, etc.)
4. Wait 24-48 hours for DNS propagation

### Backend (Railway)

1. Project Settings → Domains
2. Add Domain:
   - Enter: `api.your-domain.com`
   - Railway provides CNAME
3. Add CNAME to domain registrar:
   ```
   api.your-domain.com CNAME your-project.up.railway.app
   ```
4. Wait for propagation

**Update Environment Variables:**

After domain is live, update:
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_WS_URL=wss://api.your-domain.com
FRONTEND_URL=https://your-domain.com
```

Both will auto-redeploy with new variables.

---

## Step 8: Enable SSL/HTTPS

**Vercel:** Automatic (included)

**Railway:** Automatic (included)

**Custom Domain SSL:**
1. Both Vercel and Railway auto-provision SSL
2. Certificates auto-renew
3. All traffic is HTTPS ✅

---

## Step 9: Testing Deployment

### Health Checks

```bash
# Frontend health
curl https://your-domain.com

# Backend health
curl https://api.your-domain.com/health

# Ready check
curl https://api.your-domain.com/ready
```

### Functionality Tests

1. Open https://your-domain.com
2. Sign up / login
3. Create workspace
4. Upload files
5. Chat with AI
6. Test code execution
7. Test collaboration

### Performance Check

```bash
# Check response time
curl -w "Time: %{time_total}s\n" https://api.your-domain.com/health
```

---

## Step 10: Setup Monitoring

### Railway Monitoring

1. Project Dashboard
2. View logs in real-time
3. CPU/Memory usage
4. Restart on failure (enabled)

### Vercel Monitoring

1. Project Dashboard
2. Analytics → Real-time
3. Deployment history
4. Function execution

### Add Alerts

**Railway:**
1. Settings → Alerts
2. Enable notifications:
   - Deployment failure
   - High CPU usage
   - High memory usage

**Vercel:**
1. Settings → Monitoring
2. Enable error tracking

---

## Step 11: Setup Auto-Deployment

**Both Vercel and Railway auto-deploy on:**
- Push to `main` branch
- No additional config needed

**Disable auto-deploy (if needed):**
1. Project Settings → Git
2. Toggle auto-deployment off

---

## Scaling

### If Traffic Increases

**Frontend (Vercel):**
- Auto-scales automatically
- No action needed
- Pro tier removes serverless cold starts

**Backend (Railway):**
- Upgrade CPU/RAM in settings
- Or use auto-scale feature
- Pay-per-use billing

**Database (MongoDB Atlas):**
- M0 free tier limited to 512MB
- Upgrade to M2 tier ($9/mo) for more

**Cache (Redis):**
- Free tier fine for medium traffic
- Upgrade plan if needed

---

## Environment Variables Summary

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_WS_URL=wss://api.your-domain.com
```

**Backend (Railway Variables):**
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster/db
REDIS_URL=redis://:pass@host:port
JWT_SECRET=<32-char-secret>
OPENAI_API_KEY=your-openai-api-key
CHROMA_HOST=api.trychroma.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_WS_URL=wss://api.your-domain.com
FRONTEND_URL=https://your-domain.com
```

---

## Troubleshooting

### Frontend not loading

```bash
# Check Vercel logs
Vercel Dashboard → Deployments → View logs

# Check build
npm run build (locally)
```

### API connection failing

```bash
# Check Railway logs
Railway Dashboard → Logs

# Test endpoint
curl https://api.your-domain.com/health

# Check CORS
Browser DevTools → Network → Check headers
```

### Database connection error

```bash
# Verify connection string
MongoDB Atlas → Connection → Copy string

# Test locally
MONGODB_URI="..." npm test

# Check whitelist
MongoDB Atlas → Network Access → Add IPs
```

### Slow response times

```bash
# Check database indexes
MongoDB Atlas → Collections → Verify indexes

# Check Railway resources
Railway → Metrics → CPU/Memory

# Upgrade if needed
```

---

## Cost Breakdown

| Service | Free Tier | Pro Tier |
|---------|-----------|----------|
| **Vercel** | ✓ Included | $20/mo |
| **Railway** | $5 credit/mo | Pay as you go |
| **MongoDB** | 512MB | $9/mo (M2) |
| **Redis** | 30MB | $15/mo |
| **OpenAI** | $0 (credits) | Variable |
| **Domain** | Free | $10-15/year |
| **Total** | ~$10-15/year | ~$50-100/mo |

**Cost at Scale:**
- 10K users/mo: ~$50-100
- 100K users/mo: ~$200-500
- 1M users/mo: ~$1000-5000

---

## Monitoring Checklist

- [ ] Frontend loads in <2s
- [ ] Backend responds in <500ms
- [ ] Chat streaming works
- [ ] File upload works
- [ ] Code execution works
- [ ] No error logs in Railway
- [ ] Database backups working
- [ ] SSL certificate valid

---

## Next Steps

### Day 1-7: Soft Launch
- Invite beta users
- Monitor logs
- Fix bugs
- Gather feedback

### Week 2-4: Iteration
- Add analytics
- Optimize performance
- Scale infrastructure
- Add features

### Month 2+: Growth
- Marketing launch
- Paid tier
- Team collaboration
- Enterprise features

---

## Support & Documentation

| Topic | Link |
|-------|------|
| Vercel Docs | https://vercel.com/docs |
| Railway Docs | https://docs.railway.app |
| MongoDB Atlas | https://docs.atlas.mongodb.com |
| Redis Cloud | https://docs.redis.com/latest/rc |

---

## Security Checklist

- [x] HTTPS/SSL enabled
- [x] Environment variables secured
- [x] Database credentials protected
- [x] JWT secret strong
- [x] API keys stored safely
- [x] CORS configured
- [x] Rate limiting ready
- [x] Input validation enabled

---

**🎉 Your AI Workspace is now LIVE!**

**URLs:**
- Frontend: https://your-domain.com
- Backend: https://api.your-domain.com
- Health: https://api.your-domain.com/health

**Next:** Share with users, monitor, iterate!
