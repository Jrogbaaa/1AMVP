# Changelog

All notable changes to the 1Another MVP project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

