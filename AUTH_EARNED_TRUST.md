# 🎯 Earned Trust Authentication Flow

## Philosophy: "Onboarding at the moment of earned trust, not before."

This app implements a **progressive authentication** strategy where users can consume valuable content **before** being asked to sign in. Authentication is introduced only when the user wants to:

- Save progress
- Receive reminders
- Access personalized content
- Follow doctors

## How It Works

### 1. Anonymous Access (Magic Link Entry)

Users arriving via magic link can immediately:
- ✅ Browse the feed
- ✅ Watch videos
- ✅ Explore the discover page
- ✅ View doctor profiles

**No sign-in required!** The user gets instant value.

### 2. Engagement Tracking

Behind the scenes, we track engagement using `localStorage`:

```typescript
// hooks/useEngagement.ts
const ENGAGEMENT_THRESHOLDS = {
  MIN_VIDEOS_WATCHED: 1,      // Watch at least 1 video
  MIN_WATCH_TIME_SECONDS: 30, // Or spend 30 seconds watching
  MIN_INTERACTIONS: 1,        // Or interact once (like, share, etc.)
};
```

Once any threshold is met, the user has **"earned trust"**.

### 3. Auth Prompt Triggers

The `AuthPrompt` component appears at these moments:

| Trigger | When |
|---------|------|
| `earned_trust` | After watching first video (2s delay) |
| `save_progress` | User tries to save content |
| `set_reminder` | User tries to set a health reminder |
| `personalized_content` | User tries to access My Health page |
| `follow_doctor` | User tries to follow a new doctor |

### 4. Soft Dismissal

Users can dismiss the auth prompt with "Maybe Later". The prompt won't reappear for 24 hours.

## Page-by-Page Breakdown

### `/feed` - Video Feed
- **Anonymous**: ✅ Full access, videos play immediately
- **Auth prompt**: After first video completes
- **When required**: Never (can browse indefinitely)

### `/discover` - Doctor Discovery  
- **Anonymous**: ✅ Full access, can browse all doctors
- **Auth prompt**: When trying to "follow" a new doctor
- **When required**: Never (can browse indefinitely)

### `/my-health` - Health Dashboard
- **Anonymous**: Shows a beautiful sign-in prompt explaining benefits
- **Auth prompt**: N/A (page itself is the prompt)
- **When required**: Always (contains personal health data)

## Technical Implementation

### Components

```
components/
├── AuthPrompt.tsx        # The earned-trust sign-in modal
├── Providers.tsx         # SessionProvider wrapper
└── SignInForm.tsx        # Full sign-in page form

hooks/
└── useEngagement.ts      # Tracks video views, watch time, interactions
```

### Key Files Modified

1. **`app/layout.tsx`** - Wrapped with `Providers` (SessionProvider)
2. **`app/feed/page.tsx`** - Removed `ProtectedRoute`, added engagement tracking
3. **`app/discover/page.tsx`** - Removed `ProtectedRoute`, soft auth prompts
4. **`app/my-health/page.tsx`** - Keeps protection with friendly unauthenticated view

### Using the Engagement Hook

```tsx
import { useEngagement } from "@/hooks/useEngagement";

const MyComponent = () => {
  const {
    hasEarnedTrust,
    trackVideoView,
    trackVideoComplete,
    trackInteraction,
    shouldShowAuthPrompt,
    markAuthPromptDismissed,
  } = useEngagement();

  // Track when user watches a video
  const handleVideoPlay = (videoId: string) => {
    trackVideoView(videoId);
  };

  // Check if we should show auth
  if (shouldShowAuthPrompt() && !isAuthenticated) {
    // Show AuthPrompt
  }
};
```

### Using the Auth Prompt

```tsx
import { AuthPrompt } from "@/components/AuthPrompt";

const MyPage = () => {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [trigger, setTrigger] = useState<"earned_trust" | "save_progress">("earned_trust");

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      setTrigger("save_progress");
      setShowAuthPrompt(true);
      return;
    }
    // Proceed with save
  };

  return (
    <>
      {/* Your page content */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        trigger={trigger}
      />
    </>
  );
};
```

## Authentication Methods

### Google Sign-In
- One-click sign-in with Google account
- Recommended for best UX

### Email Sign-In  
- Enter email address
- Credentials-based auth (development)
- Can be upgraded to magic link email with Resend

## Environment Variables

```bash
# Required
AUTH_SECRET=your-generated-secret

# Optional - Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true

# Optional - Email (for production magic links)
AUTH_RESEND_KEY=your-resend-api-key
```

## User Journey Example

```
1. Patient receives magic link from doctor
   ↓
2. Clicks link → Lands on /feed
   ↓
3. Watches personalized video from their doctor
   ↓
4. Engagement tracked: hasEarnedTrust = true
   ↓
5. After 2 seconds, soft AuthPrompt appears:
   "Save Your Progress - Create a free account..."
   ↓
6. User can:
   a) Sign in with Google → Full access
   b) Sign in with Email → Full access  
   c) Click "Maybe Later" → Continue browsing (prompt hidden 24h)
   ↓
7. User continues browsing, maybe watches more videos
   ↓
8. User clicks "My Health" tab
   ↓
9. Friendly sign-in page with benefits list
   ↓
10. User signs in → Full personalized experience
```

## Why This Approach?

### Traditional Auth:
- ❌ Sign-in wall blocks entry
- ❌ User must commit before seeing value
- ❌ Higher bounce rates
- ❌ Poor first impression

### Earned Trust Auth:
- ✅ Instant access to value
- ✅ User experiences the product first
- ✅ Sign-in feels like a natural next step
- ✅ Higher conversion rates
- ✅ Better user trust

## Testing the Flow

1. Clear localStorage: `localStorage.removeItem('1a_engagement')`
2. Open `/feed` in incognito
3. Watch a video
4. Auth prompt should appear after ~2 seconds
5. Click "Maybe Later"
6. Prompt won't appear again for 24 hours
7. Try to access `/my-health` → Sign-in prompt

---

**The key insight**: When users have already received value, signing up feels like unlocking more value rather than paying a toll to enter.
