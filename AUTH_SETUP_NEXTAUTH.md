# NextAuth.js Setup Guide

## ✅ What's Already Done

- NextAuth.js v5 (Auth.js) installed
- Email sign-in configured
- "Earned trust" authentication flow
- Protected routes with soft prompts
- Sign-in page at `/auth`

## 🚀 Quick Setup (2 Steps)

### Step 1: Add Environment Variables

Create or update `.env.local` file:

```bash
# Generate a secret key
openssl rand -base64 32
```

Then add to `.env.local`:

```bash
# Convex (for real-time features)
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# NextAuth.js - REQUIRED
AUTH_SECRET=your-generated-secret-here
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000
```

### Step 2: Start the App

```bash
npm run dev
```

Visit: `http://localhost:3000/feed`

## 🔐 Authentication Flow

### "Earned Trust" Model

Users can browse content **without signing in**. Authentication is prompted only when they:
- Want to save progress
- Want health reminders
- Try to access personalized content (My Health page)
- Try to follow a doctor

### Email Sign-In

1. User enters email address
2. Click "Continue with Email"
3. In development: Instantly signed in
4. In production: Add database validation

## 📝 Do You Need Convex Running?

### Short Answer: **Only if you use real-time features**

Convex is used for:
- Real-time feed updates
- Chat onboarding
- Video engagement tracking
- Rate limiting

**Authentication does NOT require Convex** - it runs entirely on NextAuth.js!

### What Needs to Run:

**For Basic App (with auth):**
```bash
npm run dev  # That's it!
```

**For Full App (with real-time features):**
```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

## 🧪 Testing Authentication

### Test Email Sign-In:
1. Visit `http://localhost:3000/feed`
2. Watch a video
3. Auth prompt appears after ~2 seconds
4. Enter your email
5. Click "Continue with Email"
6. You're signed in! ✅

### Test Protected Routes:
- `/feed` and `/discover` - Accessible without signing in ✅
- `/my-health` - Shows friendly sign-in prompt if not authenticated ✅

### Test Sign Out:
- Go to `/my-health`
- Scroll to bottom
- Click "Sign Out"

## 🚀 Vercel Deployment

### Add Environment Variables to Vercel

In your Vercel project dashboard, add:

```bash
AUTH_SECRET=your-generated-secret
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Deploy

```bash
git push  # Vercel auto-deploys
```

That's it! ✅

## 🔧 Troubleshooting

### "Invalid environment variables"
- ✅ Add `AUTH_SECRET` to `.env.local`
- ✅ Run: `openssl rand -base64 32` to generate

### Sign-in not working
- ✅ Check that `AUTH_SECRET` is set
- ✅ Restart dev server after adding env vars

### "Do I need Convex running?"
- For auth only: **No**
- For full features: **Yes** (terminal 1)
- Convex handles real-time features, NOT auth

## 📚 Resources

- [NextAuth.js Docs](https://authjs.dev)
- [Earned Trust Auth Flow](./AUTH_EARNED_TRUST.md)

---

**You're all set! 🎉**

Just add `AUTH_SECRET` to `.env.local` and run `npm run dev`!
