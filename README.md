# 1Another MVP

A mobile-first patient communication and education platform that puts **the doctor at the center of the experience**. The platform combines a TikTok-style vertical video feed with a clean medical dashboard to deliver personalized follow-up content, educational videos, and healthcare engagement tools.

## 🎯 Core Philosophy

1. **The doctor is the product** - Patients always see their doctor's personalized video first
2. **Personal link = identity** - Unique magic links contain patient + doctor identity
3. **My Feed = engagement** - TikTok-style feed for active viewing and learning
4. **Discover = exploration** - Instagram-style doctor profiles and educational content
5. **My Health = health actions** - Time-based reminders and healthcare provider tracking
6. **Simplicity above all** - Remove complexity unless it adds compounding advantage

## 🔐 Authentication System

The platform features a complete authentication system with role-based access:

- **Patients**: Sign in with any email → Get personalized health content
- **Doctors**: Sign in with `@1another.com`, `@1another.health`, or `@1another.ai` → Access Doctor Portal
- **Automatic Profile Creation**: User profiles persisted to Convex on first login
- **Doctor Auto-Setup**: Doctor profiles auto-created with HeyGen integration fields
- **Persistent Data**: All user data (videos, health profiles, settings) linked to user

## 🏗️ Tech Stack

- **Next.js 16** (App Router) - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/UI** - Component library
- **Convex** - Real-time database, feed algorithms, engagement tracking, user profiles
- **NextAuth.js v5** - Authentication with JWT sessions
- **HeyGen API** - AI avatar video generation
- **Lucide React** - Icons
- **GitHub Actions** - CI/CD quality gate

## 📁 Project Structure

```
1A-MVP/
├── .github/
│   └── workflows/
│       └── quality-gate.yml  # CI/CD pipeline
├── app/
│   ├── feed/              # TikTok-style vertical feed with doctor filtering
│   │   ├── page.tsx       # Feed page with skeleton loading
│   │   └── layout.tsx     # Feed metadata for SEO
│   ├── discover/          # Instagram-style doctor profiles & content
│   ├── my-health/         # Health dashboard with reminders & profile
│   ├── content/           # SEO-optimized content pages
│   ├── api/               # API endpoints
│   ├── layout.tsx         # Root layout with viewport config
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles + Shadcn CSS variables
│   └── sitemap.ts         # Sitemap generation
├── components/
│   ├── ui/                # Shadcn/UI primitives (10 components)
│   │   ├── avatar.tsx     # Profile images with fallbacks
│   │   ├── badge.tsx      # Status indicators
│   │   ├── button.tsx     # Button with variants
│   │   ├── card.tsx       # Card container
│   │   ├── dialog.tsx     # Modal dialogs
│   │   ├── drawer.tsx     # Bottom sheets (mobile)
│   │   ├── input.tsx      # Form inputs
│   │   ├── skeleton.tsx   # Loading placeholders
│   │   ├── sonner.tsx     # Toast notifications
│   │   └── tooltip.tsx    # Hover tooltips
│   ├── VideoCard.tsx      # TikTok-style video card
│   ├── FeedSkeleton.tsx   # Feed loading skeleton
│   ├── QACard.tsx         # Interactive Q&A check-in cards
│   ├── ReminderCard.tsx   # Health reminders card for feed
│   ├── OnboardingForm.tsx # 3-step patient onboarding
│   ├── ChatOnboarding.tsx # Chat-based onboarding
│   ├── HeartScore.tsx     # Health score indicator
│   ├── TrustBadge.tsx     # Privacy/security badge
│   ├── ScheduleAppointment.tsx  # Appointment scheduler
│   ├── RateLimitMessage.tsx     # Rate limit UI
│   ├── SchemaMarkup.tsx   # SEO schema markup
│   ├── DoctorMessagesWidget.tsx  # Patient-side messages from doctors
│   └── DoctorRemindersWidget.tsx # Patient-side reminders from doctors
├── app/doctor/            # Doctor Portal
│   ├── page.tsx           # Doctor dashboard
│   ├── layout.tsx         # Portal layout with sidebar navigation
│   ├── create-chapters/   # AI Studio - personalized video creation
│   ├── patients/          # Patient management
│   ├── messages/          # Messaging center (check-ins)
│   ├── my-messages/       # My Messages & Reminders management
│   ├── chapters/          # Video library
│   ├── send/              # Send content wizard
│   └── settings/          # Doctor settings & preferences
├── hooks/
│   ├── useUserSync.ts     # Auto-sync users to Convex on login
│   ├── useEngagement.ts   # Engagement tracking
│   └── useOffline.ts      # Offline detection
├── convex/
│   ├── schema.ts          # Convex database schema (users, doctors, videos, etc.)
│   ├── users.ts           # User CRUD operations & profile sync
│   ├── admin.ts           # Admin utilities (data reset)
│   ├── doctorProfiles.ts  # Doctor profile management
│   ├── preventiveCare.ts  # Preventive care profiles
│   ├── doctorMessageTemplates.ts  # Doctor message templates
│   ├── doctorMessages.ts  # Doctor-to-patient messages
│   ├── doctorReminderTemplates.ts # Doctor reminder templates
│   ├── patientReminders.ts # Patient reminders
│   ├── feed.ts            # Feed logic & rate limiting
│   ├── videoEngagement.ts # Video tracking
│   └── chat.ts            # Chat & onboarding
├── db/
│   ├── schema.sql         # PostgreSQL schema
│   └── seed.sql           # Sample data
├── lib/
│   ├── types.ts           # TypeScript types
│   ├── utils.ts           # Utility functions
│   ├── schema.ts          # SEO schema generators
│   ├── reminders.ts       # Shared reminders data
│   └── calendar-utils.ts  # ICS calendar file generation
└── public/
    ├── robots.txt         # SEO crawler config
    └── images/            # Static assets
```

## ✨ Latest Updates (v1.45.0 - Jan 3, 2026)

### 🎨 Landing Page Redesign - Tech-Forward Dark Theme

**Complete Marketing Landing Page:**
- Cinematic dark mode design with animated gradient mesh background
- "Your Doctor. Your Screen. Your Health." headline with gradient text
- Split CTAs: "I'm a Patient" / "I'm a Provider"
- Floating phone mockup with glow effects
- Asymmetric features section with glass morphism cards
- Animated stat counters and partner logos
- Editorial testimonial section

**Split-Screen Authentication:**
- Dramatic role selection: Patient (teal gradient) vs Doctor (dark professional)
- Each panel shows benefits and leads to existing onboarding flow
- Mobile-responsive with stacked layout

**New CSS Utilities:**
- Glass morphism, gradient borders, glow effects
- Staggered reveal animations
- Geometric patterns and animated backgrounds

---

### Previous Updates (v1.40.0 - Jan 2, 2026)

### 📬 Messages & Reminders System

**Doctor Portal - My Messages & Reminders:**
- New unified page for managing message and reminder templates
- Tabbed interface with Message Templates, Reminder Templates, and Suggested
- Create, edit, delete custom templates with usage analytics
- Frequency options: daily, weekly, one-time
- Category tagging: medication, appointment, lifestyle, custom

**Patient Widgets:**
- `DoctorMessagesWidget` - Shows messages from doctors with unread indicators
- `DoctorRemindersWidget` - Shows assigned reminders grouped by frequency
- Mark complete with animations, doctor attribution, due date badges

**Calendar Integration:**
- `.ics` file generation for adding reminders to any calendar
- Works with Google Calendar, Apple Calendar, Outlook
- "Add to Calendar" button on each reminder

---

### Previous Updates (v1.32.0 - Dec 18, 2024)

### 🎨 Shadcn CLI 3.0 Upgrade & New Components

**Component Library Expanded:**
- Upgraded to **Shadcn CLI 3.6.2** (3x faster installations)
- Added 6 new UI components: **Avatar, Badge, Dialog, Drawer, Sonner (toast), Tooltip**
- Total UI components now: **10** (was 4)
- Updated existing components with improved accessibility and new variants

**New Component Highlights:**
- `Sonner` - Modern toast notifications for feedback
- `Drawer` - Mobile-friendly bottom sheets
- `Avatar` - Doctor/patient profile images with fallbacks
- `Badge` - Status indicators (Verified, Premium, etc.)

---

### Previous Updates (v1.31.0 - Dec 18, 2024)

### 🎬 HeyGen AI Video Generation

**Complete AI Video Integration:**
- **HeyGen API v2** fully integrated for AI-powered video creation
- Doctors can generate personalized videos using their AI avatars
- One-click video cloning from templates or other doctors' content
- Async video generation with webhook/polling status updates

**Doctor Portal AI Features:**
- AI Avatar settings tab for HeyGen avatar/voice configuration
- Real "Generate" buttons on Create Chapters page
- Progress tracking with status badges (Pending → Generating → Completed)
- Video generation jobs tracked in database

**API Verified Working:**
- ✅ 1,289 HeyGen avatars available
- ✅ 2,406 HeyGen voices available  
- ✅ Test video generated in ~45 seconds
- ✅ Free tier works (10 credits/month, watermarked)

---

### Previous Updates (v1.24.0 - Dec 16, 2024)

### CI/CD & Developer Experience

**🚀 GitHub Actions Quality Gate:**
- Automated CI pipeline runs on every PR to `main`
- TypeScript type checking
- ESLint code quality
- Production build verification
- Security audit for dependencies
- No more "works on my machine" issues!

**🔒 Environment Validation:**
- Type-safe environment variables with `@t3-oss/env-nextjs`
- Build-time validation catches missing config early
- Zod schema for runtime safety

**🎨 Shadcn/UI Design System:**
- Initialized with Button, Card, Input, Skeleton components
- New `FeedSkeleton` component for loading states
- Prevents layout shift during feed loading

**📈 SEO Improvements:**
- Feed route metadata for social sharing
- OpenGraph and Twitter card tags
- Viewport and theme color configuration

---

### Previous Updates (v1.23.0 - Dec 16, 2024)

### In-Feed Q&A & Reminder Overlays

**🎯 In-Feed Overlay System:**
- Q&A and Reminder cards appear as overlays within the feed (not full-screen)
- Video plays underneath with semi-transparent backdrop
- Users must answer Q&A to continue (no X button to dismiss)
- Smooth slide-up animations for card appearance
- Reminder after 1st video, Q&A after every 2nd video

**💚 HeartScore - 1A Brand Gradient:**
- Heart icon always uses 1A brand green-blue gradient
- Colors: `#00BFA6` (teal) to `#00A6CE` (cyan)
- Consistent brand look regardless of health score

**💬 Automated Doctor Q&A:**
- Doctor messages page now uses structured Q&A instead of free-form chat
- Pre-defined check-in questions (feeling, medication, diet, exercise)
- Reduces doctor message overload with organized patient responses

**📦 Package Updates:**
- Next.js `^16.0.10`, React `^19.2.3`, react-dom `^19.2.3`

---

### Previous Updates (v1.22.0 - Dec 15, 2024)

### Multiple UI Enhancements

**ReminderCard - Doctor's Face Added:**
- Dr. Lisa Mitchell's avatar on reminder cards
- Stethoscope badge on doctor avatar

**Discover Page - Video Thumbnails:**
- All video thumbnails show doctor headshots
- Message notification badge on floating button

---

### Previous Updates (v1.14.0 - Dec 11, 2024)

### AI Studio Accessibility & Error Handling Improvements

**♿ Accessibility Enhancements:**
- Added keyboard navigation to chapter accordion headers (Enter/Space to expand)
- Added `aria-expanded`, `aria-controls`, and `role="button"` attributes
- Added `aria-label` to external HeyGen links for screen readers
- Added `aria-pressed` to video selection checkboxes
- Improved focus management throughout AI Studio

**🚨 Error & State Handling:**
- Added error banner for failed video generation attempts
- Added avatar training status detection (Active vs Not Trained states)
- Conditional UI when avatar needs training (amber warning theme)
- Generation buttons disabled until avatar is trained
- Dismissible error messages with clear guidance

**🎨 UX Improvements:**
- "Train Avatar" CTA changes to prominent amber button when not trained
- Added `cursor-not-allowed` style to disabled buttons
- Clear error messages guide users through the training flow

---

### Previous Updates (v1.13.0 - Dec 11, 2024)

### AI Studio & HeyGen Integration

**🎬 AI Studio (`/doctor/create-chapters`):**
- New dedicated page for creating personalized video chapters
- Template library with 10 educational chapters and 17+ videos
- Expandable accordion UI with video selection
- Batch video generation with multi-select
- Progress tracking (chapters personalized)
- Individual and bulk video generation buttons

**🤖 HeyGen AI Avatar Integration:**
- Train AI on doctor's likeness via HeyGen external link
- Avatar status display (Active/Not Trained)
- Personalize template scripts with doctor's AI avatar
- Video thumbnails with duration indicators

**📊 Dashboard AI Studio Section:**
- New "AI Studio" card on Doctor Dashboard
- Two-column layout: Train Avatar + Create Chapters
- 3-step "How it works" guide
- Quick navigation to create-chapters page

**🧭 Navigation Update:**
- Added "AI Studio" with Sparkles icon to Doctor Portal sidebar
- Positioned prominently after Dashboard

---

### Previous Updates (v1.12.0 - Dec 11, 2024)

### Send Content Wizard & Settings

**📤 Send Content Wizard (`/doctor/send`):**
- 3-step wizard: Select Patients → Choose Content → Review & Send
- Multi-select patient list with search
- Chapter selection with video counts
- Review summary before sending

**⚙️ Settings Page (`/doctor/settings`):**
- Profile settings with avatar upload
- Notification preferences
- Practice information management

---

### Previous Updates (v1.11.0 - Dec 11, 2024)

### Doctor Portal & Patient Onboarding

**👨‍⚕️ Doctor Portal (`/doctor`):**
- Full-featured dashboard for healthcare providers
- Analytics: Patients, Videos Watched, Completion Rate, Watch Time
- Recent Patient Activity with progress tracking
- Messages panel with unread indicators
- Popular Chapters section
- Quick action cards for common tasks

**📝 3-Step Patient Onboarding:**
- Step 1: Email address
- Step 2: Full name
- Step 3: Health insurance provider (searchable dropdown)
- Progress indicator dots
- Popular provider quick-select buttons
- Stores onboarding data in session

**🔐 Enhanced Auth:**
- Session now captures name and health provider
- Doctor Portal Login link on auth page
- Extended NextAuth types for health provider data

---

### Previous Updates (v1.10.0 - Dec 11, 2024)

**🎥 "Hey Dave" Personalized Video:**
- Personalized video as the first thing users see
- Hardcoded greeting text for demo purposes

**💬 Interactive Q&A Cards:**
- Check-in cards appear every 2 videos
- Animated gradient backgrounds
- 5 rotating health questions
- Emoji-enhanced answer options
- +3% health score boost for engagement

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
- **Videos**: 4 local videos (1 "Hey Dave" personalized + 3 Dr. Jack educational videos)
- **Reminder Card**: Health tasks sourced from My Health reminders
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
- **Card #2**: Reminder Card with health tasks from My Health
  - Coming Up: Annual appointments with Schedule buttons
  - Today: 3 checkable tasks (medication, blood pressure, walk)
  - This Week: Weekly goals (videos, water intake)
  - Progress tracking and score boost badges
- **Cards 3+**: Dr. Jack educational videos
- **Q&A Cards**: Interactive check-in cards appear periodically
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

## 🧪 Testing & CI/CD

### Local Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Build check
npm run build
```

### GitHub Actions Quality Gate

Every PR to `main` automatically runs:

1. **TypeScript Check** - Catches type errors before merge
2. **ESLint** - Enforces code quality standards
3. **Build** - Ensures production build succeeds
4. **Security Audit** - Flags vulnerable dependencies

PRs cannot be merged if any check fails. This eliminates "works on my machine" issues.

See `.github/workflows/quality-gate.yml` for the full pipeline configuration.

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

