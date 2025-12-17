# Changelog

All notable changes to the 1Another MVP project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.29.0] - 2024-12-17

### 🎬 Personalized Video Doctor Update

**Dr. Ryan Mitchell - New AI Avatar Doctor:**
- Updated personalized "Hey Dave" video to feature Dr. Ryan Mitchell
- Added new AI-generated avatar profile image (`doctor-ryan.jpg`)
- Replaced previous female doctor (Lisa Mitchell) with new male character

**Files Updated:**
- `app/feed/page.tsx` - Updated MOCK_DOCTORS and MOCK_VIDEOS for Dr. Ryan Mitchell
- `components/VideoCard.tsx` - Updated fallback doctor name
- `components/ReminderCard.tsx` - Updated default props
- `public/images/doctors/doctor-ryan.jpg` - New profile image (AI avatar still)
- `public/videos/hey-dave.mp4` - Updated video file (renamed from "hey dave.mp4")

**Doctor Profile:**
- Name: Dr. Ryan Mitchell
- Specialty: Cardiology
- Clinic: Heart Health Partners
- Image: `/images/doctors/doctor-ryan.jpg`

---

## [1.28.0] - 2024-12-17

### 🔐 Auth Security Hardening

**Role-Based Access Control:**
- Added user roles: `patient`, `doctor`, `admin`
- Role determined by email domain:
  - `@1another.com` or `@1another.health` → doctor
  - Specific admin emails → admin
  - Everyone else → patient
- Session now includes `role` property for authorization checks

**Edge Middleware Protection:**
- New `middleware.ts` protects `/doctor/*` routes
- Unauthenticated users redirected to `/auth?callbackUrl=...`
- Patients blocked from doctor portal (redirected to `/feed?error=unauthorized`)
- Only doctors and admins can access doctor portal

**Secure Session Configuration:**
- `maxAge: 8 hours` for session expiration
- Secure cookies in production (`__Secure-` prefix)
- `HttpOnly`, `SameSite=lax` cookie options
- CSRF token protection with `__Host-` prefix

**Convex Auth Integration:**
- Updated `ConvexClientProvider` to use `ConvexProviderWithAuth`
- New `convex/authHelpers.ts` with:
  - `getAuthUserId()` - Get verified user ID
  - `requireAuth()` - Throw if not authenticated
  - `requireRole()` - Verify user has required role
  - `getUserIdOrFallback()` - Graceful degradation for anonymous users
- Updated `convex/feed.ts`, `convex/chat.ts`, `convex/videoEngagement.ts` to use server-verified auth

**Server-Side Auth Helpers:**
- New `lib/auth-helpers.ts` for Next.js:
  - `requireAuth()` - Redirect to /auth if not authenticated
  - `requireRole()` - Redirect if wrong role
  - `requireDoctor()` - Convenience for doctor-only routes
  - `hasRole()` - Check role without redirecting

**E2E Test Updates:**
- Updated `tests/e2e/patient/auth.spec.ts` with role-based access tests
- Updated `tests/e2e/doctor/dashboard.spec.ts` for middleware protection
- All 66 tests passing across Chromium and mobile-chrome

### 📦 New Files
- `middleware.ts` - Edge middleware for route protection
- `convex/authHelpers.ts` - Convex auth utilities
- `lib/auth-helpers.ts` - Server-side auth helpers

### 📦 Files Modified
- `auth.ts` - Added role system, secure cookies, maxAge
- `types/next-auth.d.ts` - Added role type definitions
- `components/ConvexClientProvider.tsx` - Convex auth integration
- `convex/feed.ts` - Server-side auth verification
- `convex/chat.ts` - Server-side auth verification
- `convex/videoEngagement.ts` - Server-side auth verification
- `tests/e2e/patient/auth.spec.ts` - Role-based access tests
- `tests/e2e/doctor/dashboard.spec.ts` - Middleware protection tests

### 🔄 Breaking Changes
- Doctor portal now requires authentication and doctor/admin role
- Convex functions prefer server-verified userId over client-provided

---

## [1.27.0] - 2024-12-16

### 🧪 Full Testing Infrastructure

**Testing Framework Setup:**
- Installed Playwright for E2E testing (`@playwright/test@^1.57.0`)
- Installed Jest for unit/component testing (`jest@^29.7.0`, `ts-jest@^29.4.6`)
- Installed React Testing Library (`@testing-library/react@^16.3.1`, `@testing-library/jest-dom@^6.9.1`)
- Installed `@axe-core/playwright@^4.11.0` for accessibility compliance testing

**New Configuration Files:**
- `playwright.config.ts` - E2E test configuration with webServer auto-start
- `jest.config.ts` - Jest configuration with Next.js support
- `jest.setup.ts` - Jest setup file importing testing-library matchers

**New Test Scripts (package.json):**
- `npm test` - Run Jest unit tests
- `npm run test:watch` - Jest in watch mode
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Playwright with UI mode
- `npm run test:a11y` - Accessibility tests only
- `npm run test:all` - Run all tests (unit + E2E)

**E2E Test Files Created:**
- `tests/e2e/patient/feed.spec.ts` - Feed page tests (video playback, Q&A, scroll)
- `tests/e2e/patient/discover.spec.ts` - Discover page tests (filtering, premium modal)
- `tests/e2e/patient/auth.spec.ts` - Authentication flow tests
- `tests/e2e/doctor/dashboard.spec.ts` - Doctor portal tests
- `tests/e2e/a11y/accessibility.spec.ts` - WCAG 2.1 AA compliance tests

**Unit Test Files Created:**
- `tests/unit/components/HeartScore.test.tsx` - HeartScore component tests
- `tests/unit/hooks/useEngagement.test.ts` - useEngagement hook tests
- `tests/unit/lib/utils.test.ts` - Utility function tests

**GitHub Actions CI/CD Updated:**
- Added `unit-tests` job running Jest
- Added `e2e-tests` job running Playwright with browser installation
- Playwright test results uploaded as artifacts

### ♿ Accessibility Fixes (WCAG 2.1 AA)

**Meta Viewport Fix:**
- Changed `userScalable: false` to `userScalable: true` in `app/layout.tsx`
- Changed `maximumScale: 1` to `maximumScale: 5`
- Allows users with visual impairments to zoom up to 500%
- Fixes `meta-viewport` accessibility violation

**E2E Test Selector Improvements:**
- Fixed strict mode violations in Playwright tests
- Updated selectors to use specific aria-labels and data-testids
- Made tests more resilient to UI variations

### 🛠️ New Hooks

**useOffline Hook (`hooks/useOffline.ts`):**
- Detects online/offline status for healthcare reliability
- Uses `navigator.onLine` and event listeners
- Returns `isOffline` boolean for UI rendering
- Critical for healthcare apps to show appropriate messaging

### 📦 Files Modified
- `app/layout.tsx` - WCAG viewport fix
- `package.json` - Test dependencies and scripts
- `.github/workflows/quality-gate.yml` - CI test jobs
- `tests/e2e/**/*.spec.ts` - E2E test fixes
- `components/HeartScore.tsx` - Added data-testid attributes

### 📦 New Files
- `playwright.config.ts`
- `jest.config.ts`
- `jest.setup.ts`
- `hooks/useOffline.ts`
- `tests/e2e/patient/feed.spec.ts`
- `tests/e2e/patient/discover.spec.ts`
- `tests/e2e/patient/auth.spec.ts`
- `tests/e2e/doctor/dashboard.spec.ts`
- `tests/e2e/a11y/accessibility.spec.ts`
- `tests/unit/components/HeartScore.test.tsx`
- `tests/unit/hooks/useEngagement.test.ts`
- `tests/unit/lib/utils.test.ts`

---

## [1.26.0] - 2024-12-16

### 📱 Mobile Bottom Navigation Polish

**New MobileBottomNav Component:**
- Created reusable `components/MobileBottomNav.tsx` for consistent mobile navigation
- Three navigation items: My Feed (Play icon), Discover (Compass icon), My Health (Heart icon)
- Active state uses 1A brand color `#00BFA6` (teal) matching HeartScore gradient
- iOS safe area support with `safe-area-bottom` CSS class
- Subtle shadow effect with `mobile-nav-shadow` class
- Icons fill when active for clear visual feedback

**Mobile UX Improvements:**
- Reduced bottom nav height by ~50% for more screen real estate
- Changed padding from `py-3` to `py-2`
- Reduced icon size from `w-6 h-6` to `w-5 h-5`
- Reduced gap between icon and label from `gap-1` to `gap-0.5`
- Hidden messaging button on My Feed page (no duplicate actions)
- Adjusted floating message button position on Discover and My Health pages (`bottom-10`)

**Brand Color Consistency:**
- Updated active navigation color from `#37A9D9` to `#00BFA6`
- Updated VideoCard heart icon to use `heart-gradient-1a` class (was conditional amber/green/red)
- All heart icons now use 1A brand gradient (`#00BFA6` to `#00A6CE`)
- Consistent brand identity across all navigation elements and video sidebar

**CSS Additions (globals.css):**
- `.safe-area-bottom` - iOS safe area padding
- `.mobile-nav-shadow` - Subtle top shadow for nav bar

### 📦 Files Modified
- `components/MobileBottomNav.tsx` - New reusable navigation component
- `components/VideoCard.tsx` - Updated heart icon to use 1A brand gradient
- `app/feed/page.tsx` - Added MobileBottomNav, removed floating message button
- `app/discover/page.tsx` - Added MobileBottomNav, adjusted button positions
- `app/my-health/page.tsx` - Added MobileBottomNav, adjusted button positions
- `app/globals.css` - Added safe area and shadow utility classes

---

## [1.25.0] - 2024-12-16

### 🎯 UX Strategic Improvements - "Why Now?" & Continuity

**Personalized Video - Value-Focused Messaging:**
- Changed passive reminder to action-focused copy
- Before: "Hey Dave" with "📅 Reminder: Schedule your follow-up visit in 3 months"
- After: "Hey Dave — here's what to do next for your heart health"
- Added doctor context: "Dr. Lisa explains your upcoming follow-up and what to expect"
- Added prominent "Schedule Visit" action button with arrow icon
- Added continuity badge: "Since your last visit • 2 weeks ago"

**Right Sidebar Reordered (Desktop & Mobile):**
- New order: Doctor Profile → Discover → My Heart
- Puts relationship-building first (doctor avatar)
- Applied consistently across:
  - Video card sidebar
  - Q&A overlay sidebar  
  - Reminder overlay sidebar
  - Mobile action buttons

**Continuity Elements Added:**
- Personalized video: "Since your last visit • 2 weeks ago" context badge
- Reminder overlay: "Coming up next in your care plan" progression badge
- Reminder overlay: "Dr. Lisa Mitchell mentioned this" relationship context
- Reminder overlay: Doctor quote - "Based on your family history, let's get this scheduled."
- Reminder overlay: Secondary CTA "Learn What Happens Next →"
- Changed title from "Schedule Colonoscopy" to "Your Next Step: Colonoscopy"

**Strategic Shift:**
- Product now communicates: continuity, progression, memory, relationship
- Shifted from "Watch a video" → "Guided healthcare decisions over time"
- Humans are led, not just shown options

### 📦 Files Modified
- `components/VideoCard.tsx` - Added onScheduleClick prop, updated personalized content, reordered mobile actions
- `app/feed/page.tsx` - Reordered all desktop sidebars, updated reminder overlay with continuity messaging

---

## [1.24.0] - 2024-12-16

### 🚀 CI/CD & Developer Experience

**GitHub Actions Quality Gate:**
- Added `.github/workflows/quality-gate.yml` for automated CI
- TypeScript type checking on every PR
- ESLint code quality checks
- Production build verification
- Security audit for dependencies
- Runs on all PRs to `main` branch

**Environment Validation:**
- Added `@t3-oss/env-nextjs` for type-safe environment variables
- New `env.ts` file with Zod schema validation
- Build-time validation catches missing env vars early
- `SKIP_ENV_VALIDATION` flag for CI builds

### 🎨 Shadcn/UI Design System

**New UI Components:**
- Initialized Shadcn/UI with New York style
- `components/ui/button.tsx` - Accessible button with variants
- `components/ui/card.tsx` - Content card component
- `components/ui/input.tsx` - Form input component
- `components/ui/skeleton.tsx` - Loading placeholder

**FeedSkeleton Component:**
- New `components/FeedSkeleton.tsx` for feed loading states
- Matches actual feed layout to prevent CLS (Cumulative Layout Shift)
- Includes sidebar, video card, and navigation skeletons
- Used as Suspense fallback in feed page

### 📈 SEO Improvements

**Feed Route Metadata:**
- Added `app/feed/layout.tsx` with comprehensive metadata
- OpenGraph tags for social sharing
- Twitter card configuration
- Keyword optimization for health videos

**Layout Enhancements:**
- Added viewport configuration with theme colors
- Font optimization with `display: swap`
- Improved body styling with Shadcn classes

### 📦 New Dependencies

- `@t3-oss/env-nextjs` - Environment validation
- `zod` - Schema validation
- `class-variance-authority` - Component variants (Shadcn)
- `@radix-ui/react-slot` - Slot component (Shadcn)
- `tailwindcss-animate` - Animation utilities
- `eslint@8` and `eslint-config-next@14` - Stable linting

### 🐛 Bug Fixes

- Fixed ESLint config for CI compatibility (Next.js 16 `next lint` bug workaround)
- Fixed Convex client crash when `NEXT_PUBLIC_CONVEX_URL` is missing during CI build
- ConvexClientProvider now gracefully falls back to SessionProvider only

---

## [1.23.0] - 2024-12-16

### 🎨 In-Feed Q&A & Reminder Overlays

**Feed Page - Integrated Overlay System:**
- Q&A and Reminder cards now appear as in-feed overlays (not full-screen pop-ups)
- Semi-transparent backdrop (`bg-black/30`) shows video playing underneath
- Cards positioned within feed container using `absolute` positioning
- Removed X button from Q&A overlay - users must answer to continue
- Added "Answer to continue or swipe to skip" hint text
- Reminder overlay after 1st video, Q&A overlay after every 2nd video
- Smooth slide-up animation for overlay appearance

**HeartScore Component - 1A Brand Gradient:**
- Heart icon now always uses 1A brand green-blue gradient
- Gradient colors: `#00BFA6` (teal) to `#00A6CE` (cyan)
- Updated glow effect to match brand colors
- Consistent branding regardless of health score value

**Doctor Messages Page - Automated Q&A System:**
- Replaced free-form messaging with automated Q&A check-ins
- Pre-defined questions: feeling, medication, side effects, diet, exercise
- Doctors can send check-in questions to patients
- Response history view showing patient answers
- Reduces doctor message overload with structured interactions

### 📦 Package Updates

**Framework & Dependencies:**
- Updated Next.js from `15.x` to `^16.0.10`
- Updated React from `18.x` to `^19.2.3`
- Updated react-dom to `^19.2.3`
- Updated `@types/react` to `^19.2.7`
- Updated `@types/react-dom` to `^19.2.3`

### 🐛 Bug Fixes

- Fixed React key warning in Discover page (added `key` prop to `React.Fragment`)
- Ensured build compiles successfully with latest dependencies

---

## [1.22.0] - 2024-12-15

### 🎨 Multiple UI Enhancements

**ReminderCard - Doctor's Face Added:**
- Added Dr. Lisa Mitchell's avatar photo to the reminder card
- Shows "From Dr. Lisa Mitchell" text below avatar
- Stethoscope badge on doctor avatar
- Props allow customizing doctor name and avatar URL

**Discover Page - Suggested Doctor Profile:**
- Changed blue plus "Add Doctor" placeholder to actual Dr. Kim profile
- Shows Dr. Kim's headshot with blue plus badge
- Clicking navigates to the feed to view content
- Displays "Dr. Kim", "Metro Heart", and "+ Add" text

**Discover Page - Video Thumbnails:**
- All video thumbnails now show doctor headshots instead of medical images
- Added `object-top` class for proper face positioning
- Updated all specialty sections: Cardiology, Primary Care, Endocrinology, Gastroenterology, Pulmonology

**Discover Page - Message Notification:**
- Added red notification badge with "2" on floating message button
- Pulsing animation to draw attention
- Indicates pending medicine check-in questions

**Chat Onboarding - Medicine Q&A:**
- Changed chat questions to medicine-focused Q&A:
  - "Have you taken your medicine today?"
  - "Are you feeling better after the new medicine?"
- Simplified to 2 focused questions

**Doctor Portal - Patient Avatar Fix:**
- Updated Dave Thompson's placeholder image to real professional headshot

---

## [1.21.0] - 2024-12-15

### 🎨 Reminder Module Title

**ReminderCard in Feed:**
- Added "What Your Doctor Wants You to Do" title to reminder module
- Title appears above the reminder card for clear context
- Improved visual hierarchy in the feed

---

## [1.20.0] - 2024-12-15

### 🎨 Feed Reminder Simplified

**ReminderCard in Feed:**
- Changed from full list to single focused reminder
- Shows only "Schedule Colonoscopy" (60 days away, +15%)
- Clean centered card design with schedule button
- Link to view all reminders on My Health page

---

## [1.19.0] - 2024-12-15

### 🎨 My Health Page Updates

**Reminders Section:**
- Added "Schedule Colonoscopy" as first item under Annual Reminders
- Shows "Due in 60 days" with +15% health score boost

**Header Cleanup:**
- Removed duplicate HeartScore from top right header (already shows on page)
- HeartScore remains visible in Discover page header

**UI Simplification:**
- Removed Quick Actions module from My Health page
- Cleaner, more focused layout

---

## [1.18.0] - 2024-12-15

### 🎨 Q&A Widget Enhancement

**Feed Page:**
- Added "What Your Doctor Wants to Know" header title to Q&A cards
- Title displays at top of widget in pill-shaped badge
- Improved visual hierarchy for doctor check-in questions

### 🔧 Bug Fix
- Renamed video file from "hey dave.mp4" to "hey-dave.mp4" to fix URL encoding issues

---

## [1.17.0] - 2024-12-15

### 🎨 UI Simplification & Polish

**Feed Page:**
- Simplified ReminderCard to single "Schedule Colonoscopy" reminder (60 days away)
- Half-page sized reminder unit with schedule button
- Made heart icon significantly smaller (w-10 h-10 from w-14 h-14)

**Discover Page:**
- Expanded free tier doctors from 2 to 5 (not grayed out)
- Removed HeartScore from header
- Restored Kaiser Permanente logo in top bar
- Added 5 specialty video rows with 6 videos each:
  - Cardiology
  - Primary Care (renamed from Nutrition & Exercise)
  - Endocrinology
  - Gastroenterology
  - Pulmonology
- Videos use doctor faces as thumbnails

**My Health Page:**
- Removed "Your health info is secure" module (TrustBadge)
- Removed "Quick Actions" module
- Changed "Your Insurers" to "Your Insurer" (singular)
- Moved Kaiser Permanente to "Your Doctor Groups" section
- Kept only UnitedHealthcare in insurer section
- Removed duplicate HeartScore from header
- Simplified reminders to single "Schedule Colonoscopy" reminder

### 🔧 Technical Changes
- Cleaned up unused state variables and handlers in My Health page
- Removed unused imports (useEffect, CheckCircle2, Loader2)
- Streamlined ReminderCard component

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.16.0] - 2024-12-15

### 🎨 Major UI Overhaul

**Discover Page - Premium Doctor Model:**
- First 2 doctors (Sarah Johnson, Michael Chen) are free tier
- Remaining 10 doctors grayed out with gold crown badge
- Click premium doctor shows "Upgrade to Premium" modal
- Added doctor group and medical insurer below each doctor's name
- Added 6+ videos per topic with horizontal scrolling
- Videos added for Cardiology, Nutrition & Exercise, Endocrinology, Gastroenterology, Pulmonology
- Removed welcome text block

**Logo & Branding:**
- Added "Intelligent Health" text below logo on all pages
- Cache-busting added (`?v=2`) to refresh updated logo
- Logo properly centered across all pages

**My Health Page:**
- Renamed "Hospital Groups" → "Your Doctor Groups"
- Removed duplicate HeartScore on mobile (hidden in summary card)
- Made reminder buttons larger on mobile (`px-3 py-2 text-xs`)

**HeartScore Component:**
- Removed percentage/number display - now shows just the heart icon

**Feed Page:**
- Audio now ON by default (users click to mute)
- Fixed Maximum update depth exceeded error using ref
- Added Dr. Lisa Mitchell for "Hey Dave" personalized video

**Doctor Portal:**
- Changed all grid layouts to vertical stacked layout
- Created new Doctor Onboarding page (`/doctor/onboarding`)
- Onboarding flow: Practice Setup → Train AI Avatar (HeyGen) → Create First Video → Invite Patients
- Reordered navigation: Onboarding first, Send Content second
- Added fallback initials for patient avatars

**ReminderCard Component:**
- Consolidated 3 separate sections into one unified scrollable list
- Color-coded left borders indicate category (sky=annual, emerald=today, amber=week)

### 📦 New Files
- `app/doctor/onboarding/page.tsx` - 4-step doctor onboarding flow
- `public/images/doctors/doctor-lisa.jpg` - Dr. Lisa Mitchell image

### 🔧 Technical Changes
- Fixed infinite re-render loop in feed page useEffect
- Added `hasTrackedFirstVideo` ref to prevent multiple trackVideoView calls
- Updated VideoCard to default `isMuted` to `false`

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.15.0] - 2024-12-15

### 🎬 Simplified Video Feed - Dr. Jack & "Hey Dave" Only

**Video Feed Cleanup:**
- Removed all placeholder videos from other doctors
- Feed now exclusively shows local videos:
  - "Hey Dave" personalized greeting video (`/videos/hey dave.mp4`)
  - Dr. Jack Video 1: "Understanding Your Heart Rhythm"
  - Dr. Jack Video 2: "Managing Cholesterol Levels"
  - Dr. Jack Video 3: "Signs of Heart Disease to Watch"
- Cleaner, more focused demo experience

### 📋 Added - Reminder Card in Feed

**New ReminderCard Component (`components/ReminderCard.tsx`):**
- Appears as second item in feed (after "Hey Dave" video)
- Sources reminders from My Health section
- Three sections:
  - **Coming Up**: Annual Physical, Cholesterol Screening with "Schedule" buttons
  - **Today**: Medication, Blood Pressure, Walk with interactive checkboxes
  - **This Week**: Educational videos, Water intake tracking
- Progress tracking (X/3 done)
- Score boost badges (+2% to +15%)
- "View Full Health Dashboard" CTA linking to /my-health
- Beautiful gradient background (sky → white → emerald)

**Shared Reminders Data (`lib/reminders.ts`):**
- Centralized reminder data structure
- Types: `Reminder` with id, title, description, dueDate, scoreBoost, category, icon
- Exported arrays: `ANNUAL_REMINDERS`, `TODAY_REMINDERS`, `WEEK_REMINDERS`
- `ACTION_SCORES` for score calculations
- Can be imported by both feed and my-health pages

**Feed Integration:**
- Feed pattern now: Video → Reminder → Video → Q&A → Video → Video → Q&A
- Reminder card has full-height snap scrolling like videos
- Schedule button opens appointment modal
- Desktop sidebar with Discover and Heart Score buttons

### 📦 New Files
- `components/ReminderCard.tsx` - Interactive reminder card for feed
- `lib/reminders.ts` - Shared reminders data source

### 🔧 Technical Changes
- Added `ScheduleAppointment` modal to feed page
- Extended `FeedItem` type to include `'reminder'` type
- Reminder card renders between first video and second video

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.13.0] - 2024-12-11

### ✨ Added - AI Studio for Video Personalization

**New AI Studio Section on Dashboard:**
- Prominent AI Studio card on doctor dashboard
- "Train AI on Your Likeness" - Links to HeyGen (heygen.com) for avatar training
- "Create Your Chapter Videos" - Links to chapter personalization page
- "How it Works" 3-step guide (Train Avatar → Select Templates → Send to Patients)
- Gradient styling with sparkle icons

**New Create Chapters Page (`/doctor/create-chapters`):**
- Full page for personalizing template videos with AI avatar
- Progress overview showing chapters completed
- AI Avatar status card with link to manage in HeyGen
- 10 template chapters with expandable video lists
- Checkbox selection for individual videos or entire chapters
- "Generate" button for per-video or bulk AI video generation
- Status badges: "Template", "In Progress", "Personalized"
- Info banner explaining AI video generation process

**Navigation Update:**
- Added "AI Studio" with sparkles icon to sidebar (after Dashboard)

### 📦 New Files
- `app/doctor/create-chapters/page.tsx` - AI video personalization page

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.12.0] - 2024-12-11

### 🩺 Added - Complete Doctor Portal

**New Send Content Page (`/doctor/send`):**
- 3-step wizard for sending videos to patients
- Step 1: Multi-select patient list with search
- Step 2: Chapter-based video selection with expandable sections
- Step 3: Review summary with optional personal message
- Success confirmation screen
- Pre-selection support via URL params (?patient=, ?chapter=, ?video=)

**New Settings Page (`/doctor/settings`):**
- Profile tab: Avatar upload, personal info, bio editing
- Notifications tab: Toggle switches for all notification types
- Security tab: Password change, 2FA setup, active sessions
- Save functionality with loading states

**Landing Page Update:**
- Added "Doctor Portal" button to demo section
- 4-column responsive grid (Magic Link, Discover, My Health, Doctor Portal)
- Purple gradient styling to distinguish provider access
- Stethoscope emoji 🩺 for visual clarity

### 📦 New Files
- `app/doctor/send/page.tsx` - Send content wizard
- `app/doctor/settings/page.tsx` - Doctor settings page

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.11.0] - 2024-12-11

### 👨‍⚕️ Added - Doctor Portal Dashboard

**New Doctor Portal (`/doctor`):**
- Full-featured doctor dashboard for healthcare providers
- Analytics cards: Total Patients, Videos Watched, Completion Rate, Avg Watch Time
- Time filter (Week/Month/Year) for statistics
- Recent Patient Activity list with progress bars
- Messages panel with unread indicators
- Popular Chapters section with view counts

**Doctor Portal Pages:**
- `/doctor` - Main dashboard with analytics and quick actions
- `/doctor/patients` - Patient management page
- `/doctor/messages` - Patient messaging center
- `/doctor/chapters` - Video library management (10 chapters, 25 videos)

**Dashboard Features:**
- Patient engagement tracking with video completion progress
- Color-coded status badges (Active, Completed, Inactive)
- Quick action cards with gradient backgrounds
- Mobile-responsive layout

### 📝 Added - 3-Step Onboarding Flow

**New OnboardingForm Component (`components/OnboardingForm.tsx`):**
- Step 1: Email input with benefits list
- Step 2: Full name collection
- Step 3: Health insurance provider selection
- Progress indicator dots
- Back navigation between steps
- Searchable provider dropdown with popular quick-select
- Stores onboarding data in session

**Supported Health Providers:**
- Kaiser Permanente
- United Healthcare
- Blue Cross Blue Shield
- Aetna, Cigna, Humana, Anthem
- "Other" option for custom input

### 🔐 Enhanced - Authentication System

**Auth Updates (`auth.ts`):**
- Extended credentials to capture name and healthProvider
- JWT token now stores healthProvider
- Session includes healthProvider for personalization
- Type-safe with extended NextAuth types

**Auth Page Updates (`app/auth/page.tsx`):**
- Replaced SignInForm with OnboardingForm
- Added "Doctor Portal Login" link with stethoscope icon
- Clear separation between patient and doctor access

### 📦 New Files

- `components/OnboardingForm.tsx` - 3-step patient onboarding
- `app/doctor/page.tsx` - Doctor dashboard
- `app/doctor/layout.tsx` - Doctor portal layout
- `app/doctor/patients/page.tsx` - Patient management
- `app/doctor/messages/page.tsx` - Messaging center
- `app/doctor/chapters/page.tsx` - Video library
- `types/next-auth.d.ts` - Extended NextAuth types

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.10.0] - 2024-12-11

### 🎥 Added - "Hey Dave" Personalized Video

**New First Video Experience:**
- Added `hey dave.mp4` as the first video in the feed
- Hardcoded "Hey Dave" greeting for demo purposes
- Video displays with "Hey Dave" text overlay
- Associated with Dr. Jack Ellis
- Located at `/public/videos/hey dave.mp4`

**Personalized Greeting:**
- VideoCard now shows "Hey Dave" for all personalized videos
- Simplified greeting text (removed dynamic name for now)
- Reminder text: "📅 Schedule your follow-up visit in 3 months"

### 💬 Added - Interactive Q&A Cards

**New Q&A Card Component (`components/QACard.tsx`):**
- Interactive check-in cards that appear in the feed
- Beautiful animated gradient background (teal → blue → purple)
- Floating blur shapes for modern, flowing design
- 5 different rotating questions:
  - "Hey Dave, how are you feeling today?"
  - "Hey Dave, how are your new medications working?"
  - "Hey Dave, how has your sleep been lately?"
  - "Hey Dave, have you been staying active?"
  - "Hey Dave, how's your stress level?"

**Q&A Features:**
- Emoji-enhanced answer options (4 choices per question)
- Visual feedback when option selected (scale, color change)
- "Sent!" confirmation with checkmark
- "Thanks! Your response has been sent to your doctor" message
- Auto-reset after 3 seconds for demo purposes
- +3% health score boost for answering

**Feed Integration:**
- Q&A cards appear after every 2nd video
- Pattern: Video → Video → Q&A → Video → Video → Q&A...
- Desktop sidebar shows Discover and Heart Score buttons
- Mobile-responsive design matching video cards

### 🎨 Added - New CSS Animations

**Q&A Card Animations (`globals.css`):**
- `animate-gradient-shift` - Smooth shifting gradient background (8s cycle)
- `animate-float-slow` - Floating bubble effect (12s cycle)
- `animate-float-slower` - Slower floating bubble (16s cycle)
- `animate-pulse-slow` - Gentle pulsing glow (6s cycle)

**Utility Classes:**
- `hover:scale-102` - Subtle hover scale effect
- `active:scale-98` - Active press scale effect

### 🔧 Technical Changes

**Files Added:**
- `components/QACard.tsx` - New Q&A card component with all questions
- `public/videos/hey dave.mp4` - Personalized video file

**Files Modified:**
- `app/feed/page.tsx` - Added Hey Dave video, integrated Q&A cards, combined feed logic
- `app/globals.css` - Added Q&A animations
- `components/VideoCard.tsx` - Simplified personalized greeting to "Hey Dave"

**Feed Architecture:**
- New `combinedFeed` array mixing videos and Q&A items
- Type-safe feed items: `{ type: 'video' | 'qa', data: ... }`
- Q&A tracking separate from video tracking
- `handleQAAnswer` callback for future backend integration

### 📦 Dependencies
- No new dependencies added

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.9.0] - 2024-12-04

### 👨‍⚕️ Added - Dr. Jack Ellis (New Doctor)

**New Doctor Profile:**
- Added **Dr. Jack Ellis** as 4th doctor in the platform
- Specialty: Cardiology
- Clinic: 1Another Cardiology
- Profile photo at `/public/images/doctors/doctor-jack.jpg`

**3 New Videos:**
- "Understanding Your Heart Rhythm" - Heart rhythm basics
- "Managing Cholesterol Levels" - Cholesterol management strategies
- "Signs of Heart Disease to Watch" - Early warning signs

**Video Files:**
- `/public/videos/doctor-jack-video-1.mp4`
- `/public/videos/doctor-jack-video-2.mp4`
- `/public/videos/doctor-jack-video-3.mp4`

### 🔊 Added - Volume Toggle Button

**Video Player Controls:**
- Added mute/unmute button to top-right of all video cards
- Icon changes between VolumeX (muted) and Volume2 (unmuted)
- Click to toggle audio on/off
- Videos start muted for browser autoplay compatibility
- Sleek circular button with dark backdrop blur

### 🔄 Added - Video Restart on Scroll

**Video Behavior:**
- Videos now restart from beginning when scrolling back
- `video.currentTime = 0` called when video becomes active
- Ensures fresh viewing experience each time

### 🗑️ Removed - Rate Limiting

**Session Limits Removed:**
- Removed 20-video-per-session rate limiting
- Removed `RateLimitMessage` component import from feed
- Removed `scrollCount` and `isRateLimited` state
- Removed `remainingScrolls` calculations
- Users can now scroll through unlimited videos

### 🎨 Removed - Doctor Filter Header Bar

**UI Cleanup:**
- Removed large overlapping header bar when filtering by doctor
- Video now takes full card space without obstruction
- Sidebar still indicates selected doctor (highlighted in teal)
- Cleaner, less cluttered video viewing experience

### 🔧 Technical Changes

**Files Modified:**
- `app/feed/page.tsx` - Added Dr. Jack, removed rate limiting, removed header bar
- `components/VideoCard.tsx` - Added volume toggle, video restart, video element

**New Imports:**
- `Volume2`, `VolumeX` from lucide-react in VideoCard

### 📦 Dependencies
- No new dependencies added

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.8.0] - 2024-12-03

### 🏥 Insurance Branding - Header Integration

**Dual Insurance Logos in Header:**
- Added **Kaiser Permanente** logo (in dark blue badge) to dashboard headers
- Added **UnitedHealthcare** logo with shield icon to dashboard headers
- Both logos appear on **Discover** and **My Health** pages
- Consistent positioning: top-right, before heart score and user menu
- Kaiser logo wrapped in dark blue container for visibility on white background

**Insurance Card Section:**
- Both insurance logos displayed in "Your Insurers" card on My Health page
- Dark blue (#003A70) background with member details
- Kaiser and UnitedHealthcare logos side by side with divider

### 🎨 UI Cleanup

**Removed "Keep it up!" Text:**
- Removed status message from HeartScore component across all pages
- Removed progress badge from My Health summary card
- Cleaner interface with just the heart score percentage

**Chat Message Update:**
- Changed onboarding first question to "Reminder to schedule your colonoscopy!"
- More actionable healthcare messaging

### 📁 New Assets

- `/public/images/united-healthcare-logo.svg` - Blue version (for light backgrounds)
- `/public/images/united-healthcare-logo-white.svg` - White version (for dark backgrounds)

### 🔧 Technical Changes

**Files Updated:**
- `app/my-health/page.tsx` - Added dual logos to header, insurance card, removed progress badge
- `app/discover/page.tsx` - Added dual logos to header, removed showMessage from HeartScore
- `components/ChatOnboarding.tsx` - Updated first onboarding question
- `lib/utils.ts` - Changed "In progress - keep going!" to "Keep it up!"

### 📦 Dependencies
- No new dependencies added

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

## [1.7.0] - 2024-12-03

### 🎨 UI Improvements - Feed Page

**Logo Improvements:**
- Increased sidebar logo size from `h-10` to `h-16` (matching dashboard)
- Logo now centrally aligned in the sidebar with `justify-center`
- Increased padding from `p-4` to `p-6` for better visual spacing

**My Heart Component Fix:**
- Fixed "My Heart" indicator to show partial fill based on actual score
- Heart at 55% now correctly shows ~55% filled (was incorrectly showing full)
- Replaced inline Heart icon with reusable `HeartScore` component
- Consistent design with My Health dashboard page
- Both sidebar button and popup modal now use `HeartScore` component

**1A Icon Watermark Fix:**
- Updated `1a-icon.png` to new transparent version (no white background)
- Added cache-busting query parameter (`?v=2`) to force browser refresh
- Added `unoptimized` attribute to bypass Next.js image caching
- Removed `opacity-50` and `mixBlendMode: 'multiply'` for cleaner display

### 🔧 Technical Changes

**Component Updates:**
- `app/feed/page.tsx`: Imported and used `HeartScore` component, updated logo sizing
- `components/VideoCard.tsx`: Fixed 1A icon display with cache-busting

### 📦 Dependencies
- No new dependencies added

### 🔄 Breaking Changes
- None (all changes are backwards compatible)

---

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

