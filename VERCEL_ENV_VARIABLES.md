# 🔐 Vercel Environment Variables Quick Reference

## What's Wrong with Your Current .env?

Your current `.env` file has **localhost values** that won't work in production:

| Variable | Current Value ❌ | What You Need ✅ |
|----------|------------------|------------------|
| `DATABASE_URL` | `postgresql://localhost:5432/1another` | Production PostgreSQL URL |
| `CONVEX_DEPLOYMENT` | `dev:dazzling-guanaco-125` | `prod:your-deployment-name` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://your-vercel-url.vercel.app` |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://your-vercel-url.vercel.app` |

---

## ✅ Exact Values to Add in Vercel Dashboard

Go to Vercel: **Settings** → **Environment Variables** and add:

### 1. Authentication (Keep These Values)
```bash
AUTH_SECRET=ONHeIQHjG7f6PvZEHitgrembBs5iBlMPL7TydQNv2jI=
AUTH_TRUST_HOST=true
```

### 2. URLs (Update After First Deploy)
```bash
# After Vercel gives you a URL, update these:
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

### 3. Database (Get from Vercel Postgres)
```bash
# Create Postgres in Vercel → Storage → Create Database
# Copy the DATABASE_URL they provide
DATABASE_URL=postgresql://default:xxxxx@xxxxx.us-east-1.postgres.vercel.com:5432/verceldb
```

### 4. Convex (Deploy First)
```bash
# Run in terminal: npx convex deploy --prod
# It will output these values:
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 5. Google OAuth (Optional)
```bash
# Only if you want Google sign-in:
AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true
```

---

## 🚀 Quick Start: 3 Commands to Deploy

```bash
# 1. Deploy Convex to production
npx convex deploy --prod

# 2. Commit and push to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# 3. Connect GitHub to Vercel
# Go to vercel.com → Add New Project → Import from GitHub
# Add the environment variables above
# Click Deploy!
```

---

## 🔄 Automatic Deployments

Once connected:
- **Push to `main`** → Auto-deploys to production ✅
- **Push to other branches** → Creates preview deployment
- **Pull requests** → Automatic preview with unique URL

---

## 📋 Copy-Paste Checklist

Before deploying, complete these steps:

- [ ] Run `npx convex deploy --prod`
- [ ] Create Vercel Postgres database
- [ ] Run `schema.sql` on production database
- [ ] Run `seed.sql` on production database
- [ ] Add all environment variables to Vercel
- [ ] Update Google OAuth redirect URIs (if using)
- [ ] Push to GitHub
- [ ] Verify deployment works

---

## 🐛 Common Issues

### "NEXTAUTH_URL not configured"
- Make sure `NEXTAUTH_URL` is set in Vercel
- Must use `https://` (not `http://`)
- Must match your actual Vercel URL

### "Database connection failed"
- Verify `DATABASE_URL` is correct
- Make sure you ran `schema.sql` and `seed.sql`
- Check database is accessible from Vercel IPs

### "Convex not loading"
- Verify you ran `npx convex deploy --prod` (not just `dev`)
- Check `CONVEX_DEPLOYMENT` starts with `prod:`
- Verify `NEXT_PUBLIC_CONVEX_URL` is correct

---

## 💡 Pro Tips

1. **Don't create `.env.production` file** - Add variables directly in Vercel dashboard
2. **Each environment variable** should be set for "Production" environment at minimum
3. **After changing env vars** in Vercel, trigger a new deployment
4. **Use Vercel's "Environments"** feature to manage staging vs production
5. **Never commit `.env` files** to Git (they're already gitignored)

---

## 📚 See Full Guide

For detailed step-by-step instructions, see:
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) - Current deployment status
- [README.md](./README.md) - Project documentation

---

**Ready to deploy?** Follow the Quick Start above and you'll be live in minutes! 🚀

