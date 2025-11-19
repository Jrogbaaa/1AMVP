# 1Another MVP

A mobile-first patient communication and education platform that puts **the doctor at the center of the experience**. The platform combines a TikTok-style vertical video feed with a clean medical dashboard to deliver personalized follow-up content, educational videos, and healthcare engagement tools.

## 🎯 Core Philosophy

1. **The doctor is the product** - Patients always see their doctor's personalized video first
2. **Personal link = identity** - Unique magic links contain patient + doctor identity
3. **My Feed = engagement** - TikTok-style feed for active viewing and learning
4. **Dashboard = browsing** - Clean, calm UI for Library and Account pages
5. **Simplicity above all** - Remove complexity unless it adds compounding advantage

## 🏗️ Tech Stack

- **Next.js 15** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **PostgreSQL** - Primary data store
- **Convex** - Real-time features, feed algorithms, rate limiting
- **Lucide React** - Icons

## 📁 Project Structure

```
1A-MVP/
├── app/
│   ├── feed/              # TikTok-style vertical feed
│   ├── library/           # Video browsing dashboard
│   ├── account/           # Patient profile & settings
│   ├── content/           # SEO-optimized content pages
│   ├── api/               # API endpoints
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   └── sitemap.ts         # Sitemap generation
├── components/
│   ├── VideoCard.tsx      # TikTok-style video card
│   ├── ChatOnboarding.tsx # Chat-based onboarding
│   ├── HeartScore.tsx     # Health score indicator
│   ├── TrustBadge.tsx     # Privacy/security badge
│   ├── ScheduleAppointment.tsx  # Appointment scheduler
│   ├── RateLimitMessage.tsx     # Rate limit UI
│   └── SchemaMarkup.tsx   # SEO schema markup
├── convex/
│   ├── schema.ts          # Convex database schema
│   ├── feed.ts            # Feed logic & rate limiting
│   ├── videoEngagement.ts # Video tracking
│   └── chat.ts            # Chat & onboarding
├── db/
│   ├── schema.sql         # PostgreSQL schema
│   └── seed.sql           # Sample data
├── lib/
│   ├── types.ts           # TypeScript types
│   ├── utils.ts           # Utility functions
│   └── schema.ts          # SEO schema generators
└── public/
    ├── robots.txt         # SEO crawler config
    └── images/            # Static assets
```

## ✨ Latest Updates (v1.1.0 - Nov 19, 2024)

- **🔐 NextAuth.js Authentication**: Simple email + Google OAuth sign-in
- **🛡️ Protected Routes**: Feed, Library, and Account require authentication
- **👤 User Menu**: Sign-out functionality in all protected pages
- **✅ Vercel-Ready**: Perfect for Vercel deployment
- **⚡ No Database Required**: Credentials provider for easy testing
- **🚀 Next.js 16**: Updated to latest version with Turbopack

**Current Authentication:**
- ✅ Email sign-in (any email works in development)
- ✅ Google OAuth (optional - add credentials)
- ✅ JWT sessions (no database needed)
- ✅ Protected routes with Next.js 16 proxy

See [FINAL_FIX.md](./FINAL_FIX.md) for complete setup details.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ (or 16+)
- Convex account (for real-time features - **optional for auth**)
- Google OAuth credentials (optional - for Google sign-in)

### Installation

1. **Clone the repository**

```bash
cd /Users/JackEllis/1A-MVP
```

2. **Install dependencies**

```bash
npm install
```

3. **Install PostgreSQL**

```bash
# macOS (using Homebrew)
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16
```

4. **Set up the database**

```bash
# Create database
/opt/homebrew/opt/postgresql@16/bin/createdb 1another

# Run schema
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another -f db/schema.sql

# Load sample data
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another -f db/seed.sql

# Verify setup
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another -c "SELECT name FROM doctors;"
```

5. **Initialize Convex** (in a separate terminal)

```bash
npx convex dev
```

This will:
- Create a Convex project
- Generate required files in `convex/_generated/`
- Auto-update `.env.local` with deployment URLs
- Start the Convex development server

**Keep this terminal running!**

6. **Authentication is Ready!** ✅

Authentication is pre-configured and ready to use! Just run the dev server.

**No setup needed for testing** - any email works in development mode.

7. **Run the development server**

```bash
npm run dev
```

That's it! Auth works without Convex running.

8. **Test Authentication** 🧪

Visit [http://localhost:3000/auth](http://localhost:3000/auth)

- Enter any email (e.g., `test@example.com`)
- Click "Sign in with Email"
- You're signed in! ✅

Then visit protected routes:
- `/feed` - TikTok-style video feed
- `/library` - Video library
- `/account` - User profile

### Optional: Run Convex for Real-Time Features

```bash
npx convex dev  # In a separate terminal
```

**Note:** Convex is only needed for real-time feed updates, chat, and engagement tracking. Authentication works without it!

### Optional: Add Google OAuth

1. Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `.env.local`:
   ```bash
   AUTH_GOOGLE_ID=your-client-id
   AUTH_GOOGLE_SECRET=your-client-secret
   NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true
   ```
3. Restart dev server

### Sample Data Included

- **Doctors**: Dr. Sarah Johnson (Cardiology), Dr. Michael Chen (Primary Care)
- **Patient**: Dave Thompson (dave@example.com)
- **Videos**: 5 videos (1 personalized + 4 educational)

### Magic Link Access

The app is designed for magic link access. Test with the sample data:

```
http://localhost:3000/feed?p=650e8400-e29b-41d4-a716-446655440001&d=550e8400-e29b-41d4-a716-446655440001
```

This will load Dave Thompson's personalized feed from Dr. Sarah Johnson.

## 🎨 Key Features

### 1. TikTok-Style Feed (`/feed`)

- **Card #1**: Personalized doctor video with custom greeting
- **Cards 2+**: AI-curated educational content
- Vertical scroll with snap behavior
- Session-based rate limiting (20 videos per 30 minutes)
- Real-time engagement tracking

### 2. Chat-Based Onboarding

- Triggered from CTA on first video card
- Doctor avatar as assistant
- Lightweight, non-blocking experience
- Stores progress in Convex

### 3. Video Library (`/library`)

- Clean dashboard interface
- Search functionality
- Category filters
- Video grid with thumbnails
- SEO-optimized content pages

### 4. Patient Account (`/account`)

- Patient profile information
- Doctor information and contact
- Heart-based health score
- Appointment scheduling
- Quick actions and navigation

### 5. Heart Health Score

- **Green (>90%)**: Healthy/compliant
- **Yellow (50-89%)**: In progress
- **Red (<50%)**: Critical follow-ups needed

Score factors:
- Watched doctor video (30%)
- Completed onboarding (25%)
- Completed next steps (20%)
- Submitted calendar request (15%)
- Watched educational videos (10%)

### 6. Appointment Scheduling

- Simple date/time picker
- Request submission to `appointment_requests` table
- Confirmation messaging
- No direct calling required

### 7. Privacy & Trust

- Prominent security messaging throughout
- "Your information is secure and private to you and your doctor"
- Medical-grade trust indicators
- HIPAA-conscious design patterns

### 8. SEO Optimization

- AI crawler-friendly `robots.txt`
- Schema.org markup (VideoObject, Physician, MedicalOrganization)
- Semantic HTML structure
- Content pages for key topics
- Optimized meta tags and descriptions
- Automatic sitemap generation

## 📊 Database Schema

### PostgreSQL Tables

- `users` - Patient information
- `doctors` - Doctor profiles
- `videos` - Video content library
- `user_doctors` - Patient-doctor relationships
- `user_video_engagement` - Video tracking
- `appointment_requests` - Scheduling requests
- `feed_items` - Personalized feed (optional)
- `health_metrics` - Health score data
- `onboarding_state` - Onboarding progress

### Convex Tables

- `feedItems` - Real-time feed generation
- `chatMessages` - Onboarding chat
- `userSessions` - Rate limiting
- `videoEvents` - Engagement events
- `onboardingProgress` - Live progress

## 🎯 Development Guidelines

### Code Style

- Use **early returns** for readability
- Use **Tailwind classes** exclusively (no CSS files)
- Use **descriptive variable names**
- Event handlers prefixed with `handle` (e.g., `handleClick`)
- Use **const** instead of function declarations
- Implement **accessibility features** (aria-labels, tabindex, keyboard nav)

### Component Patterns

- Mobile-first responsive design
- TypeScript for type safety
- Client components marked with `"use client"`
- Suspense boundaries for async loading
- Error boundaries for graceful failures

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables (Production)

Update `.env.production` with production values:

```env
DATABASE_URL=your-production-db-url
CONVEX_DEPLOYMENT=your-production-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-production.convex.cloud
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📝 API Endpoints

### Core Routes

- `GET /` - Landing page (redirects to feed with params)
- `GET /feed?p={patientId}&d={doctorId}` - Personalized feed
- `GET /library` - Video library dashboard
- `GET /account` - Patient account page
- `GET /content/*` - SEO-optimized content pages

### API Routes (Future)

- `POST /api/appointments` - Create appointment request
- `GET /api/health-score` - Calculate health score
- `POST /api/video-event` - Track video engagement

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 🤝 Contributing

This is an MVP project. For production deployment:

1. Add authentication (NextAuth.js recommended)
2. Implement actual video hosting (Cloudflare Stream, Mux, etc.)
3. Set up email notifications (Resend, SendGrid)
4. Add analytics (Posthog, Mixpanel)
5. Implement proper error logging (Sentry)
6. Add unit and integration tests

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built for 1Another - Doctor-first patient engagement

---

**Need help?** Check the [CHANGELOG.md](./CHANGELOG.md) for updates or [ClaudeMD.md](./ClaudeMD.md) for detailed technical documentation.

