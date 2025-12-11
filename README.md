# 1Another MVP

A mobile-first patient communication and education platform that puts **the doctor at the center of the experience**. The platform combines a TikTok-style vertical video feed with a clean medical dashboard to deliver personalized follow-up content, educational videos, and healthcare engagement tools.

## 🎯 Core Philosophy

1. **The doctor is the product** - Patients always see their doctor's personalized video first
2. **Personal link = identity** - Unique magic links contain patient + doctor identity
3. **My Feed = engagement** - TikTok-style feed for active viewing and learning
4. **Discover = exploration** - Instagram-style doctor profiles and educational content
5. **My Health = health actions** - Time-based reminders and healthcare provider tracking
6. **Simplicity above all** - Remove complexity unless it adds compounding advantage

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
│   ├── feed/              # TikTok-style vertical feed with doctor filtering
│   ├── discover/          # Instagram-style doctor profiles & content
│   ├── my-health/         # Health dashboard with reminders & profile
│   ├── content/           # SEO-optimized content pages
│   ├── api/               # API endpoints
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   └── sitemap.ts         # Sitemap generation
├── components/
│   ├── VideoCard.tsx      # TikTok-style video card
│   ├── QACard.tsx         # Interactive Q&A check-in cards
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

## ✨ Latest Updates (v1.10.0 - Dec 11, 2024)

### "Hey Dave" Personalized Video & Interactive Q&A Cards

**🎥 New First Video - "Hey Dave":**
- Personalized `hey dave.mp4` video as the first thing users see
- Hardcoded "Hey Dave" greeting text for demo purposes
- Associated with Dr. Jack Ellis
- Clean, consistent messaging throughout the app

**💬 Interactive Q&A Cards:**
- New check-in cards that appear every 2 videos in the feed
- Beautiful animated gradient background (teal → blue → purple)
- Floating shapes with modern, flowing design
- 5 rotating questions:
  - "How are you feeling today?"
  - "How are your new medications working?"
  - "How has your sleep been lately?"
  - "Have you been staying active?"
  - "How's your stress level?"
- Emoji-enhanced answer options
- Visual feedback with "Sent!" confirmation
- +3% health score boost for engagement

**🎨 New Animations:**
- Gradient shift animation for Q&A backgrounds
- Floating bubble effects
- Pulse glow animations

---

### Previous Updates (v1.9.0 - Dec 4, 2024)

**👨‍⚕️ New Doctor - Dr. Jack Ellis:**
- Added Dr. Jack Ellis as the 4th cardiologist on the platform
- 3 custom videos with local video file support
- Full integration with doctor filtering and sidebar

**🔊 Volume Toggle:**
- Added mute/unmute button to all video cards
- Top-right positioning with sleek dark backdrop
- Videos start muted (required for autoplay)
- Click to enable audio playback

**🔄 Video Restart on Scroll:**
- Videos automatically restart from beginning when scrolling back
- Fresh viewing experience each time you return to a video

**🗑️ Removed Rate Limiting:**
- Removed session limits from feed
- Users can scroll through unlimited videos
- Cleaner, uninterrupted browsing experience

**🎨 Cleaner Video UI:**
- Removed large overlapping doctor header bar
- Videos now take full card space
- Selected doctor shown in sidebar (highlighted in teal)

---

### Previous Updates (v1.8.0 - Dec 3, 2024)

**🏥 Dual Insurance Logos:**
- Added **Kaiser Permanente** and **UnitedHealthcare** logos in dashboard headers
- Both logos visible on Discover and My Health pages
- Kaiser logo in dark blue badge, UnitedHealthcare with shield icon
- Insurance card section on My Health shows both providers

**🎨 UI Cleanup:**
- Removed "Keep it up!" status text from headers
- Cleaner HeartScore display (percentage only)
- Updated chat onboarding message to colonoscopy reminder

---

### Previous Updates (v1.6.0 - Dec 3, 2024)

### Major UI Overhaul - Clean White Design

**🖥️ Desktop Left Sidebar (TikTok-Style):**
- Persistent left sidebar on desktop (lg+ breakpoint)
- Clean white background with subtle gray borders
- Full 1Another logo at top
- Navigation: My Feed, Discover, My Health
- "Your Doctors" section with avatars
- User profile at bottom
- Custom icons (not TikTok's):
  - My Feed: 4-square grid
  - Discover: Compass
  - My Health: ECG line

**🎨 White Theme Throughout:**
- Entire feed page uses white background
- Sidebar, main content, and action buttons all white
- Text colors optimized for light background

**💚 Heart Score Enhancements:**
- "+X%" badges on all action items showing score increase
- Green check animation flows into heart on completion
- Heart pulses when score increases
- **100% Score Special Effect:**
  - 1A brand teal-cyan gradient glow
  - Animated glowing effect
  - "Perfect! 🎉" celebration message

**📋 My Health Improvements:**
- Annual Reminders moved to FIRST position
- Each action shows potential score increase:
  - Annual Physical: +15%
  - Cholesterol Screening: +10%
  - Daily tasks: +2% to +5%
- Dynamic score calculation based on completed items

**🔤 Label Updates:**
- "For You" → "My Feed"
- "Health" → "My Heart" (under heart icon)
- "Doctor" → actual doctor name (e.g., "Dr. Sarah")

---

### Previous Updates (v1.5.0 - Dec 3, 2024)

**🎨 Professional Heart Score Design:**
- Unified heart design across all pages
- Elegant gradient fills by score level
- Professional drop shadows and animations

**🎯 Video Feed Improvements:**
- 1A watermark on all videos
- Personalized greetings
- Appointment reminders

**🔍 Discover Page Enhancements:**
- Working specialty filters
- Doctor profile filtering
- Add/checkmark badges for doctors

**🏥 My Health Dashboard:**
- Time-based action organization (Today, This Week, This Year)
- Healthcare provider cards
- Kaiser Permanente integration

---

## Previous Updates (v1.4.0 - Nov 21, 2024)

### UI Refinements & Hospital Branding

**🏥 Hospital Group Integration:**
- Kaiser Permanente branding in Discover page header
- Professional logo display with branded background
- Multi-organization support ready

**🎯 Enhanced Discover Page:**
- Page title changed to "Your Doctors"
- Subtitle: "Explore content from your experts"
- Organized content sections: "Cardiology" and "Nutrition and Exercise"
- Filter by category: All, Cardiology, Nutrition and Exercise
- Cardiology topic filters: Blood Pressure, Heart Disease, Arrhythmia, Cholesterol
- Green "+" button for suggested doctors to add
- First three doctors pre-added to user's network

**📱 Feed Page Improvements:**
- Static doctor photos instead of videos (faster loading)
- Discover icon integrated into each VideoCard (no longer floating)
- Discover icon positioned above profile photo
- Improved icon transparency and positioning
- All videos now display high-quality doctor portraits

**🔔 Action Items & Reminders:**
- All reminders now use "Schedule" prefix for clarity
- Schedule Colonoscopy
- Schedule Blood Test
- Schedule Follow-Up Visit
- Schedule Stress Test

**💬 Chat Messaging Enhancement:**
- "Schedule Follow-Up" button added to top of doctor messaging
- Quick access to appointment scheduling within chat

### Previous Updates (v1.3.0 - Nov 20, 2024)

**🎨 Navigation Structure:**
- **My Feed** - Your personalized video feed (formerly "Feed")
- **Discover** - Instagram-style doctor profiles & educational content (formerly "Library")
- **My Heart** - Health dashboard with daily reminders & profile (formerly "Account")

**🔍 Discover Page:**
- Instagram-style doctor profile carousel with gradient rings
- 12+ mock doctor profiles for exploration
- Click any doctor to view their video feed
- Featured educational content cards
- "NEW" badges for featured doctors

**👨‍⚕️ Doctor Filtering:**
- Filter feed by specific doctors
- Doctor header shows who you're watching
- Back button to return to all videos
- Deep linking support (`/feed?doctor=<id>`)

**❤️ My Heart Page Redesign:**
- Interactive daily health reminders (6 tasks)
- Real-time progress tracking (X of 6 completed)
- Check-off animations with visual feedback
- Doctor scheduling in sidebar (secondary)
- Account information moved below reminders
- Health score prominently displayed

**Previous Updates (v1.2.0):**
- **📱 Streamlined Feed Interface**: Cleaner video experience with simplified controls
- **❤️ Interactive Heart Score**: Click to view action items and daily reminders
- **👨‍⚕️ Clickable Doctor Avatar**: Tap doctor profile to message directly
- **🎬 Local Video Support**: Personalized videos from local assets (`videoplayback.mp4`)
- **🔊 Muted Autoplay**: Videos auto-play on scroll without sound (browser-friendly)
- **🎯 Smart Share Button**: Only shows on educational videos, hidden on personalized content
- **📍 Optimized Layout**: Bottom-aligned text and action buttons for better mobile UX
- **✅ Action Items Menu**: View and check off daily health tasks and reminders

**Previous Updates (v1.1.2):**
- **💬 Floating Message Button**: Message your doctor from Library and Account pages
- **🧭 Feed Navigation**: Quick access buttons to Library and Schedule appointments
- **🎨 Medical-Themed Images**: Professional doctor photos and health-related thumbnails
- **🚀 Vercel Deployment Ready**: Complete guides and auto-deploy on GitHub push
- **❤️ Fixed Heart Animation**: Proportional fill based on exact health score percentage

**Previous Updates (v1.1.0):**
- **🔐 NextAuth.js Authentication**: Simple email + Google OAuth sign-in
- **🛡️ Protected Routes**: My Feed, Discover, and My Heart require authentication
- **👤 User Menu**: Sign-out functionality in all protected pages
- **✅ Vercel-Ready**: Perfect for Vercel deployment
- **⚡ No Database Required**: Credentials provider for easy testing
- **🚀 Next.js 16**: Updated to latest version with Turbopack

**Current Authentication:**
- ✅ Email sign-in (any email works in development)
- ✅ Google OAuth (optional - add credentials)
- ✅ JWT sessions (no database needed)
- ✅ Protected routes with Next.js 16 proxy

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for deployment details.

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
- `/feed` - My Feed - TikTok-style video feed
- `/discover` - Discover - Instagram-style doctor profiles & content
- `/my-heart` - My Heart - Health dashboard with daily reminders

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

- **Doctors**: Dr. Sarah Johnson, Dr. Michael Chen, Dr. Emily Rodriguez, Dr. Jack Ellis (all Cardiology)
- **Patient**: Dave Thompson (dave@example.com)
- **Videos**: 9 videos (1 "Hey Dave" personalized + 4 educational + 3 Dr. Jack videos + 1 follow-up)
- **Q&A Cards**: 5 interactive check-in questions (feeling, medications, sleep, exercise, stress)

### Magic Link Access

The app is designed for magic link access. Test with the sample data:

```
http://localhost:3000/feed?p=650e8400-e29b-41d4-a716-446655440001&d=550e8400-e29b-41d4-a716-446655440001
```

This will load Dave Thompson's personalized feed from Dr. Sarah Johnson.

## 🎨 Key Features

### 1. My Feed (`/feed`)

- **Card #1**: "Hey Dave" personalized video greeting
- **Cards 2+**: AI-curated educational content with doctor explanations
- **Q&A Cards**: Interactive check-in cards appear every 2 videos
  - Health check-ins: feeling, medications, sleep, exercise, stress
  - Animated gradient backgrounds with floating shapes
  - Emoji-enhanced answer options
  - Visual feedback with confirmation messages
- **Doctor Filtering**: View videos from specific doctors via URL parameter
- Vertical scroll with snap behavior
- Muted autoplay for browser compatibility
- Real-time engagement tracking
- **Interactive Elements**:
  - Clickable doctor avatar to message
  - Clickable heart to view action items
  - Share button on educational videos
  - Calendar button for appointment scheduling
  - Doctor header with back navigation when filtered

### 2. Discover (`/discover`)

- **Instagram-Style Doctor Profiles**: Circular avatars with gradient rings
- 12+ doctor profiles to explore
- Click any doctor to filter feed by their videos
- Featured educational content cards
- "NEW" badges for featured doctors
- Clean dashboard interface with SEO-optimized content

### 3. My Heart (`/my-heart`)

- **Daily Health Reminders**: Interactive checklist with 6 daily tasks
  - Take morning medication
  - 30-minute walk
  - Log blood pressure
  - Watch educational video
  - Drink water
  - Get adequate sleep
- **Real-time Progress Tracking**: X of 6 completed counter
- **Check-off Animations**: Visual feedback with green highlights and strikethrough
- **Doctor Scheduling**: Quick access in sidebar
- **Patient Profile**: Account information and settings
- **Health Score Display**: Heart-based health indicator
- Quick navigation to other sections

### 4. Chat-Based Onboarding

- Triggered from CTA on first video card
- Doctor avatar as assistant
- Lightweight, non-blocking experience
- Stores progress in Convex

### 5. Heart Health Score

Interactive heart icon with color-coded filling animation:
- **Green (≥70%)**: Great progress
- **Yellow (40-69%)**: Keep it up
- **Red (<40%)**: Let's improve together

**Click the heart to view**:
- Today's action items and reminders
- Medication schedules
- Daily activity goals
- Health logging tasks
- Educational video recommendations

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

### Quick Deploy to Vercel (Recommended)

**Automatic deployments on every push to GitHub!** 🎉

See the comprehensive deployment guides:
- **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)** - Complete step-by-step instructions
- **[VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)** - Environment variables quick reference

### Quick Start:

```bash
# 1. Deploy Convex to production
npx convex deploy --prod

# 2. Commit and push to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# 3. Connect GitHub to Vercel
# Go to vercel.com → Import from GitHub
# Add environment variables from VERCEL_ENV_VARIABLES.md
# Click Deploy!
```

Once connected, **every push to `main` automatically deploys** to production! ✅

### Environment Variables (Production)

Required variables for Vercel (see [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)):

```env
# Authentication
AUTH_SECRET=ONHeIQHjG7f6PvZEHitgrembBs5iBlMPL7TydQNv2jI=
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://your-vercel-url.vercel.app

# Database (Vercel Postgres recommended)
DATABASE_URL=postgresql://user:pass@host/db

# Convex (run: npx convex deploy --prod)
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# App URL
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### Build for Production

```bash
npm run build
npm start
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

