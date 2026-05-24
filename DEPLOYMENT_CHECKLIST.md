# Deployment Checklist

## Pre-Deployment (Do Once)

### Services Setup
- [ ] Create MongoDB Atlas account
  - [ ] Create M0 sandbox cluster
  - [ ] Create database user
  - [ ] Get connection string
  - [ ] Whitelist IPs
  - [ ] Backup enabled

- [ ] Create Redis Cloud account
  - [ ] Create free Redis instance
  - [ ] Get connection URL
  - [ ] Test connection

- [ ] Create Chroma account
  - [ ] Create project
  - [ ] Get API key
  - [ ] Test connection

- [ ] Create OpenAI account
  - [ ] Get API key
  - [ ] Set usage limits
  - [ ] Test API access

### GitHub
- [ ] Create GitHub repos:
  - [ ] ai-workspace-frontend
  - [ ] ai-workspace-backend
- [ ] Push code to repos
- [ ] Configure branch protection (main)

### Vercel
- [ ] Create Vercel account
- [ ] Connect GitHub
- [ ] Create project for frontend
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Enable preview deployments

### Railway
- [ ] Create Railway account
- [ ] Create project
- [ ] Connect GitHub backend repo
- [ ] Configure deployment settings
- [ ] Set environment variables
- [ ] Enable auto-deploy

### Domain
- [ ] Register domain
- [ ] Add to Vercel (wait for DNS)
- [ ] Add API subdomain to Railway
- [ ] Verify SSL certificates

---

## First Deployment

### Frontend Deployment
- [ ] Code builds without errors
- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] Next.js production build works
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Tests pass (if any)

### Backend Deployment
- [ ] Code builds without errors
- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] Connects to MongoDB
- [ ] Connects to Redis
- [ ] Connects to Chroma
- [ ] API starts without errors
- [ ] Health endpoint responds

### Testing After Deploy
- [ ] Frontend loads (check <2s)
- [ ] Backend responds (/health)
- [ ] WebSocket connects
- [ ] API responds to requests
- [ ] Chat works end-to-end
- [ ] File upload works
- [ ] Code execution works
- [ ] No errors in browser console
- [ ] No errors in backend logs

---

## Production Checklist

### Security
- [ ] SSL/HTTPS enabled
- [ ] Environment variables encrypted
- [ ] No secrets in code
- [ ] Rate limiting configured
- [ ] CORS configured properly
- [ ] Input validation enabled
- [ ] Error messages don't leak details
- [ ] Database backups enabled

### Performance
- [ ] Frontend <2s load time
- [ ] API <500ms response time
- [ ] Database queries optimized
- [ ] Redis caching working
- [ ] CDN enabled (Vercel)
- [ ] Images optimized
- [ ] Minified CSS/JS

### Monitoring
- [ ] Error tracking enabled
- [ ] Logs collecting
- [ ] Health checks working
- [ ] Uptime monitoring enabled
- [ ] Database backups running
- [ ] Performance metrics tracked
- [ ] Alerts configured

### Operations
- [ ] Deployment process documented
- [ ] Rollback plan tested
- [ ] Database migration plan ready
- [ ] Backup/restore tested
- [ ] Scaling plan ready
- [ ] Incident response ready

---

## Post-Deployment (Daily)

### Day 1
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify backups
- [ ] Test all features
- [ ] Check storage usage
- [ ] Verify monitoring alerts

### Week 1
- [ ] Monitor user feedback
- [ ] Track error patterns
- [ ] Analyze performance
- [ ] Review cost
- [ ] Plan scaling if needed
- [ ] Update documentation

### Month 1
- [ ] Analyze usage patterns
- [ ] Plan features
- [ ] Upgrade if needed
- [ ] Review security
- [ ] Plan capacity
- [ ] Review costs

---

## Troubleshooting During Deployment

### Frontend Issues
```bash
# Build fails
npm run build

# Check environment variables
echo $NEXT_PUBLIC_API_URL

# Check Vercel logs
vercel logs --follow

# Redeploy
vercel deploy --prod --force
```

### Backend Issues
```bash
# Check logs
railway logs

# Test locally
npm run dev

# Check environment
railway env list

# Restart service
railway restart
```

### Database Issues
```bash
# Test connection
mongosh "$MONGODB_URI"

# Check Atlas dashboard
# - Status
# - Collections
# - Backups
```

### DNS/Domain Issues
```bash
# Check DNS resolution
nslookup your-domain.com

# Check nameservers
whois your-domain.com

# Wait 24-48 hours for propagation
```

---

## Important URLs to Save

```
# Frontend
https://your-domain.com
https://your-project.vercel.app (backup)

# Backend
https://api.your-domain.com
https://your-project.up.railway.app (backup)

# Monitoring
Vercel: https://vercel.com/dashboard
Railway: https://railway.app/dashboard
MongoDB: https://cloud.mongodb.com
Redis: https://app.redislabs.com
```

---

## Credentials to Store Securely

- [ ] MongoDB connection string
- [ ] Redis URL
- [ ] OpenAI API key
- [ ] JWT secret
- [ ] Vercel token
- [ ] Railway token
- [ ] GitHub access token
- [ ] Domain registrar password

**Store in:**
- GitHub Secrets (for CI/CD)
- 1Password / LastPass (secure vault)
- Environment file (local only, never commit)

---

## Rollback Procedure

**If something goes wrong:**

1. **Stop new traffic:**
   ```bash
   # Vercel
   vercel rollback
   
   # Railway
   railway rollback
   ```

2. **Check logs:**
   ```bash
   vercel logs --follow
   railway logs
   ```

3. **Investigate issue**

4. **Fix and redeploy:**
   ```bash
   git push (fix gets deployed automatically)
   ```

---

## Cost Monitoring

**Check monthly:**
- [ ] Vercel usage
- [ ] Railway usage
- [ ] MongoDB Atlas usage
- [ ] Redis Cloud usage
- [ ] Domain renewal
- [ ] OpenAI API costs

**Set alerts at:**
- Vercel: $50/month
- Railway: $50/month
- MongoDB: Upgrade at 50% of limit
- Redis: Upgrade at 80% of limit

---

## Success Indicators

✅ **Deployment is successful when:**
- Frontend loads without errors
- Backend responds to requests
- Chat functionality works
- File uploads work
- Code execution works
- Real-time collaboration works
- All monitoring is active
- Team has access

✅ **Production is healthy when:**
- <0.1% error rate
- <500ms API response time
- 99.9% uptime
- All backups running
- Zero security incidents
- Users can perform all actions

---

## Support & Help

| Issue | Resource |
|-------|----------|
| Vercel deployment | https://vercel.com/docs |
| Railway deployment | https://docs.railway.app |
| MongoDB issues | https://docs.atlas.mongodb.com |
| Domain setup | Domain registrar support |
| General help | GitHub Issues |

---

**🎉 Ready to deploy!**

Run: `bash infrastructure/scripts/setup-deployment.sh`
