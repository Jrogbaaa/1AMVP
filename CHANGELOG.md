# Changelog

All notable changes to the 1Another MVP project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2024-12-03

### 🎨 Major UI Overhaul - Clean White Design

**Desktop Left Sidebar:**
- Added TikTok-style persistent left sidebar on desktop (lg+ breakpoint)
- Clean white background with subtle gray borders
- Full 1Another logo at top (1another-logo.png)
- Navigation links: My Feed (active), Discover, My Health
- "Your Doctors" section with doctor avatars and names
- User profile section at bottom (Dave Thompson)
- Custom icons distinct from TikTok:
  - My Feed: 4-square grid icon
  - Discover: Compass with inner pointer
  - My Health: ECG/heartbeat line

**White Theme Throughout:**
- Entire feed page now uses white background
- Left sidebar: white with gray-100 borders
- Main content area: white background
- Right sidebar: white with dark text
- Text colors adjusted for visibility on light background

**My Feed Navigation:**
- Changed "For You" → "My Feed"
- Active state with light gray background
- Teal accent color on icons (1A brand)

**Right Sidebar Updates:**
- Changed "Health" → "My Heart" under heart icon
- Changed "Doctor" → actual doctor's first name (e.g., "Dr. Sarah")
- Darker text colors (gray-700) for white background

### ✨ Enhanced - My Health Page

**Annual Reminders First:**
- Moved annual reminders (This Year) to top of action items
- New section header: "🗓️ Annual Reminders"
- Gradient background (primary-50 to blue-50)
- Each reminder shows heart score increase:
  - Annual Physical Exam: +15%
  - Cholesterol Screening: +10%
  - Flu Vaccination: +5%

**Heart Score Increase Labels:**
- All action items now show "+X%" badges
- Daily tasks: +2% to +5%
- Weekly tasks: +3% to +5%
- Annual reminders: +5% to +15%
- Green badge styling (emerald-100 background)

**Check Animation:**
- Green checkmark scales in with spring animation
- Heart pulses when items are completed
- Dynamic score calculation based on completed items

### 💎 Enhanced - Heart Score at 100%

**1A Brand Glow Effect:**
- Special teal-cyan gradient glow when score reaches 100%
- Animated glow effect (heart-glow-1a keyframes)
- Colors: #00BFA6 (teal) → #00A6CE (cyan)
- Enhanced drop shadows for celebration effect
- Special message: "Perfect! 🎉"

**CSS Animations Added:**
- `animate-check-complete`: Green check scale animation
- `animate-heart-pulse`: Heart pulse on score increase
- `heart-glow-100`: Glowing effect for 100% score
- `heart-gradient-1a`: 1A brand gradient fill

### 🔧 Changed

- "This Day" → "Today" in My Health page
- Removed black sidebar theme in favor of clean white
- Updated all sidebar text colors for light theme

### 📦 Dependencies
- No new dependencies added

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.5.0] - 2024-12-03

### 🎨 Added - Brand Logo Integration

**1A Icon on Videos:**
- Added 1A brand icon watermark to top-left of all video cards
- Subtle opacity (50%) with drop shadow for visibility
- Stays with each video as you scroll (not floating)
- Located at `/public/images/1a-icon.png`

**1Another Full Logo:**
- Full "1Another - Intelligent Health" wordmark in dashboard headers
- Displayed on Discover and My Health pages
- Larger size (h-16) for better visibility
- Located at `/public/images/1another-logo.png`

### 🖥️ Added - TikTok-Style Desktop Layout

**Desktop Left Sidebar:**
- Full navigation sidebar on large screens (lg+)
- Shows 1Another logo at top
- Navigation links: For You, Discover, My Health
- "Your Doctors" section with all doctor avatars
- User profile section at bottom
- Fixed position, always visible

**Desktop Video Layout:**
- Video centered with 9:16 aspect ratio
- Rounded corners and shadow on desktop
- Action buttons in sidebar to the right of video
- Buttons include: Discover, Doctor avatar, Health score, Share
- Each button has icon + label below

**Mobile Unchanged:**
- Action buttons remain inside video on mobile
- Bottom navigation bar preserved
- Full-screen video experience maintained

### ✨ Enhanced - Health Score Animations

**100% Score Special Treatment:**
- Custom 1A brand gradient (teal to cyan) when health score reaches 100%
- Glowing animation effect on heart icon
- Special celebration message: "Perfect! You're at 100%! 🎉"
- SVG gradient fills for brand consistency

**Action Item Badges:**
- Each action item now shows potential score increase
- Green badges: "+10%", "+8%", "+15%", "+12%"
- Helps users understand impact of completing tasks

### 🔧 Changed

**Terminology Update:**
- Changed "This Day" → "Today" in My Health page
- More natural language for daily tasks section

**Navigation Tabs Restored:**
- Desktop header now shows: My Feed, Discover, My Health tabs
- Active tab highlighted with underline
- Consistent navigation across all dashboard pages

**Removed Navigation Text from Feed:**
- Feed page on desktop uses sidebar instead of header tabs
- Cleaner video viewing experience

### 🐛 Fixed

- Removed duplicate logo display on videos (was showing twice)
- Fixed desktop layout not centering video properly
- Fixed action buttons overlapping video content on desktop

### 📦 Dependencies
- No new dependencies added

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

## [1.4.0] - 2024-11-21

### 🏥 Added - Hospital Group Integration

**Kaiser Permanente Branding:**
- Kaiser Permanente logo displayed in Discover page header
- Professional branded background color (#003A70)
- Multi-organization branding support ready
- Logo image at `/public/images/kaiser-logo.png`

### ✨ Enhanced - Discover Page

**Page Restructure:**
- Page title changed from "Discover Doctors" → **"Your Doctors"**
- Subtitle updated to: "Explore content from your experts"
- Content organized into two main sections:
  - **Cardiology** section (heart health content)
  - **Nutrition and Exercise** section (wellness content)

**Filtering System:**
- Category filter buttons: All, Cardiology, Nutrition and Exercise
- Cardiology topic filters:
  - All Topics
  - Blood Pressure
  - Heart Disease
  - Arrhythmia
  - Cholesterol
- Topics appear when Cardiology category is selected
- Active filter styling with primary color highlighting

**Doctor Discovery:**
- Green "+" button appears on doctors not yet added
- Button positioned at bottom-right corner of avatar (subtle, doesn't cover face)
- First three doctors pre-added to user's network
- Click "+" to add doctor to your feed
- White border on add button for visual clarity

### 🎨 Changed - Feed Page

**Static Doctor Photos:**
- Replaced video playback with static doctor portrait photos
- Removed play/pause button (no longer needed)
- Faster page load with image-only display
- High-quality doctor portraits using Unsplash images
- Grayscale filter on first doctor for professional look

**Discover Icon Redesign:**
- Moved from floating position to integrated in each VideoCard
- Positioned just above doctor profile photo in action column
- No longer fixed/floating on scroll
- Moves naturally with each card
- Improved transparency (bg-white/50)
- Better alignment with other action buttons
- Search icon with 6-unit gap spacing

### 🔔 Updated - Action Items & Reminders

**Reminder Naming:**
- All reminders now include "Schedule" prefix for clarity:
  - Schedule Colonoscopy (replaces "Take morning medication")
  - Schedule Blood Test (replaces "30-minute walk")
  - Schedule Follow-Up Visit (replaces "Log blood pressure")
  - Schedule Stress Test (replaces "Watch educational video")
- More actionable and clear for patients
- Consistent terminology across the app

### 💬 Enhanced - Chat Messaging

**Schedule Follow-Up Button:**
- New button added at top of ChatOnboarding component
- Positioned directly below doctor header
- Full-width primary button
- Quick access to scheduling without leaving chat
- Maintains conversation context while scheduling

### 🔧 Technical Changes

**Component Updates:**
- `VideoCard.tsx`: Removed video element, added discover icon, static images
- `ChatOnboarding.tsx`: Added schedule button in header
- `feed/page.tsx`: Updated mock video data with doctor photos
- `discover/page.tsx`: Added filters, hospital branding, add buttons

**Image Assets:**
- Added Kaiser Permanente logo to `/public/images/`
- Updated doctor portrait URLs for better visual consistency
- Removed video URLs (using poster images as static content)

### 🎯 UX Improvements

**Discover Page:**
- More intuitive navigation with clear category sections
- Topic filtering for precise content discovery
- Visual cues for suggested doctors to add
- Professional hospital branding builds trust

**Feed Experience:**
- Faster loading with static images
- Discover functionality integrated per-card
- No floating elements that obscure content
- Cleaner, more focused viewing experience

**Action Clarity:**
- "Schedule" prefix makes reminders immediately actionable
- Reduces cognitive load (clear what to do)
- Aligns with healthcare appointment terminology

### 📦 Dependencies
- No new dependencies added

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

## [1.3.0] - 2024-11-20

### 🎨 Major Navigation & Feature Overhaul

**Navigation Restructure:**
- Renamed "Feed" → **"My Feed"** - Personalized video feed
- Renamed "Library" → **"Discover"** - Instagram-style doctor exploration
- Renamed "Account" → **"My Heart"** - Health dashboard and reminders
- Updated all internal links, routes, and navigation across entire app
- Updated protected route middleware (`/feed`, `/discover`, `/my-heart`)
- Updated sitemap and SEO configurations

### ✨ Added - Discover Page (Instagram-Style)

**Doctor Profile Carousel:**
- 12 mock doctor profiles with professional images
- Instagram-style circular avatars with gradient rings (primary → pink → yellow)
- Horizontal scrollable carousel with smooth animations
- "NEW" badges for featured doctors (first 3 profiles)
- Click any doctor to filter feed by their videos
- Hover scale effects for better UX

**Featured Content Section:**
- 3 featured educational video cards
- High-quality medical imagery
- Play button overlays on hover
- Duration badges
- Category tags
- Direct links to feed

**Design Elements:**
- Clean dashboard interface
- Professional medical imagery
- Mobile-responsive carousel
- Trust badge at bottom
- Consistent with brand design system

### ✨ Added - Doctor Filtering System

**Feed Filtering:**
- URL parameter support: `/feed?doctor=<doctorId>`
- Filter videos by specific doctors
- Doctor header shows current doctor when filtered
- Back button to return to all videos
- Mock doctor data mapped to video content

**Doctor Header:**
- Shows when viewing filtered content
- Doctor's profile image and name
- Specialty display
- Back navigation with arrow icon
- White card with backdrop blur effect
- Mobile-responsive design

### ✨ Added - My Heart Page Redesign

**Priority Reorganization:**
- **Left Column (2/3 width) - PRIMARY:**
  - Health score summary card with gradient background
  - Daily action items checklist (6 tasks)
  - Quick actions menu
- **Right Column (1/3 width) - SECONDARY:**
  - Your doctor card (compact)
  - Schedule follow-up button
  - Trust badge
- **Bottom Row (full width):**
  - Account information card
  - Profile details in grid layout
  - Sign out button

**Interactive Health Reminders:**
- 6 daily health tasks with checkboxes:
  - Take morning medication (with time)
  - 30-minute walk
  - Log blood pressure (with target)
  - Watch educational video
  - Drink 8 glasses of water
  - Get 7-8 hours of sleep
- Real-time progress tracking: "X of 6 completed"
- Click to check/uncheck items
- Visual feedback with animations:
  - Green background when completed
  - Checkmark icon fill
  - Strikethrough text
  - Border highlight
- Smooth state transitions
- Persistent state during session

**Visual Improvements:**
- Gradient health score card (primary-50 to blue-50)
- Status badge with color coding
- Cleaner doctor card layout
- Grid-based contact information
- Better visual hierarchy
- Mobile-optimized layout

### 🔧 Changed

**Folder Structure:**
- Moved `app/library/` → `app/discover/`
- Moved `app/account/` → `app/my-heart/`
- Updated all import paths

**Navigation Updates:**
- Updated mobile bottom navigation (all pages)
- Updated desktop header navigation (all pages)
- Updated landing page demo links
- Updated content page breadcrumbs
- New icons: Heart icon for My Heart tab

**Route Protection:**
- Updated proxy middleware for new routes
- Updated sitemap generation
- Updated SEO metadata

**Documentation:**
- Updated README.md with new structure
- Updated CHANGELOG.md with all changes
- Updated project philosophy
- Updated features documentation
- Updated getting started guide

### 🎯 UX Improvements

**Discover Page:**
- More engaging doctor discovery experience
- Visual similarity to Instagram stories
- Clear call-to-action (click to view videos)
- Professional medical branding

**My Heart Page:**
- Action-oriented layout prioritizes daily health tasks
- Visual gamification with progress tracking
- Immediate feedback on task completion
- Less cluttered, more focused interface
- Account info easily accessible but not primary

**My Feed:**
- Context-aware with doctor filtering
- Easy navigation between all videos and doctor-specific
- Visual consistency with doctor profiles

### 📦 Dependencies
- No new dependencies added (all features use existing stack)

### 🔄 Breaking Changes
- URLs changed: `/library` → `/discover`, `/account` → `/my-heart`
- Bookmark/saved links to old routes will need updating
- API routes remain unchanged

## [1.2.0] - 2024-11-20

### ✨ Added
- **Interactive Action Items Menu**
  - Click heart score to view daily action items and reminders
  - Modal overlay with health tasks checklist:
    - Take morning medication (with time due)
    - 30-minute walk (daily activity recommendation)
    - Log blood pressure (morning reading)
    - Watch educational video
  - Health score summary card at top of menu
  - Mobile-responsive design (slides up from bottom on mobile, centered modal on desktop)
  - Backdrop click to close
  - Smooth open/close animations

- **Clickable Doctor Avatar on Feed**
  - Doctor's circular profile image launches messaging
  - Hover scale effect for better UX
  - Consistent across all video cards
  - Accessible with proper aria-labels

- **Local Video Support**
  - Personalized video now uses `/videoplayback.mp4` from project root
  - Support for local video assets in addition to external URLs
  - Maintains external URLs for educational content

### 🎨 Changed
- **Streamlined Feed Interface**
  - Removed "Message your doctor" button from bottom CTA
  - Removed like button from video controls
  - Removed comment/message button from side actions
  - Removed save/bookmark button
  - Removed large "Start onboarding" button
  - Kept only essential controls: Share button and Calendar button

- **Simplified Video Layout**
  - Moved personalized greeting text to bottom ("Hey Dave, thanks for coming in today!")
  - Increased greeting text size (text-2xl) for better readability
  - Removed top-positioned large greeting banner
  - Removed description text from personalized videos
  - Bottom-aligned all content for better mobile UX

- **Navigation Improvements**
  - Removed Library button (keeping only Calendar button)
  - Removed UserMenu (person icon) from top left
  - Moved Calendar button to bottom-left position (bottom-48)
  - Increased z-index for navigation elements (z-50) to ensure proper layering
  
- **Share Button Behavior**
  - Share button only appears on educational videos
  - Hidden on personalized doctor videos
  - Positioned at bottom-right, aligned with text

- **Heart Score Redesign**
  - Moved from top-right corner to inline with video actions
  - Positioned above share button on right side
  - Increased size (w-14 h-14) for better visibility
  - Added proper color-coded gradient fill:
    - Green (≥70%): Great progress
    - Yellow (40-69%): Keep it up
    - Red (<40%): Let's improve together
  - Bottom-to-top fill animation using clip-path
  - Made interactive with click handler
  - Hover scale effect for clickability indicator

### 🔧 Fixed
- **Video Playback Error (AbortError)**
  - Added async/await handling with try-catch for play() method
  - Implemented cleanup with mounted flag
  - Added `video.isConnected` checks to prevent DOM removal errors
  - Added proper useEffect cleanup function
  - Prevents "play() interrupted by pause()" errors
  - Prevents "media removed from document" errors

- **Video Autoplay**
  - Added `muted` attribute to enable autoplay without user interaction
  - Browsers require videos to be muted for autoplay
  - Prevents "NotAllowedError: user didn't interact with document" errors
  - Maintains smooth scroll-to-play experience

### 📦 Dependencies
- No new dependencies added (all features use existing stack)

### 🎯 UX Improvements
- Cleaner, more focused feed interface
- Reduced visual clutter with minimal controls
- Better mobile ergonomics with bottom-aligned content
- More intuitive interaction patterns (click doctor to message, click heart for tasks)
- Consistent action button styling and positioning
- Improved text readability with proper positioning and sizing

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

## [1.1.2] - 2024-11-19

### ✨ Added
- **Floating Message Button** on Library and Account pages
  - Primary blue circular button in bottom-right corner
  - Opens ChatOnboarding modal to message doctor directly
  - MessageCircle icon with smooth hover animations
  - Positioned above mobile navigation on mobile devices (bottom-20)
  - Desktop positioning at bottom-8
  - Accessible with aria-labels
  - Consistent UX across all main pages for doctor communication

- **Navigation Buttons on Feed Page**
  - Library button with book icon - navigates to video library
  - Calendar button with calendar icon - navigates to account page for scheduling
  - Positioned on left side, vertically centered
  - White rounded buttons with backdrop blur effect
  - Smooth scale and color transitions on hover
  - Fully accessible with keyboard navigation

### 🎨 Changed
- **Replaced All Placeholder Images with Medical-Themed Images**
  - Doctor avatars now show professional medical personnel in uniform (Unsplash)
  - Feed video thumbnails feature medical equipment and healthcare settings
  - Library video thumbnails show health activities and wellness themes
  - Account page doctor photo updated to professional medical image
  - All images optimized and sourced from Unsplash for consistency

### 🚀 Deployment
- **Convex Generated Files** now committed to repository
  - Fixed Vercel build error with missing `convex/_generated` files
  - Build now succeeds on Vercel without additional configuration
  - Temporary solution until proper build-time generation is configured

- **Simplified Environment Variables Guide**
  - Created `VERCEL_ENV_PASTE_SIMPLE.txt` for quick deployment
  - Clarified that PostgreSQL is optional (Convex handles database)
  - Streamlined setup process for faster deployment

## [1.1.1] - 2024-11-19

### ✨ Added
- **Vercel Deployment Documentation**
  - `VERCEL_DEPLOYMENT_GUIDE.md` - Complete step-by-step deployment guide
  - `VERCEL_ENV_VARIABLES.md` - Environment variables quick reference
  - Automatic deployment on GitHub push instructions
  - Production environment configuration guide
  - Convex production deployment steps
  - Database setup for production (Vercel Postgres)
  - Google OAuth redirect URI configuration
  - Post-deployment testing checklist
  - Troubleshooting common deployment issues

### 🐛 Fixed
- **HeartScore Component Fill Animation**
  - Fixed heart fill to properly fill from bottom to top using `clip-path`
  - Removed incorrect `rounded-full` class that was clipping heart in circular shape
  - Heart now fills proportionally based on exact percentage (55% fills exactly 55% of heart)
  - Maintains proper heart outline shape during fill animation
  - Smooth transition animation preserved
  - Color-coded thresholds still working (Green ≥70%, Yellow ≥40%, Red <40%)

### 🔧 Changed
- Updated README.md with Vercel deployment instructions and automatic deployment information
- Enhanced deployment section with links to comprehensive guides

## [1.1.0] - 2024-11-19

### ✨ Added
- **Authentication System** using **NextAuth.js v5** (Auth.js)
  - Simple email authentication (Credentials provider)
  - Google OAuth sign-in integration (optional)
  - JWT session management (no database required)
  - Secure token handling
  - Perfect Vercel integration
  - Next.js 16 compatible with proxy.ts
- **Protected Routes** for authenticated pages
  - Feed page requires authentication
  - Library page requires authentication
  - Account page requires authentication
  - Automatic redirect to `/auth` for unauthenticated users
- **Sign-In Page** (`/auth`) with:
  - Email input for magic link
  - Google OAuth button with official branding
  - Loading states and error handling
  - HIPAA compliance messaging
- **User Menu Component** in all protected pages
  - Sign-out functionality
  - Consistent placement across app
- **ConvexClientProvider** wrapping entire app
  - Real-time auth state synchronization
  - Automatic session refresh
- **ProtectedRoute Component** for route guarding
  - Shows loading state during auth check
  - Redirects to auth page if not authenticated
- **Comprehensive Documentation**
  - AUTH_SETUP.md with step-by-step guide
  - Google OAuth setup instructions
  - Environment variable configuration
  - Troubleshooting section

### 🔧 Changed
- **Switched from Convex Auth to NextAuth.js** for better Vercel compatibility
- **Updated to Next.js 16.0.3** with Turbopack support
- **Switched from Resend to Credentials provider** (no database adapter needed)
- Updated `app/layout.tsx` to include SessionProvider
- Enhanced Feed, Library, and Account pages with:
  - ProtectedRoute wrapper (uses NextAuth)
  - UserMenu in header
  - Integrated sign-out functionality
- Removed auth tables from Convex schema (handled by NextAuth now)
- Modified package.json to use NextAuth dependencies
- Changed from `middleware.ts` to `proxy.ts` (Next.js 16 convention)

### 📦 Dependencies Added
- `next-auth@beta` (v5.0.0-beta.30) - NextAuth.js authentication
- `next@16.0.3` - Latest Next.js with Turbopack
- `react@19.2.0` - Latest React
- `nodemailer@^7.0.10` - Email handling support
- `@auth/prisma-adapter` - Database adapter support
- `bcryptjs` - Password hashing support

### 📦 Dependencies Removed
- `@convex-dev/auth` - Replaced with NextAuth.js
- `@auth/core` - Now included in next-auth
- `convex-helpers` - No longer needed

### 📄 New Files
- `/auth.ts` - NextAuth configuration (Credentials + Google OAuth)
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `/app/proxy.ts` - Protected routes proxy (Next.js 16)
- `/components/ConvexClientProvider.tsx` - SessionProvider wrapper
- `/components/SignInForm.tsx` - Sign-in UI component
- `/components/ProtectedRoute.tsx` - Route protection HOC
- `/components/UserMenu.tsx` - User menu with sign-out
- `/app/auth/page.tsx` - Authentication page
- `/AUTH_SETUP_NEXTAUTH.md` - Complete NextAuth setup guide
- `/MIGRATION_NEXTAUTH.md` - Migration documentation
- `/FINAL_FIX.md` - Final working configuration
- `/QUICK_FIX.md` - Quick troubleshooting guide
- `.env.local.template` - Environment variable template

### 📄 Updated Files
- `/convex/auth.ts` - Deprecated (kept for reference)
- `/convex/http.ts` - Simplified (no auth routes)
- `/convex/schema.ts` - Removed auth tables

### 🔐 Security
- HTTPS-only cookies in production
- Secure session management via Convex
- OAuth state validation
- CSRF protection
- Environment variable encryption

## [1.0.2] - 2024-11-18

### ✨ Added
- **Share Button** on all video cards (Feed and Library)
  - Native share sheet on mobile devices (iOS/Android)
  - Copy-to-clipboard fallback on desktop
  - Shares video title, description, and URL
- **Visual Fill Effect** for HeartScore component
  - Heart fills from bottom to top based on percentage (0-100%)
  - Smooth 0.5s transition animation
  - Color-coded: Red (0-49%), Yellow (50-74%), Green (75-100%)
  - Displays percentage symbol (e.g., "55%")
- Demo mode section on landing page with prominent CTA buttons
- Placeholder images from external services (picsum.photos, pravatar.cc)

### 🔧 Changed
- **HeartScore** component now 50% larger (w-12 h-12 instead of w-8 h-8)
- Initial health score set to **55%** across all pages (Feed, Library, Account)
- **Improved TikTok feed greeting layout:**
  - Removed duplicate "Your follow-up video from Dr." text
  - Added gradient background with backdrop blur to greeting
  - Larger, more prominent greeting text (text-3xl)
  - Added heart emoji ❤️ to personalized greeting
- **Landing page completely redesigned:**
  - Modern gradient backgrounds
  - Larger, bolder typography  
  - Card-based layout with shadows and hover effects
  - 2x2 feature grid with icons
  - Prominent security badge with green checkmark
- Video info layout improved with drop shadows for better readability
- **Updated health score progression:**
  - Complete doctor's video: +20% (was +30%)
  - Complete educational video: +5% (was +2%)
  - Complete onboarding: +10% (was reset to 55%)

### 🐛 Fixed
- **CRITICAL**: Tailwind CSS not compiling properly (v4/v3 config mismatch)
  - Downgraded from Tailwind v4 to v3.4.1 for stability
  - Updated PostCSS config to use standard Tailwind v3 plugins
  - Removed `@tailwindcss/postcss` in favor of `tailwindcss` + `autoprefixer`
- All styles now rendering correctly on landing page and feed
- Image 404 errors by using external placeholder services
- Removed `.next` build cache for clean rebuild

## [1.0.1] - 2025-11-18

### 🔧 Configuration Updates

**Updated Setup Process:**
- PostgreSQL 16 installation via Homebrew
- Full path commands for PostgreSQL binaries
- Convex auto-configuration in `.env.local`
- Next.js 15 async `searchParams` support
- Tailwind CSS v4 with `@tailwindcss/postcss`

**Verified Working:**
- ✅ PostgreSQL 16 running with 9 tables and sample data
- ✅ Convex real-time features fully operational
- ✅ Next.js dev server on http://localhost:3000
- ✅ All 4 pages rendering correctly
- ✅ Sample data: 2 doctors, 1 patient, 5 videos

## [1.0.0] - 2025-11-18

### 🎉 Initial Release

Complete MVP implementation of the 1Another patient communication platform.

### ✨ Added

#### Core Infrastructure
- Next.js 15 project with App Router
- TypeScript configuration
- Tailwind CSS styling system
- PostgreSQL database schema
- Convex real-time backend
- Environment configuration

#### Pages & Routes
- **Landing Page** (`/`) - Entry point with feature overview
- **Feed Page** (`/feed`) - TikTok-style vertical video feed
- **Library Page** (`/library`) - Video browsing dashboard with search
- **Account Page** (`/account`) - Patient profile and settings
- **Content Pages** (`/content/*`) - SEO-optimized educational content

#### Components

**Feed Components:**
- `VideoCard.tsx` - TikTok-style video player with overlay controls
- `RateLimitMessage.tsx` - Session limit UI and warning messages
- Feed snap scrolling behavior
- Vertical scroll container with mobile optimization

**Onboarding & Engagement:**
- `ChatOnboarding.tsx` - Doctor-guided chat onboarding flow
- `ScheduleAppointment.tsx` - Appointment scheduling modal
- `HeartScore.tsx` - Dynamic health score indicator
- `TrustBadge.tsx` - Privacy and security messaging

**Shared Components:**
- `SchemaMarkup.tsx` - SEO schema injection component
- Mobile navigation bar
- Responsive headers

#### Features

**Doctor-First Experience:**
- Personalized video always first in feed (Card #1)
- Doctor avatar and branding throughout
- Magic link authentication with patient + doctor identity
- Custom greeting messages

**Video Feed:**
- TikTok-style vertical scroll
- CSS snap points for smooth scrolling
- Auto-play on scroll
- Rate limiting (20 videos per 30-minute session)
- Like, save, and message actions
- Real-time engagement tracking via Convex

**Chat Onboarding:**
- 4-step lightweight onboarding flow
- Questions: medications, allergies, phone, scheduling
- Non-blocking (feed continues in background)
- Doctor avatar as assistant
- Real-time message sync

**Health Score System:**
- Heart icon indicator with color coding:
  - Green (>90%): Healthy/compliant
  - Yellow (50-89%): In progress
  - Red (<50%): Critical follow-ups needed
- Score calculation based on:
  - Watched doctor video (30%)
  - Completed onboarding (25%)
  - Completed next steps (20%)
  - Submitted calendar request (15%)
  - Watched educational videos (10%)

**Appointment Scheduling:**
- Date picker for preferred date
- Time slot selection
- Reason for visit (optional)
- Request submission to database
- Confirmation messaging

**Video Library:**
- Search functionality
- Category filters (All, Heart Health, Nutrition, etc.)
- Grid layout with thumbnails
- Video duration badges
- Hover effects and transitions
- Mobile-responsive design

**Account Management:**
- Patient profile display
- Doctor information card with contact details
- Health score dashboard
- Quick actions menu
- Sign out functionality

#### Database

**PostgreSQL Schema:**
- `users` - Patient records
- `doctors` - Physician profiles
- `videos` - Content library
- `user_doctors` - Relationships
- `user_video_engagement` - Watch tracking
- `appointment_requests` - Scheduling
- `feed_items` - Personalized feeds
- `health_metrics` - Score tracking
- `onboarding_state` - Progress tracking

**Convex Schema:**
- `feedItems` - Real-time feed generation
- `chatMessages` - Onboarding conversations
- `userSessions` - Rate limit enforcement
- `videoEvents` - Engagement analytics
- `onboardingProgress` - Live state sync

**Sample Data:**
- 2 sample doctors (Dr. Sarah Johnson, Dr. Michael Chen)
- 1 sample patient (Dave Thompson)
- 5 sample videos (1 personalized, 4 educational)
- Linked relationships

#### SEO & Discoverability

**Search Engine Optimization:**
- AI crawler-friendly `robots.txt`
- Automatic sitemap generation
- Schema.org markup:
  - VideoObject for all videos
  - Physician for doctors
  - MedicalOrganization for platform
  - HowTo for educational content
  - FAQPage for Q&A sections
  - Breadcrumbs for navigation
- Semantic HTML structure
- Meta tags and descriptions
- Open Graph tags
- Twitter Card tags

**Content Pages:**
- `/content/chest-health` - Chest health tips with structured data
- Template for additional SEO content pages
- Clean URLs and internal linking

#### Privacy & Security

**Trust Indicators:**
- Prominent security messaging
- "Your information is secure and private" badges
- Shield icons throughout interface
- Medical-grade trust language
- HIPAA-conscious design patterns

#### Styling & UX

**Design System:**
- Custom Tailwind configuration
- Medical color palette (primary blues, trust indicators)
- Component utility classes
- Mobile-first responsive breakpoints
- Smooth animations and transitions

**Accessibility:**
- Semantic HTML
- ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader optimization
- Color contrast compliance

#### Developer Experience

**Code Quality:**
- TypeScript throughout
- ESLint configuration
- Consistent code style
- Component organization
- Utility function library
- Type definitions

**Utilities:**
- `cn()` - Class name merger
- `calculateHealthScore()` - Score computation
- `getHealthScoreColor()` - Color logic
- `extractMagicLinkParams()` - URL parsing
- `generateMagicLink()` - Link creation
- Date/time formatters
- Schema generators

#### Documentation

- Comprehensive README.md
- Detailed CHANGELOG.md (this file)
- Technical ClaudeMD.md documentation
- Code comments
- Type documentation
- Setup instructions

### 🎯 Core Principles Implemented

1. **Doctor-first design** - Personalized video always first
2. **Magic link identity** - No redundant questions
3. **Feed = engagement** - TikTok-style active viewing
4. **Dashboard = browsing** - Clean medical UI
5. **Radical simplicity** - No unnecessary complexity

### 📱 Mobile-First Implementation

- Centered phone viewport for feed
- Dynamic viewport height (dvh) units
- Touch-optimized scrolling
- Mobile navigation bar
- Responsive breakpoints
- Optimized tap targets

### 🔒 Privacy & Trust

- Security messaging throughout
- Clear data ownership language
- Medical-grade trust indicators
- HIPAA-conscious patterns
- No data collection without consent

### 🚀 Performance

- Next.js optimizations
- Image optimization
- Code splitting
- Lazy loading
- Efficient re-renders
- Convex real-time sync

### 🧪 Known Limitations

- Mock video data (use production video hosting in real deployment)
- No actual authentication (add NextAuth.js)
- No email notifications (add Resend/SendGrid)
- No analytics (add Posthog/Mixpanel)
- No error logging (add Sentry)
- Limited test coverage (add Jest/React Testing Library)

### 📋 Future Roadmap

**Phase 2 Features:**
- [ ] Real authentication system
- [ ] Production video hosting
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Push notifications
- [ ] Analytics dashboard
- [ ] A/B testing framework

**Phase 3 Features:**
- [ ] Multi-doctor support
- [ ] Video calling integration
- [ ] Prescription management
- [ ] Lab results integration
- [ ] Insurance integration
- [ ] Billing system

**Technical Improvements:**
- [ ] Unit test coverage
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Performance monitoring
- [ ] Error tracking
- [ ] Load testing

---

## Contributing

For questions or contributions, please contact the 1Another team.

## Version History

- **1.0.0** (2025-11-18) - Initial MVP release

