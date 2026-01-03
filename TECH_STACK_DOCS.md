# 1Another MVP - Technology Stack & Documentation Reference

## 📋 Complete Tech Stack Audit

This document lists **all technologies** used in the 1Another MVP with their documentation links, current status, and integration notes.

---

## 🏗️ Core Framework

| Technology | Version | Documentation | Status |
|------------|---------|---------------|--------|
| **Next.js** | 16.0.10 | [docs.nextjs.org](https://nextjs.org/docs) | ✅ Verified |
| **React** | 19.2.3 | [react.dev](https://react.dev/) | ✅ Verified |
| **TypeScript** | 5.6.3 | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) | ✅ Verified |

### Notes:
- Using App Router (not Pages Router)
- Server Components are default, `"use client"` for client components
- Middleware configured for auth protection

---

## 🗄️ Database & Backend

| Technology | Version | Documentation | Status |
|------------|---------|---------------|--------|
| **Convex** | 1.31.2 | [docs.convex.dev](https://docs.convex.dev/) | ✅ Deployed |
| **Prisma** | 6.19.1 | [prisma.io/docs](https://www.prisma.io/docs) | ⚠️ Installed but unused |
| **Vercel Postgres** | 0.10.0 | [vercel.com/docs/storage/vercel-postgres](https://vercel.com/docs/storage/vercel-postgres) | ⚠️ Configured |
| **PostgreSQL** | 16+ | [postgresql.org/docs](https://www.postgresql.org/docs/) | ⚠️ Local only |

### Convex Configuration:
```
Deployment: prod:insightful-retriever-956
URL: https://insightful-retriever-956.convex.cloud
```

### Key Files:
- `convex/schema.ts` - Database schema with all tables
- `convex/*.ts` - Query and mutation functions
- `components/ConvexClientProvider.tsx` - React provider setup

### Current Convex Tables:
- `users` - User accounts
- `doctorProfiles` - Doctor profiles with HeyGen integration
- `doctorMessages` - Doctor-to-patient messages
- `doctorMessageTemplates` - Message templates
- `patientReminders` - Patient reminders
- `doctorReminderTemplates` - Reminder templates
- `videoGenerationJobs` - Video generation tracking
- `generatedVideos` - Generated video storage
- `videosSentToPatients` - Video delivery tracking
- `doctorSavedVideos` - Doctor's saved videos
- `feedItems` - Feed content
- `chatMessages` - Chat messages
- `userSessions` - Rate limiting
- `videoEvents` - Engagement events

---

## 🔐 Authentication

| Technology | Version | Documentation | Status |
|------------|---------|---------------|--------|
| **NextAuth.js** | 5.0.0-beta.30 | [authjs.dev](https://authjs.dev/) | ✅ Configured |

### Key Files:
- `auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - API route handler
- `middleware.ts` - Route protection
- `types/next-auth.d.ts` - TypeScript extensions

### Current Providers:
- ✅ **Email** (Credentials) - Any email works for patients
- ⚠️ **Google OAuth** - Optional, disabled by default

### Auth Flow:
1. Patient enters email → Signs in immediately
2. Doctor emails (`@1another.com`, `@1another.health`, `@1another.ai`) → Doctor Portal
3. User synced to Convex via `/api/auth/sync-user`

---

## 🎨 Styling & UI

| Technology | Version | Documentation | Status |
|------------|---------|---------------|--------|
| **Tailwind CSS** | 4.1.18 | [tailwindcss.com/docs](https://tailwindcss.com/docs) | ✅ Configured |
| **Shadcn/UI** | Latest | [ui.shadcn.com](https://ui.shadcn.com/) | ✅ 10 components |
| **Radix UI** | Various | [radix-ui.com/docs](https://www.radix-ui.com/docs/primitives) | ✅ Via Shadcn |
| **Lucide React** | 0.462.0 | [lucide.dev](https://lucide.dev/) | ✅ Icons |
| **Sonner** | 2.0.7 | [sonner.emilkowal.ski](https://sonner.emilkowal.ski/) | ✅ Toasts |
| **Vaul** | 1.1.2 | [vaul.emilkowal.ski](https://vaul.emilkowal.ski/) | ✅ Drawer |

### Shadcn Components Installed:
1. `avatar.tsx` - Profile images
2. `badge.tsx` - Status indicators
3. `button.tsx` - Buttons with variants
4. `card.tsx` - Card containers
5. `dialog.tsx` - Modal dialogs
6. `drawer.tsx` - Bottom sheets (mobile)
7. `input.tsx` - Form inputs
8. `skeleton.tsx` - Loading placeholders
9. `sonner.tsx` - Toast notifications
10. `tooltip.tsx` - Hover tooltips

### Key Files:
- `app/globals.css` - Global styles + CSS variables
- `components/ui/*.tsx` - Shadcn components
- `components.json` - Shadcn configuration
- `tailwind.config.ts` - Tailwind configuration

---

## 🤖 AI & Video Generation

| Technology | Documentation | Status |
|------------|---------------|--------|
| **OpenAI API** | [platform.openai.com/docs](https://platform.openai.com/docs) | ✅ Script generation |
| **HeyGen API** | [docs.heygen.com](https://docs.heygen.com/) | ✅ Video generation |

### OpenAI Integration:
- Used for: Script generation, chat responses
- Key Files:
  - `app/api/ai/chat/route.ts`
  - `app/api/ai/generate-script/route.ts`
- Environment: `OPENAI_API_KEY`

### HeyGen Integration:
- Used for: AI avatar video generation
- Key Files:
  - `lib/heygen.ts` - Client library
  - `app/api/heygen/generate/route.ts` - Video generation
  - `app/api/heygen/avatars/route.ts` - Avatar listing
  - `app/api/heygen/status/[jobId]/route.ts` - Status checking
  - `app/api/heygen/webhook/route.ts` - Webhook handler
  - `app/api/heygen/create-avatar/route.ts` - Avatar creation
- Environment Variables:
  - `HEYGEN_API_KEY`
  - `HEYGEN_DEFAULT_AVATAR_ID`
  - `HEYGEN_DEFAULT_VOICE_ID`
  - `HEYGEN_WEBHOOK_SECRET` (optional)

---

## 📧 Email

| Technology | Version | Documentation | Status |
|------------|---------|---------------|--------|
| **Nodemailer** | 7.0.10 | [nodemailer.com](https://nodemailer.com/) | ⚠️ Installed |

### Notes:
- Installed for NextAuth email provider
- Not currently configured for sending emails
- Future: Magic link authentication, notifications

---

## ✅ Form & Validation

| Technology | Version | Documentation | Status |
|------------|---------|---------------|--------|
| **Zod** | 4.2.1 | [zod.dev](https://zod.dev/) | ✅ Validation |
| **@t3-oss/env-nextjs** | 0.13.10 | [env.t3.gg](https://env.t3.gg/) | ✅ Env validation |

### Key Files:
- `env.ts` - Environment variable validation
- Various API routes use Zod for input validation

---

## 🧪 Testing

| Technology | Version | Documentation | Status |
|------------|---------|---------------|--------|
| **Jest** | 29.7.0 | [jestjs.io](https://jestjs.io/) | ✅ Unit tests |
| **Testing Library** | 16.3.1 | [testing-library.com](https://testing-library.com/) | ✅ React tests |
| **Playwright** | 1.57.0 | [playwright.dev](https://playwright.dev/) | ✅ E2E tests |
| **Axe-core** | 4.11.0 | [deque.com/axe](https://www.deque.com/axe/) | ✅ Accessibility |

### Test Commands:
```bash
npm run test          # Jest unit tests
npm run test:e2e      # Playwright E2E
npm run test:a11y     # Accessibility tests
npm run test:all      # All tests
```

### Test Files:
- `tests/unit/` - Unit tests
- `tests/e2e/` - End-to-end tests
- `jest.config.ts` - Jest configuration
- `playwright.config.ts` - Playwright configuration

---

## 🚀 Deployment & CI/CD

| Technology | Documentation | Status |
|------------|---------------|--------|
| **Vercel** | [vercel.com/docs](https://vercel.com/docs) | ✅ Deployed |
| **GitHub Actions** | [docs.github.com/actions](https://docs.github.com/en/actions) | ✅ Quality gate |

### Key Files:
- `.github/workflows/quality-gate.yml` - CI pipeline
- `next.config.js` - Next.js configuration
- `VERCEL_DEPLOYMENT_GUIDE.md` - Deployment guide
- `VERCEL_ENV_VARIABLES.md` - Environment reference

### Quality Gate Checks:
1. TypeScript type checking
2. ESLint code quality
3. Production build verification
4. Security audit

---

## 📦 Utility Libraries

| Library | Version | Purpose | Documentation |
|---------|---------|---------|---------------|
| **clsx** | 2.1.1 | Class merging | [npmjs.com/package/clsx](https://www.npmjs.com/package/clsx) |
| **tailwind-merge** | 2.6.0 | Tailwind class merging | [npmjs.com/package/tailwind-merge](https://www.npmjs.com/package/tailwind-merge) |
| **class-variance-authority** | 0.7.1 | Component variants | [cva.style/docs](https://cva.style/docs) |
| **next-themes** | 0.4.6 | Theme switching | [npmjs.com/package/next-themes](https://www.npmjs.com/package/next-themes) |

---

## 🔗 Environment Variables Reference

### Required for Production:

```env
# Authentication
AUTH_SECRET=<generated-secret>
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://your-domain.vercel.app

# Convex (CRITICAL)
CONVEX_DEPLOYMENT=prod:insightful-retriever-956
NEXT_PUBLIC_CONVEX_URL=https://insightful-retriever-956.convex.cloud

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Optional:

```env
# Database (if using Prisma/PostgreSQL)
DATABASE_URL=postgresql://...

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# HeyGen (for video generation)
HEYGEN_API_KEY=...
HEYGEN_DEFAULT_AVATAR_ID=...
HEYGEN_DEFAULT_VOICE_ID=...
HEYGEN_WEBHOOK_SECRET=...

# Google OAuth (if enabled)
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true
```

---

## 📚 Project Documentation Files

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Main documentation | ✅ Updated |
| `CHANGELOG.md` | Version history | ✅ v1.41.0 |
| `PROJECT_SUMMARY.md` | Feature overview | ✅ Complete |
| `ClaudeMD.md` | AI context | ✅ Technical |
| `SETUP.md` | Setup guide | ✅ Complete |
| `START_HERE.md` | Quick start | ✅ Complete |
| `AUTH_SETUP.md` | Auth documentation | ✅ Complete |
| `AUTH_QUICK_START.md` | Auth quick reference | ✅ Complete |
| `AUTH_EARNED_TRUST.md` | Earned trust pattern | ✅ Complete |
| `VERCEL_DEPLOYMENT_GUIDE.md` | Deployment guide | ✅ Complete |
| `VERCEL_ENV_VARIABLES.md` | Env reference | ✅ Complete |
| `convex/README.md` | Convex schema docs | ✅ Complete |
| `TECH_STACK_DOCS.md` | This file | ✅ New |

---

## ✅ Documentation Status Summary

### Fully Documented & Verified:
- ✅ Next.js / React / TypeScript
- ✅ Convex (deployed, indexes synced)
- ✅ NextAuth.js (email auth working)
- ✅ Tailwind CSS / Shadcn UI
- ✅ Vercel deployment
- ✅ Jest / Playwright testing

### Needs Attention:
- ⚠️ OpenAI API - needs `OPENAI_API_KEY` in production
- ⚠️ HeyGen API - needs API key and avatar config
- ⚠️ Prisma - installed but not actively used (Convex is primary)
- ⚠️ PostgreSQL - local only, Convex handles production data

### Not Yet Configured:
- ❌ Email sending (Nodemailer/Resend)
- ❌ Analytics (Posthog/Mixpanel)
- ❌ Error tracking (Sentry)

---

## 🔄 Keeping Documentation Updated

When adding new features or dependencies:

1. **Update this file** with new technology entries
2. **Update CHANGELOG.md** with version bump
3. **Update README.md** if user-facing changes
4. **Run `npx convex deploy`** if schema changes
5. **Commit and push** to trigger CI/CD

---

**Last Updated:** January 3, 2026  
**Version:** 1.41.0

