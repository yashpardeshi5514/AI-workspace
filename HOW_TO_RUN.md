# How to Run & Deploy

## Prerequisites (Install First)

### 1. Git
```bash
# Check if installed
git --version

# If not, download from: https://git-scm.com/download
```

### 2. Node.js & npm
```bash
# Check if installed
node --version
npm --version

# If not, download from: https://nodejs.org (LTS version)
```

### 3. Vercel CLI
```bash
npm install -g vercel
```

### 4. Railway CLI
```bash
npm install -g @railway/cli
```

---

## Step-by-Step Run Instructions

### Step 1: Navigate to Project
```bash
cd d:/Projects/NEW
```

### Step 2: Make Script Executable
```bash
# On Windows (PowerShell as Admin):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# On Mac/Linux:
chmod +x infrastructure/scripts/deploy-now.sh
```

### Step 3: Create External Services (5 minutes)

**MongoDB Atlas (Database):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account
4. Create M0 Sandbox cluster
5. Create database user (username: `ai-workspace`)
6. Get connection string
7. Copy it somewhere safe

**Redis Cloud (Cache):**
1. Go to https://redis.com/try-free
2. Create account
3. Create free database
4. Copy connection URL
5. Save it

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and save it

---

### Step 4: Run Deployment Script

#### On Windows (PowerShell):
```powershell
cd d:/Projects/NEW
bash infrastructure/scripts/deploy-now.sh
```

#### On Mac/Linux:
```bash
cd ~/path/to/Projects/NEW
bash infrastructure/scripts/deploy-now.sh
```

### Step 5: Follow Prompts

The script will ask for:

```
[1/8] Checking prerequisites...
     ✓ Checks that git, npm, node are installed

[2/8] Building project...
     ✓ Runs: npm run build
     ✓ Runs: npm run test

[3/8] GitHub Repository Setup
     ? Have you pushed code to GitHub? (y/n)
     → Type: y
     → If no, the script will tell you what to do first

[4/8] Setting Up External Services
     ? Enter MongoDB connection string: 
     → Paste your MongoDB URL
     ? Enter Redis URL:
     → Paste your Redis URL
     ? Enter OpenAI API key:
     → Paste your API key

[5/8] Generating Secrets
     ✓ Automatically generates JWT secret

[6/8] Setting Up Vercel (Frontend)
     → Script will auto-login or prompt
     → Deploys frontend
     → Shows URL

[7/8] Setting Up Railway (Backend)
     → Script will auto-login or prompt
     → Deploys backend
     → Shows URL

[8/8] Final Configuration
     ✓ Sets environment variables
     ✓ Runs health checks
     ✓ Shows final URLs
```

---

## What To Have Ready

Before you run the script, gather:

1. **MongoDB Connection String**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/ai-workspace`
   - Keep it secret!

2. **Redis URL**
   - Format: `redis://:password@host:port`
   - Keep it secret!

3. **OpenAI API Key**
   - Starts with: `sk-`
   - Keep it secret!

4. **GitHub Account**
   - With code already pushed to repos:
     - `ai-workspace-frontend`
     - `ai-workspace-backend`

---

## Troubleshooting

### Error: "Command not found: bash"
**Solution:** 
- On Windows, use PowerShell instead of CMD
- Or install Git Bash: https://git-scm.com/download/win

### Error: "npm command not found"
**Solution:**
- Install Node.js from https://nodejs.org
- Restart your terminal
- Run: `npm --version` to verify

### Error: "Cannot find module"
**Solution:**
```bash
npm install
npm install --workspaces
```

### MongoDB connection fails
**Solution:**
1. Check connection string is correct
2. Check password is correct (special chars need URL encoding)
3. In MongoDB Atlas, go to Network Access
4. Add `0.0.0.0/0` to whitelist (allows all IPs)

### Vercel deployment fails
**Solution:**
```bash
vercel logout
vercel login
# Then re-run the script
```

### Railway deployment fails
**Solution:**
```bash
railway logout
railway login
# Then re-run the script
```

---

## Quick Manual Run (If Script Fails)

### 1. Install Dependencies
```bash
npm install
```

### 2. Build
```bash
npm run build --workspaces
```

### 3. Test
```bash
npm run test
```

### 4. Deploy Frontend Manually
```bash
cd frontend
npm install -g vercel
vercel login
vercel deploy --prod
# Copy the URL it gives you
cd ..
```

### 5. Deploy Backend Manually
```bash
cd backend
npm install -g @railway/cli
railway login
railway deploy
# Copy the URL it gives you
cd ..
```

### 6. Set Environment Variables

**In Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your frontend project
3. Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_API_URL` = your backend URL
   - `NEXT_PUBLIC_WS_URL` = your backend URL (with `wss://`)

**In Railway Dashboard:**
1. Go to https://railway.app/dashboard
2. Select your backend project
3. Variables
4. Add all these:
```
MONGODB_URI=your-mongo-url
REDIS_URL=your-redis-url
OPENAI_API_KEY=your-api-key
JWT_SECRET=any-random-string
NEXT_PUBLIC_API_URL=your-backend-url
NEXT_PUBLIC_WS_URL=wss://your-backend-url
```

### 7. Test
```bash
# Test backend
curl https://your-backend-url/health

# Visit frontend
# https://your-vercel-url
```

---

## After Deployment

### 1. First Test
```bash
# Open in browser
https://your-vercel-url

# Sign up
# Create workspace
# Test chat
# Upload file
# Execute code
```

### 2. Monitor
```bash
# Check Vercel logs
vercel logs --follow

# Check Railway logs
railway logs
```

### 3. Share
```
Send this URL to your team:
https://your-vercel-url
```

---

## Complete Example

```bash
# 1. Navigate
cd d:/Projects/NEW

# 2. Install
npm install

# 3. Build
npm run build --workspaces

# 4. Test
npm run test

# 5. Run deployment
bash infrastructure/scripts/deploy-now.sh

# 6. When prompted:
#    - Confirm GitHub is ready: y
#    - Paste MongoDB URL
#    - Paste Redis URL
#    - Paste OpenAI key
#    - Let it deploy to Vercel
#    - Let it deploy to Railway
#    - Script sets env vars
#    - Runs health checks

# 7. Copy the URLs it shows
# 8. Visit frontend URL
# 9. Sign up and test
# 10. Celebrate! 🎉
```

---

## Terminal Commands Explained

```bash
cd d:/Projects/NEW
# Changes to project directory

npm install
# Installs all dependencies

npm run build --workspaces
# Builds all packages (frontend, backend, services)

npm run test
# Runs all tests

bash infrastructure/scripts/deploy-now.sh
# Runs the deployment script

vercel login
# Logs into Vercel

railway login
# Logs into Railway

curl https://your-url/health
# Tests if server is running
```

---

## Success Checklist

After running, you should have:

- [ ] MongoDB database created
- [ ] Redis instance created
- [ ] OpenAI API key ready
- [ ] GitHub repos with code pushed
- [ ] Vercel account connected
- [ ] Railway account connected
- [ ] Frontend deployed (URL shown)
- [ ] Backend deployed (URL shown)
- [ ] Environment variables set
- [ ] Health check passed
- [ ] Can visit frontend URL
- [ ] Can sign up
- [ ] Chat works
- [ ] Files work
- [ ] Code execution works

**If all checked → You're live! 🚀**

---

## Need Help?

| Issue | Solution |
|-------|----------|
| Command not found | Use PowerShell instead of CMD (Windows) |
| npm not found | Install Node.js and restart terminal |
| Build fails | Run `npm install` first |
| MongoDB fails | Check connection string and IP whitelist |
| Vercel fails | Run `vercel logout` then `vercel login` |
| Railway fails | Run `railway logout` then `railway login` |
| Tests fail | Run `npm run test` locally to debug |

---

## TL;DR (Quick Version)

```bash
# 1. Get MongoDB, Redis, OpenAI keys
# 2. Navigate to project
cd d:/Projects/NEW

# 3. Run deployment
bash infrastructure/scripts/deploy-now.sh

# 4. Follow prompts (paste your keys when asked)

# 5. Wait ~10 minutes

# 6. Visit your live app URL

# 7. Celebrate! 🎉
```

---

**Ready? Start here:**

```bash
cd d:/Projects/NEW
bash infrastructure/scripts/deploy-now.sh
```
