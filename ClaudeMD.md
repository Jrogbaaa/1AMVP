# 1Another MVP - Technical Documentation

> **AI Context Document**: This file provides comprehensive technical context for AI assistants (Claude, GPT, etc.) working on the 1Another codebase.

## 🎯 Project Overview

**1Another** is a mobile-first patient communication and education platform where **the doctor is the center of the experience**. It combines a TikTok-style vertical video feed with a clean medical dashboard.

### Core Philosophy

1. **Doctor-first**: Patient's doctor is always the entry point
2. **Magic link identity**: No redundant onboarding questions
3. **Feed = engagement**: TikTok-style for active content consumption
4. **Dashboard = browsing**: Clean, calm UI for exploration
5. **Radical simplicity**: Remove complexity unless it compounds value

## 🏗️ Architecture

### Tech Stack

```
Frontend:    Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v3.4.1
Backend:     PostgreSQL 16 (persistent data), Convex (real-time)
Hosting:     Vercel (recommended)
Assets:      Static files / CDN
Styling:     tailwindcss + autoprefixer (Tailwind v3)
```

**Note:** Downgraded from Tailwind v4 to v3.4.1 for stability (Nov 18, 2024)

### Current Configuration (Verified Working)

```
✅ Next.js 15.5.6        → http://localhost:3000
✅ PostgreSQL 16         → Database: 1another (9 tables)
✅ Convex (deployed)     → Real-time features enabled
✅ Tailwind CSS v3.4.1   → Standard plugins (tailwindcss + autoprefixer)
✅ React 19              → Latest stable
✅ TypeScript 5.6        → Strict mode enabled
```

**Latest Updates (v1.1.1 - Nov 19, 2024):**
- ✅ **Vercel deployment guides** with automatic GitHub deployment
- ✅ **HeartScore fill animation fixed** - proper proportional fill with clip-path
- ✅ **Production deployment documentation** complete
- ✅ **Environment variables guide** for Vercel

**Recent Updates (v1.1.0 - Nov 19, 2024):**
- ✅ **Authentication system** with NextAuth.js (magic link + Google OAuth)
- ✅ **Protected routes** for Feed, Library, and Account
- ✅ **User menu** with sign-out functionality
- ✅ **Session management** with JWT tokens

**Previous Updates (v1.0.2 - Nov 18, 2024):**
- ✅ Share button added to all videos
- ✅ HeartScore with visual fill effect (0-100%)
- ✅ Landing page redesigned
- ✅ Tailwind CSS fixed (downgraded v4 → v3.4.1)

### Directory Structure

```
app/
├── feed/              # TikTok-style vertical feed
├── library/           # Video browsing dashboard  
├── account/           # Patient profile
├── content/           # SEO content pages
├── api/               # API routes
├── layout.tsx         # Root layout
├── page.tsx           # Landing page
├── globals.css        # Global styles
└── sitemap.ts         # SEO sitemap

components/
├── VideoCard.tsx              # Feed video player
├── ChatOnboarding.tsx         # Doctor-guided onboarding
├── HeartScore.tsx             # Health score indicator
├── TrustBadge.tsx             # Privacy badge
├── ScheduleAppointment.tsx    # Appointment modal
├── RateLimitMessage.tsx       # Session limit UI
├── SchemaMarkup.tsx           # SEO schema
├── ConvexClientProvider.tsx   # Auth provider wrapper
├── SignInForm.tsx             # Sign-in UI
├── ProtectedRoute.tsx         # Route protection HOC
└── UserMenu.tsx               # User menu with sign-out

convex/
├── schema.ts              # Convex database schema (incl. auth tables)
├── auth.ts                # Auth configuration (magic link + Google)
├── http.ts                # HTTP routes for OAuth callbacks
├── feed.ts                # Feed logic & rate limiting
├── videoEngagement.ts     # Video tracking
└── chat.ts                # Chat & onboarding

db/
├── schema.sql             # PostgreSQL schema
└── seed.sql               # Sample data

lib/
├── types.ts               # TypeScript definitions
├── utils.ts               # Utility functions
└── schema.ts              # SEO schema generators

public/
├── robots.txt             # Crawler config
└── images/                # Static assets
```

## 📊 Data Model

### PostgreSQL (Persistent Data)

**users**
- Patient demographics
- Contact information
- Registration date

**doctors**
- Name, specialty, credentials
- Clinic information
- Avatar URL

**videos**
- Content library
- Metadata (title, description, duration)
- Categories and tags
- Personalization flags

**user_doctors**
- Patient-doctor relationships
- Primary doctor designation

**user_video_engagement**
- Watch history
- Like/save status
- Completion tracking

**appointment_requests**
- Date/time preferences
- Reason for visit
- Status tracking

**health_metrics**
- Score calculation
- Component tracking
- Update timestamps

**onboarding_state**
- Progress tracking
- Collected data
- Completion status

### Convex (Real-Time Data)

**Auth Tables (Convex Auth)**
- `authAccounts` - OAuth provider accounts
- `authSessions` - User sessions and tokens
- `authVerificationCodes` - Magic link codes
- `users` - User profiles (extended from PostgreSQL)

**feedItems**
- Dynamic feed generation
- Position ordering
- Recommendation reasons

**chatMessages**
- Onboarding conversations
- Role-based messages
- Timestamps

**userSessions**
- Rate limit enforcement
- Scroll count tracking
- Session management

**videoEvents**
- Real-time engagement
- Event types: view, play, pause, complete, like, save
- Analytics metadata

**onboardingProgress**
- Live state sync
- Step tracking
- Dynamic updates

## 🎨 UI/UX Patterns

### Feed Experience (`/feed`)

**Mobile-First Container:**
```css
.feed-container {
  max-width: 28rem;  /* Mobile width */
  margin: 0 auto;
  background: black;
  height: 100vh;
  height: 100dvh;    /* Dynamic viewport height */
}
```

**Snap Scrolling:**
```css
.snap-container {
  height: 100%;
  overflow-y: scroll;
  snap-type: y mandatory;
  scroll-behavior: smooth;
}

.snap-item {
  snap-align: start;
  height: 100vh;
  height: 100dvh;
}
```

**Video Card Structure:**
```
┌─────────────────────┐
│ Overlay Gradient    │ ← Black gradient top/bottom
│                     │
│  [Play/Pause]       │ ← Center tap target
│                     │
│ Title               │
│ Description         │
│                     │
│ [Doctor Avatar]     │ ← Right rail
│ [Like]              │
│ [Message]           │
│ [Save]              │
└─────────────────────┘
```

**Card #1 (Personalized):**
- Doctor's face poster
- Custom greeting: "{PatientName}, thanks for coming in today"
- Subheadline: "Your follow-up video from Dr. {DoctorName}"
- CTAs: "Message your doctor" + "Start onboarding"

**Cards 2+ (Educational):**
- Category-based content
- AI-driven recommendations
- Contextual to patient condition
- Doctor specialty alignment

### Dashboard Experience (`/library`, `/account`)

**Clean Medical UI:**
- White backgrounds
- Ample whitespace
- Card-based layouts
- Clear typography hierarchy
- Trust indicators

**Library Grid:**
```
┌─────┬─────┬─────┐
│ [V] │ [V] │ [V] │  ← Video thumbnails
├─────┼─────┼─────┤
│ [V] │ [V] │ [V] │
└─────┴─────┴─────┘
```

**Search + Filter:**
- Real-time search
- Category pills
- Responsive grid (1-3 columns)

### Chat Onboarding

**Design:**
- Bottom sheet modal
- Doctor avatar in header
- Conversation bubbles
- Input at bottom
- Non-blocking (feed continues)

**Flow:**
1. Welcome message
2. Medications question
3. Allergies question
4. Phone number collection
5. Schedule prompt
6. Completion message

**Implementation Notes:**
- Use setTimeout for typing delay effect
- Auto-scroll to latest message
- Progress tracking in Convex
- Updates health score on completion

## 🎯 Key Features Implementation

### 1. Magic Link System

**URL Format:**
```
https://1another.com/feed?p={patientId}&d={doctorId}
```

**Extraction:**
```typescript
const extractMagicLinkParams = (url: string) => {
  const urlObj = new URL(url);
  const patientId = urlObj.searchParams.get("p");
  const doctorId = urlObj.searchParams.get("d");
  return { patientId, doctorId };
};
```

### 1.5 Authentication System

**Implementation:** Convex Auth with magic link + Google OAuth

**Authentication Flow:**
```
1. User receives magic link → /feed?p={id}&d={id}
2. Clicks link → Redirected to /auth
3. Sign-in options displayed:
   a) Email magic link (passwordless)
   b) Google OAuth
4. After auth → Redirected to /feed
5. Session persists via Convex Auth
```

**Components:**

**ConvexClientProvider** (`components/ConvexClientProvider.tsx`)
- Wraps entire app in `app/layout.tsx`
- Provides auth context to all components
- Manages Convex connection and session

**SignInForm** (`components/SignInForm.tsx`)
- Email input for magic link
- Google OAuth button
- Loading states
- Error handling
- Success confirmation

**ProtectedRoute** (`components/ProtectedRoute.tsx`)
- HOC that wraps protected pages
- Checks `useConvexAuth()` status
- Shows loading spinner during check
- Redirects to `/auth` if not authenticated
- Used in: Feed, Library, Account

**UserMenu** (`components/UserMenu.tsx`)
- Dropdown menu in page headers
- Sign-out functionality
- User avatar/icon

**Auth Configuration** (`convex/auth.ts`)
```typescript
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({ id: "magic-link" }), // Email magic links
    Google,                          // Google OAuth
  ],
});
```

**HTTP Routes** (`convex/http.ts`)
```typescript
import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http); // Adds OAuth callback routes
export default http;
```

**Protected Page Example:**
```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FeedPage() {
  return (
    <ProtectedRoute>
      {/* Page content */}
    </ProtectedRoute>
  );
}
```

**Authentication Hooks:**
```typescript
// Check auth status
import { useConvexAuth } from "convex/react";
const { isLoading, isAuthenticated } = useConvexAuth();

// Sign in/out actions
import { useAuthActions } from "@convex-dev/auth/react";
const { signIn, signOut } = useAuthActions();

// Usage
await signIn("magic-link", { email, redirectTo: "/feed" });
await signIn("google", { redirectTo: "/feed" });
await signOut();
```

**Environment Variables Required:**
```bash
# Convex Dashboard (Production)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
SITE_URL=https://your-domain.com

# .env.local (Development)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-deployment
```

**Google OAuth Setup:**
1. Google Cloud Console → Create OAuth credentials
2. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`
3. Copy Client ID and Secret
4. Add to Convex dashboard environment variables

**Security Features:**
- ✅ Session-based authentication
- ✅ HTTPS-only cookies in production
- ✅ OAuth state validation
- ✅ CSRF protection
- ✅ Automatic token refresh
- ✅ Secure password hashing (for future email/password)

**Documentation:**
- See `AUTH_SETUP.md` for detailed setup instructions
- See `CHANGELOG.md` v1.1.0 for implementation details

**Landing Page Logic:**
```typescript
// app/page.tsx
if (searchParams.p && searchParams.d) {
  redirect(`/feed?p=${searchParams.p}&d=${searchParams.d}`);
}
```

### 2. Health Score Calculation

**Algorithm (v1.0.2 - Updated Nov 18, 2024):**
```typescript
// Component initialization
const [healthScore, setHealthScore] = useState(55); // Start at 55%

// Video completion handler
const handleVideoComplete = () => {
  if (currentIndex === 0) {
    // Completed doctor's personalized video - big boost!
    setHealthScore((prev) => Math.min(prev + 20, 100)); // +20%
  } else {
    // Completed educational video - small boost
    setHealthScore((prev) => Math.min(prev + 5, 100)); // +5%
  }
};

// Onboarding completion handler
const handleCloseChat = () => {
  setIsChatOpen(false);
  // +10% for completing onboarding
  setHealthScore((prev) => Math.min(prev + 10, 100));
};
```

**Color Coding:**
```typescript
const getHealthScoreColor = (score: number) => {
  if (score >= 75) return "text-green-500";    // Excellent (75-100%)
  if (score >= 50) return "text-yellow-500";   // In progress (50-74%)
  return "text-red-500";                       // Needs work (0-49%)
};
```

**Visual Fill Effect:**
```typescript
// Heart fills from bottom to top
const fillPercentage = Math.min(Math.max(score, 0), 100);
const fillHeight = `${100 - fillPercentage}%`;

// Layered approach:
// 1. Background: White heart with gray outline
// 2. Fill layer: Colored heart that slides up
// 3. Text overlay: Score percentage (always visible)
```

**Display:**
- Heart icon with fill color
- Score number overlaid
- Message text below (optional)
- Always visible in header

### 3. Rate Limiting

**Rules:**
- 20 scrolls per session
- Session = 30 minutes
- Warning at 5 remaining
- Block message at limit

**Implementation:**
```typescript
// convex/feed.ts
export const trackScroll = mutation({
  handler: async (ctx, args) => {
    const maxScrolls = 20;
    const sessionTimeout = 30 * 60 * 1000;
    
    // Check/update session
    const newScrollCount = session.scrollCount + 1;
    const rateLimited = newScrollCount >= maxScrolls;
    
    await ctx.db.patch(session._id, {
      scrollCount: newScrollCount,
      isRateLimited: rateLimited,
    });
    
    return { rateLimited };
  },
});
```

### 4. Feed Generation

**Convex Query:**
```typescript
export const getFeed = query({
  handler: async (ctx, args) => {
    // Card 1: Always doctor's personalized video
    const card1 = {
      videoId: doctorVideoId,
      position: 0,
      reason: "Your personalized follow-up from your doctor",
    };
    
    // Cards 2+: Educational content
    // - Filter by patient conditions
    // - Match doctor specialty
    // - Prioritize recent content
    
    return [card1, ...educationalCards];
  },
});
```

### 5. Video Engagement Tracking

**Events:**
```typescript
type VideoEvent = 
  | "view"      // Video entered viewport
  | "play"      // Play button pressed
  | "pause"     // Pause button pressed
  | "complete"  // Video finished
  | "like"      // Liked by user
  | "save"      // Saved for later
```

**Tracking:**
```typescript
export const trackVideoEvent = mutation({
  args: { userId, videoId, eventType, metadata },
  handler: async (ctx, args) => {
    await ctx.db.insert("videoEvents", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
```

**Health Score Update (v1.0.2 - Updated):**
- **Initial score**: 55%
- First doctor video complete → +20%
- Each educational video complete → +5%
- Onboarding complete → +10%
- Maximum score → 100%

**Visual Fill Effect:**
- Heart fills from bottom to top based on percentage
- Smooth 0.5s CSS transition
- Color changes: Red (0-49%), Yellow (50-74%), Green (75-100%)

### 6. Appointment Scheduling

**Modal Flow:**
1. Open modal (click "Schedule Follow-Up")
2. Display doctor info
3. Select date (date picker, min = today)
4. Select time (dropdown, clinic hours)
5. Optional reason (textarea)
6. Submit request
7. Show confirmation
8. Update health score (+15 points)

**Database:**
```sql
INSERT INTO appointment_requests (
  user_id, doctor_id, requested_date, 
  requested_time, reason, status
) VALUES ($1, $2, $3, $4, $5, 'pending');
```

## 🔍 SEO Implementation

### robots.txt

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

Disallow: /api/admin
Sitemap: https://1another.com/sitemap.xml
```

### Schema Markup Types

**VideoObject:**
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video title",
  "description": "Video description",
  "thumbnailUrl": "https://...",
  "uploadDate": "2025-11-18",
  "duration": "PT180S",
  "contentUrl": "https://..."
}
```

**Physician:**
```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. Sarah Johnson",
  "medicalSpecialty": "Cardiology",
  "worksFor": {
    "@type": "MedicalOrganization",
    "name": "Heart Health Clinic"
  }
}
```

**Usage:**
```tsx
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { generateVideoSchema } from "@/lib/schema";

export default function VideoPage({ video }) {
  return (
    <>
      <SchemaMarkup schema={generateVideoSchema(video)} />
      {/* Page content */}
    </>
  );
}
```

### Content Pages

**Purpose:**
- SEO-optimized educational content
- Internal linking
- Topic authority
- Crawler-friendly HTML

**Structure:**
```
/content/
  chest-health/     # Chest health tips
  blood-pressure/   # Blood pressure guide
  medication/       # Medication safety
  exercise/         # Exercise guidelines
  nutrition/        # Heart-healthy diet
```

**Template:**
- H1 title
- Meta description
- Breadcrumb markup
- HowTo schema
- Internal links to library
- Trust badges
- CTA to schedule appointment

## 🎨 Styling System

### Tailwind Configuration

**Colors:**
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    600: '#0284c7',  // Main brand
    700: '#0369a1',
  },
  medical: {
    trust: '#0369a1',
    success: '#22c55e',
    warning: '#fbbf24',
    danger: '#ef4444',
  }
}
```

**Custom Classes:**
```css
.feed-container      /* Mobile viewport */
.snap-container      /* Scroll snapping */
.snap-item           /* Snap target */
.video-card          /* Video wrapper */
.video-overlay       /* Gradient overlay */
.dashboard-container /* Max-width wrapper */
.btn-primary         /* Primary button */
.btn-secondary       /* Secondary button */
.card                /* Dashboard card */
.input               /* Form input */
.trust-badge         /* Security indicator */
```

### Component Patterns

**Mobile-First:**
```tsx
// Always start with mobile, then add breakpoints
<div className="w-full md:w-1/2 lg:w-1/3">
```

**Accessibility:**
```tsx
<button
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  tabIndex={0}
  aria-label="Descriptive label"
  className="..."
>
```

**Early Returns:**
```tsx
const Component = ({ data }) => {
  if (!data) return <Loading />;
  if (error) return <Error />;
  return <Content data={data} />;
};
```

**Const Over Function:**
```tsx
// Prefer this:
const handleClick = () => { ... };

// Over this:
function handleClick() { ... }
```

## 🔐 Privacy & Security

### Trust Indicators

**Messaging:**
- "Your information is secure and private to you and your doctor"
- Shield icons
- Medical-grade trust language
- HIPAA-conscious patterns

**Implementation:**
```tsx
<TrustBadge className="my-8" />
```

**Placement:**
- Footer of feed pages
- Account page
- Library page
- Content pages
- Onboarding chat

### Data Protection

**Best Practices:**
- No client-side storage of PHI
- Secure transmission (HTTPS only)
- Minimal data collection
- Clear data ownership
- User control over data

## 🛠️ PostgreSQL Setup (Production)

### Installation Paths

**macOS (Homebrew):**
```bash
# PostgreSQL 16 (recommended)
/opt/homebrew/opt/postgresql@16/bin/

# Common commands:
/opt/homebrew/opt/postgresql@16/bin/createdb 1another
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another
/opt/homebrew/opt/postgresql@16/bin/pg_dump -d 1another > backup.sql
```

**Add to PATH (optional):**
```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

# Reload shell
source ~/.zshrc
```

### Database Connection

**Local Development:**
```
DATABASE_URL=postgresql://localhost:5432/1another
```

**Production (with credentials):**
```
DATABASE_URL=postgresql://user:password@host:5432/1another
```

### Sample Data

The seed file includes:
- **2 Doctors**: Dr. Sarah Johnson (Cardiology), Dr. Michael Chen (Primary Care)
- **1 Patient**: Dave Thompson (dave@example.com)
- **5 Videos**: 1 personalized follow-up + 4 educational
- **1 User-Doctor link**: Dave → Dr. Johnson
- **Health metrics**: Initialized for Dave
- **Onboarding state**: Ready for Dave

## 🚀 Performance Optimization

### Next.js Optimizations

**Image Optimization:**
```tsx
import Image from "next/image";

<Image
  src="/images/doctor.jpg"
  alt="Dr. Johnson"
  width={64}
  height={64}
  className="rounded-full"
/>
```

**Dynamic Imports:**
```tsx
const ChatOnboarding = dynamic(() => 
  import("@/components/ChatOnboarding"),
  { ssr: false }
);
```

**Metadata:**
```tsx
export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

### Convex Real-Time

**Queries (Read):**
```typescript
export const getData = query({
  handler: async (ctx, args) => {
    return await ctx.db.query("table").collect();
  },
});
```

**Mutations (Write):**
```typescript
export const updateData = mutation({
  handler: async (ctx, args) => {
    await ctx.db.insert("table", args);
  },
});
```

**Client Usage:**
```tsx
const data = useQuery(api.module.getData, { args });
const mutate = useMutation(api.module.updateData);
```

## 🧪 Testing Strategy

### Manual Testing Checklist

**Feed Flow:**
- [ ] Magic link redirects to feed
- [ ] Card #1 shows personalized video
- [ ] Cards 2+ show educational content
- [ ] Snap scrolling works smoothly
- [ ] Video auto-plays on scroll
- [ ] Play/pause button works
- [ ] Like/save buttons toggle
- [ ] Rate limit appears at 20 scrolls
- [ ] Health score updates on completion

**Onboarding:**
- [ ] Chat opens from CTA
- [ ] Doctor avatar displays
- [ ] Questions appear in sequence
- [ ] User can type and send
- [ ] Progress saves to Convex
- [ ] Completion updates score
- [ ] Modal closes after completion

**Library:**
- [ ] Search filters videos
- [ ] Category filters work
- [ ] Grid responsive on mobile/desktop
- [ ] Video cards link correctly
- [ ] Thumbnails load

**Account:**
- [ ] Profile displays correctly
- [ ] Doctor info accurate
- [ ] Health score visible
- [ ] Schedule modal opens
- [ ] Date/time selection works
- [ ] Request submits successfully

**SEO:**
- [ ] robots.txt accessible
- [ ] Sitemap generates
- [ ] Schema markup valid
- [ ] Meta tags present
- [ ] Content pages crawlable

## 🐛 Common Issues & Solutions

### Issue: Videos not auto-playing

**Solution:**
```tsx
useEffect(() => {
  if (isActive && videoRef.current) {
    videoRef.current.play().catch(console.error);
  }
}, [isActive]);
```

### Issue: Scroll snap not working on iOS

**Solution:**
```css
.snap-container {
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: y mandatory;
}
```

### Issue: Health score not updating

**Check:**
1. Convex mutation called?
2. Event tracked correctly?
3. Score calculation logic?
4. State update triggered?

### Issue: Magic link not parsing

**Solution:**
```typescript
// Use URL API, not regex
const url = new URL(window.location.href);
const patientId = url.searchParams.get("p");
```

## 🚀 Production Deployment

### Vercel Deployment (Recommended)

**Automatic deployments on every push to GitHub!**

See comprehensive guides:
- **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)** - Complete deployment walkthrough
- **[VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)** - Environment variables quick reference

### Quick Deployment Steps:

```bash
# 1. Deploy Convex to production
npx convex deploy --prod

# 2. Push to GitHub
git push origin main

# 3. Connect GitHub to Vercel
# - Go to vercel.com → Import from GitHub
# - Add environment variables (see VERCEL_ENV_VARIABLES.md)
# - Deploy!
```

### Production Environment Variables:

```env
# Authentication (NextAuth.js)
AUTH_SECRET=ONHeIQHjG7f6PvZEHitgrembBs5iBlMPL7TydQNv2jI=
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://your-vercel-url.vercel.app

# Database (Vercel Postgres or other)
DATABASE_URL=postgresql://user:pass@host/db

# Convex Production
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# App URL
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app

# Google OAuth (Optional)
AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true
```

### Post-Deployment Checklist:

- [ ] Convex production deployment complete
- [ ] Database schema and seed data loaded
- [ ] All environment variables set in Vercel
- [ ] Google OAuth redirect URIs updated (if using)
- [ ] Authentication flow tested
- [ ] Protected routes working
- [ ] Video playback functional
- [ ] Mobile responsiveness verified
- [ ] Lighthouse audit passed
- [ ] Monitoring/logging configured

### Automatic Deployments:

Once connected to Vercel:
- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Automatic preview with unique URL

### Troubleshooting Deployment:

**Build fails:**
- Check Vercel deployment logs
- Verify `npm run build` works locally
- Ensure all dependencies in package.json

**Auth not working:**
- Verify `NEXTAUTH_URL` uses `https://`
- Check `AUTH_SECRET` is set
- Confirm `AUTH_TRUST_HOST=true`

**Database connection fails:**
- Verify `DATABASE_URL` is correct
- Run schema.sql and seed.sql on production database
- Check database is accessible from Vercel

**Convex errors:**
- Ensure `CONVEX_DEPLOYMENT` starts with `prod:`
- Verify `NEXT_PUBLIC_CONVEX_URL` is correct
- Confirm `npx convex deploy --prod` was run

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Convex Docs](https://docs.convex.dev)
- [Schema.org](https://schema.org)

### Code Style
- Early returns for readability
- Descriptive variable names
- Handle prefix for event handlers
- Const over function declarations
- Accessibility first

### Development Workflow
1. Read requirements carefully
2. Plan component structure
3. Implement core functionality
4. Add accessibility features
5. Test on mobile first
6. Add desktop responsive
7. Validate SEO markup
8. Update documentation

---

**AI Note:** This document is maintained for AI assistants working on the codebase. When making changes, update this file along with README.md and CHANGELOG.md for consistency [[memory:4554886]].

