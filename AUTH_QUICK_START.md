# Authentication Quick Start

## Current Status

✅ Authentication code is installed and configured
✅ Magic link authentication ready
🔧 Google OAuth ready (needs credentials)
⏳ Awaiting Convex environment variable setup

## Quick Setup (3 Steps)

### Step 1: Add Environment Variables to Convex

Go to your [Convex Dashboard](https://dashboard.convex.dev) and add these environment variables:

```bash
SITE_URL=http://localhost:3000
```

**For Google OAuth (optional):**
```bash
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret  
```

### Step 2: Deploy to Convex

```bash
npx convex dev
```

Keep this terminal running!

### Step 3: Test Authentication

1. Start Next.js dev server (in another terminal):
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3000/auth`

3. Enter your email and click "Send magic link"

4. Check console for the magic link (in development, Convex logs it)

5. Click the link to sign in!

## Enabling Google OAuth (Optional)

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URI:
   - `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret**

### 2. Add to Convex Dashboard

Add these environment variables:
```bash
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-client-secret
```

### 3. Enable Google in Code

**In `convex/auth.ts`:**
```typescript
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({ id: "magic-link" }),
    Google, // ← Uncomment this line
  ],
});
```

**In `components/SignInForm.tsx`:**

Change line 135 from:
```typescript
{false && (
```

To:
```typescript
{true && (
```

### 4. Redeploy

```bash
npx convex dev
```

## Testing

### Test Magic Link
1. Go to `/auth`
2. Enter email
3. Click "Send magic link"
4. Check Convex logs for link (dev mode)
5. Click link → You're signed in!

### Test Google OAuth
1. Go to `/auth`
2. Click "Continue with Google"
3. Sign in with Google account
4. Redirected to `/feed` → You're signed in!

### Test Protected Routes
- Visit `/feed` - Should redirect to `/auth` if not signed in
- Visit `/library` - Should redirect to `/auth` if not signed in
- Visit `/account` - Should redirect to `/auth` if not signed in

## Troubleshooting

### "Cannot read properties of undefined (reading 'toUpperCase')"
- ✅ Add `SITE_URL` environment variable to Convex dashboard

### "Google OAuth not working"
- ✅ Verify `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in Convex dashboard
- ✅ Check redirect URI in Google Cloud Console
- ✅ Uncommented `Google` provider in `convex/auth.ts`

### "Magic link not received"
- ✅ Check Convex logs: `npx convex logs`
- ✅ In development, magic link is logged to console
- ✅ In production, configure email provider (Resend/SendGrid)

## What's Working

✅ Auth infrastructure installed
✅ Protected route system
✅ Sign-in UI component  
✅ User menu with sign-out
✅ Session management
✅ Convex Auth integration

## What's Next

1. Set up environment variables in Convex dashboard
2. Run `npx convex dev` to deploy
3. Test authentication flow
4. (Optional) Set up Google OAuth
5. (Production) Configure email provider for magic links

---

For detailed documentation, see [AUTH_SETUP.md](./AUTH_SETUP.md)

