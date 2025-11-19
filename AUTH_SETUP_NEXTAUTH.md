# NextAuth.js Setup Guide

## ✅ What's Already Done

- NextAuth.js v5 (Auth.js) installed
- Magic link authentication configured
- Google OAuth configured
- Protected routes set up (/feed, /library, /account)
- Sign-in page at `/auth`
- User menu with sign-out

## 🚀 Quick Setup (2 Steps)

### Step 1: Add Environment Variables

Create or update `.env.local` file:

```bash
# Generate a secret key
openssl rand -base64 32
```

Then add to `.env.local`:

```bash
# Convex (already configured)
CONVEX_DEPLOYMENT=dazzling-guanaco-125
NEXT_PUBLIC_CONVEX_URL=https://dazzling-guanaco-125.convex.cloud

# Database (already configured)
DATABASE_URL=postgresql://localhost:5432/1another

# NextAuth.js - REQUIRED
AUTH_SECRET=your-generated-secret-here
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000

# Google OAuth - OPTIONAL (for Google sign-in)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Resend - OPTIONAL (for magic link emails in production)
AUTH_RESEND_KEY=your-resend-api-key
```

### Step 2: Start the App

```bash
# Terminal 1 - Convex (for real-time features)
npx convex dev

# Terminal 2 - Next.js
npm run dev
```

Visit: `http://localhost:3000/auth`

## 🔐 Authentication Options

### Option 1: Magic Link (Email) ✅ Ready
- Enter email address
- Click "Send magic link"
- In development: Check terminal for magic link URL
- In production: Configure Resend for email delivery

**Development Mode:**
- Magic links are logged to console
- No email service needed for testing

### Option 2: Google OAuth (Requires Setup)

#### Get Google Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**
8. Add to `.env.local`:
   ```bash
   AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=your-client-secret
   ```
9. Restart dev server

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

### Test Magic Link:
1. Visit `http://localhost:3000/feed`
2. Redirected to `/auth` (not signed in)
3. Enter your email
4. Click "Send magic link"
5. Check terminal for the magic link URL
6. Copy and paste URL in browser
7. You're signed in! ✅

### Test Google OAuth:
1. Visit `http://localhost:3000/auth`
2. Click "Continue with Google"
3. Sign in with Google account
4. Redirected to `/feed`
5. You're signed in! ✅

### Test Protected Routes:
- Try visiting `/feed`, `/library`, `/account` without signing in
- Should redirect to `/auth` ✅
- After signing in, should access all pages ✅

### Test Sign Out:
- Click user icon in top-left
- Click "Sign out"
- Redirected to home page ✅

## 🚀 Vercel Deployment

### 1. Add Environment Variables to Vercel

In your Vercel project dashboard, add:

```bash
AUTH_SECRET=your-generated-secret
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://your-domain.vercel.app
AUTH_GOOGLE_ID=your-google-client-id (if using Google)
AUTH_GOOGLE_SECRET=your-google-client-secret (if using Google)
AUTH_RESEND_KEY=your-resend-key (if using magic links in production)
```

### 2. Update Google OAuth (if using)

Add production redirect URI:
- `https://your-domain.vercel.app/api/auth/callback/google`

### 3. Deploy

```bash
git push  # Vercel auto-deploys
```

That's it! ✅

## 🔧 Troubleshooting

### "Invalid environment variables"
- ✅ Add `AUTH_SECRET` to `.env.local`
- ✅ Run: `openssl rand -base64 32` to generate

### Google OAuth not working
- ✅ Verify `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env.local`
- ✅ Check redirect URI in Google Console matches exactly
- ✅ Restart dev server after adding env vars

### Magic link not received
- ✅ In development: Check terminal/console for link
- ✅ In production: Configure Resend API key
- ✅ Check spam folder

### "Do I need Convex running?"
- For auth only: **No**
- For full features: **Yes** (terminal 1)
- Convex handles real-time features, NOT auth

## 🎯 What's Different from Convex Auth?

### Convex Auth (Previous):
- ❌ Required Convex running
- ❌ Complex setup
- ❌ Environment variables in dashboard
- ❌ Compatibility issues

### NextAuth.js (Current): ✅
- ✅ Works with/without Convex
- ✅ Simple `.env.local` setup
- ✅ Perfect for Vercel
- ✅ Industry standard
- ✅ Well documented
- ✅ Easy to test

## 📚 Resources

- [NextAuth.js Docs](https://authjs.dev)
- [Google OAuth Setup](https://console.cloud.google.com)
- [Resend (Email)](https://resend.com)

---

**You're all set! 🎉**

Just add `AUTH_SECRET` to `.env.local` and run `npm run dev`!

