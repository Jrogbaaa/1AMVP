# 🚀 Vercel Deployment Guide - 1Another MVP

## Prerequisites
- GitHub account with your repository
- Vercel account (free tier works)
- Convex account
- PostgreSQL database (Vercel Postgres recommended)

---

## Step 1: Deploy Convex to Production

First, deploy your Convex backend to production:

```bash
# Deploy Convex to production
npx convex deploy --prod
```

This will give you:
- Production deployment name (e.g., `prod:your-app-name`)
- Production Convex URL (e.g., `https://your-app-name.convex.cloud`)

**Save these values** - you'll need them for Vercel environment variables.

---

## Step 2: Set Up Production Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Select your project (or create new)
3. Go to **Storage** → **Create Database** → **Postgres**
4. After creation, click **Connect** and copy the `DATABASE_URL`

Then run the SQL schema:
```bash
# Copy the DATABASE_URL from Vercel
# Use Vercel's SQL query interface or connect via psql

# Run schema.sql first
# Then run seed.sql
```

### Option B: Other PostgreSQL Provider (Supabase, Railway, etc.)

1. Create a PostgreSQL database
2. Get the connection string (DATABASE_URL)
3. Run schema:
   ```bash
   psql -d your-database-url -f db/schema.sql
   psql -d your-database-url -f db/seed.sql
   ```

---

## Step 3: Connect GitHub to Vercel

### First-Time Setup:

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New...** → **Project**
3. **Import Git Repository**
4. Select your GitHub account
5. Choose the repository: `1A-MVP`
6. Click **Import**

### Configure Build Settings:

Vercel should auto-detect Next.js. Verify:
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**DO NOT DEPLOY YET** - Click on **Environment Variables** first.

---

## Step 4: Add Environment Variables in Vercel

In your Vercel project settings, go to **Settings** → **Environment Variables** and add:

### Required Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `AUTH_SECRET` | `ONHeIQHjG7f6PvZEHitgrembBs5iBlMPL7TydQNv2jI=` | Production, Preview, Development |
| `AUTH_TRUST_HOST` | `true` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://YOUR-VERCEL-URL.vercel.app` | Production |
| `NEXTAUTH_URL` | (leave empty or set to preview URL) | Preview |
| `DATABASE_URL` | `postgresql://user:pass@host/db` (from Step 2) | Production, Preview, Development |
| `CONVEX_DEPLOYMENT` | `prod:your-deployment-name` (from Step 1) | Production |
| `NEXT_PUBLIC_CONVEX_URL` | `https://your-deployment.convex.cloud` (from Step 1) | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR-VERCEL-URL.vercel.app` | Production |

### Optional Variables (Google OAuth):

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `AUTH_GOOGLE_ID` | Your Google Client ID | Production, Preview, Development |
| `AUTH_GOOGLE_SECRET` | Your Google Client Secret | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED` | `true` | Production, Preview, Development |

---

## Step 5: Update Google OAuth Redirect URIs (If Using)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client
5. Add **Authorized redirect URIs**:
   ```
   https://YOUR-VERCEL-URL.vercel.app/api/auth/callback/google
   ```
6. Save

---

## Step 6: Deploy!

Now you can deploy:

### Option A: Deploy from Vercel Dashboard
1. Click **Deploy** in Vercel
2. Wait for build to complete
3. Visit your production URL

### Option B: Deploy from Git Push
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

Vercel will automatically:
- ✅ Detect the push
- ✅ Start a new deployment
- ✅ Build your app
- ✅ Deploy to production
- ✅ Generate a unique URL

---

## Step 7: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `1another.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain
5. Update Google OAuth redirect URIs if using

---

## 🔄 Automatic Deployments

**Good news!** Once connected, Vercel automatically deploys when you push to GitHub:

### How it works:
- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

### Deploy workflow:
```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs npm install
# 3. Runs npm run build
# 4. Deploys to production
# 5. Sends you a notification
```

---

## ✅ Post-Deployment Checklist

After your first deployment:

- [ ] Visit your production URL
- [ ] Test authentication flow (`/auth`)
- [ ] Test Google OAuth (if enabled)
- [ ] Test protected routes (`/feed`, `/library`, `/account`)
- [ ] Test video playback
- [ ] Test chat onboarding
- [ ] Test appointment scheduling
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Run Lighthouse audit
- [ ] Check Vercel deployment logs for errors

---

## 🐛 Troubleshooting

### Build Fails
- Check Vercel deployment logs
- Verify all environment variables are set
- Make sure `npm run build` works locally

### Authentication Not Working
- Verify `NEXTAUTH_URL` matches your domain (with https://)
- Check `AUTH_SECRET` is set
- Verify `AUTH_TRUST_HOST=true`

### Database Connection Fails
- Check `DATABASE_URL` is correct
- Verify database is accessible from Vercel
- Run schema.sql and seed.sql on production database

### Convex Not Working
- Verify `CONVEX_DEPLOYMENT` starts with `prod:`
- Check `NEXT_PUBLIC_CONVEX_URL` is correct
- Make sure you ran `npx convex deploy --prod`

### Environment Variables Not Updating
- Redeploy after changing environment variables
- Check variable is set for correct environment (Production/Preview/Development)

---

## 📊 Monitoring Your Deployment

### Vercel Dashboard
- **Analytics**: View traffic and performance
- **Logs**: Check runtime logs
- **Speed Insights**: Monitor Core Web Vitals
- **Deployments**: View deployment history

### Useful Commands
```bash
# View deployment logs
vercel logs

# Check deployment status
vercel inspect YOUR-DEPLOYMENT-URL

# Rollback to previous deployment
vercel rollback
```

---

## 🔒 Security Best Practices

1. ✅ Never commit `.env` file to Git
2. ✅ Use strong `AUTH_SECRET` (already set)
3. ✅ Enable `AUTH_TRUST_HOST=true` for Vercel
4. ✅ Use HTTPS only in production
5. ✅ Rotate secrets periodically
6. ✅ Review Vercel access logs regularly
7. ✅ Enable Vercel's security features (DDOS protection, etc.)

---

## 📈 Performance Optimization

Vercel automatically provides:
- ✅ **Edge Network**: Global CDN
- ✅ **Image Optimization**: Next.js Image component
- ✅ **Caching**: Automatic caching headers
- ✅ **Compression**: Gzip/Brotli
- ✅ **HTTP/2**: Modern protocol

Additional optimizations:
- Use Next.js `<Image>` component for all images
- Implement ISR (Incremental Static Regeneration) where possible
- Use dynamic imports for heavy components
- Monitor Core Web Vitals in Vercel dashboard

---

## 🎉 You're Ready!

Your app will now:
- ✅ Auto-deploy on every push to `main`
- ✅ Create preview deployments for branches/PRs
- ✅ Scale automatically with traffic
- ✅ Benefit from Vercel's global CDN
- ✅ Have zero-downtime deployments

---

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Convex Production Deployment](https://docs.convex.dev/production)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

**Need help?** Check the [Vercel community](https://github.com/vercel/vercel/discussions) or create an issue in your repository.

**Built with ❤️ for 1Another**

