# Authentication Setup Guide

This document explains how to configure Google OAuth authentication with magic link sign-in for the 1Another MVP.

## Overview

The app uses **Convex Auth** which provides:
- ✅ Magic link email authentication
- ✅ Google OAuth sign-in
- ✅ Session management
- ✅ Protected routes

## Prerequisites

1. **Convex Account**: Already configured (see SETUP.md)
2. **Google Cloud Project**: For OAuth credentials

## Step 1: Set Up Google OAuth

### 1.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Name**: `1Another MVP`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
     - `https://your-production-domain.com`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-production-domain.com/api/auth/callback/google`
7. Click **Create**
8. Copy your **Client ID** and **Client Secret**

### 1.2 Configure Convex Environment Variables

Add the following to your Convex dashboard:

1. Go to [Convex Dashboard](https://dashboard.convex.dev/)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add these variables:
   - `AUTH_GOOGLE_ID`: Your Google OAuth Client ID
   - `AUTH_GOOGLE_SECRET`: Your Google OAuth Client Secret
   - `SITE_URL`: `http://localhost:3000` (or your production URL)

## Step 2: Configure Local Environment

Create or update `.env.local`:

```bash
# Convex (already configured)
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Database (already configured)
DATABASE_URL=postgresql://username:password@localhost:5432/1another

# Google OAuth
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-client-secret

# Site URL
SITE_URL=http://localhost:3000
```

## Step 3: Deploy Convex Schema & Functions

Run the following command to push the authentication schema and functions:

```bash
npx convex dev
```

This will:
- ✅ Create auth tables (users, sessions, etc.)
- ✅ Deploy authentication functions
- ✅ Set up HTTP routes for OAuth

## Step 4: Test Authentication

### 4.1 Test Magic Link Sign-In

1. Start your dev server: `npm run dev`
2. Navigate to `http://localhost:3000/auth`
3. Enter your email address
4. Click "Send magic link"
5. Check your email (Convex will log the magic link to console in development)
6. Click the link to sign in

### 4.2 Test Google Sign-In

1. Navigate to `http://localhost:3000/auth`
2. Click "Continue with Google"
3. Sign in with your Google account
4. You'll be redirected to `/feed` after successful authentication

## Authentication Flow

### Magic Link Flow

```
1. User visits landing page
2. Clicks on magic link from email
3. Redirected to /auth
4. User enters email
5. Clicks "Send magic link"
6. Email sent with magic link
7. User clicks link in email
8. Authenticated and redirected to /feed
```

### Google OAuth Flow

```
1. User visits landing page
2. Clicks on magic link from email
3. Redirected to /auth
4. User clicks "Continue with Google"
5. Redirected to Google OAuth
6. User authorizes app
7. Redirected back to app
8. Authenticated and redirected to /feed
```

## Protected Routes

The following routes require authentication:
- `/feed` - Video feed
- `/library` - Video library
- `/account` - User account

These routes are wrapped with the `ProtectedRoute` component which:
- Checks authentication status
- Redirects to `/auth` if not authenticated
- Shows loading state during auth check

## Components

### ConvexClientProvider
**Location**: `components/ConvexClientProvider.tsx`

Wraps the app with Convex authentication context.

### SignInForm
**Location**: `components/SignInForm.tsx`

Provides the sign-in UI with:
- Email input for magic links
- Google OAuth button
- Loading states
- Error handling

### ProtectedRoute
**Location**: `components/ProtectedRoute.tsx`

HOC that protects routes requiring authentication.

### UserMenu
**Location**: `components/UserMenu.tsx`

Displays user menu with sign-out option.

## Database Schema

Convex Auth automatically creates the following tables:

```typescript
- authAccounts   // OAuth accounts
- authSessions   // User sessions
- authVerificationCodes // Magic link codes
- users          // User profiles
```

## Customization

### Modify Sign-In Page

Edit `app/auth/page.tsx` to customize the sign-in experience.

### Add More OAuth Providers

To add more providers (GitHub, Facebook, etc.):

1. Install provider package:
   ```bash
   npm install @auth/core
   ```

2. Update `convex/auth.ts`:
   ```typescript
   import GitHub from "@auth/core/providers/github";
   
   export const { auth, signIn, signOut, store } = convexAuth({
     providers: [
       Password({ id: "magic-link" }),
       Google,
       GitHub, // Add new provider
     ],
   });
   ```

3. Add environment variables for the new provider

### Customize Redirect URLs

Update the `redirectTo` parameter in `SignInForm.tsx`:

```typescript
await signIn("google", {
  redirectTo: "/your-custom-page",
});
```

## Production Deployment

### 1. Update Google OAuth Settings

Add your production domain to:
- Authorized JavaScript origins
- Authorized redirect URIs

### 2. Update Convex Environment Variables

In the Convex dashboard, update:
- `SITE_URL` to your production URL
- Keep `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` the same (or use production credentials)

### 3. Deploy

```bash
npm run build
npx convex deploy --prod
```

## Security Best Practices

✅ **Environment Variables**: Never commit `.env.local` to version control

✅ **HTTPS**: Always use HTTPS in production

✅ **Redirect URIs**: Only whitelist trusted redirect URIs

✅ **Session Management**: Convex handles session security automatically

✅ **HIPAA Compliance**: Ensure your OAuth provider meets HIPAA requirements

## Troubleshooting

### Magic Link Not Working

1. Check Convex logs: `npx convex logs`
2. Verify email configuration in Convex dashboard
3. Check spam folder

### Google OAuth Error

1. Verify Client ID and Secret in Convex dashboard
2. Check authorized redirect URIs in Google Console
3. Ensure `SITE_URL` environment variable is correct

### Session Not Persisting

1. Clear browser cookies
2. Check Convex connection status
3. Verify environment variables are loaded

### "Not Authenticated" Error

1. Check `ConvexClientProvider` is wrapping the app
2. Verify `useConvexAuth()` hook is working
3. Check browser console for errors

## Support

For issues:
1. Check Convex Auth docs: https://labs.convex.dev/auth
2. Check Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
3. Review this project's documentation

---

**Built with ❤️ for 1Another**

