# 1Another MVP - Setup Guide

Complete setup instructions for running the 1Another MVP locally.

## Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ or 16+ (Install via Homebrew on macOS)
- **npm** (comes with Node.js)
- **Homebrew** (macOS - for PostgreSQL installation)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /Users/JackEllis/1A-MVP
npm install
```

### 2. Install and Set Up PostgreSQL

#### Install PostgreSQL (macOS)

```bash
# Install PostgreSQL 16 via Homebrew
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Verify PostgreSQL is running
brew services list | grep postgres
# Should show: postgresql@16 started
```

#### Create Database

```bash
# Create the 1another database
/opt/homebrew/opt/postgresql@16/bin/createdb 1another
```

#### Run Schema Migration

```bash
# Run schema
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another -f db/schema.sql

# Seed sample data
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another -f db/seed.sql
```

#### Verify Setup

```bash
# Check tables exist
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another -c "\dt"

# View sample doctors
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another -c "SELECT name, specialty FROM doctors;"

# Should see:
# Dr. Sarah Johnson | Cardiology
# Dr. Michael Chen  | Primary Care
```

### 3. Configure Convex

#### Sign Up / Login

```bash
npx convex dev
```

This will:
1. Prompt you to sign up/login to Convex
2. Create a new project
3. Generate `.convex/` directory
4. Generate `convex/_generated/` files
5. Start the Convex dev server

**Note:** Keep this terminal running while developing!

#### Get Convex URLs

After running `convex dev`, you'll see output like:

```
✔ Convex functions ready! (7.0s)
  https://amazing-animal-123.convex.cloud

Dashboard: https://dashboard.convex.dev/t/...
```

Copy these URLs for the next step.

### 4. Environment Variables

Create `.env.local` file in the project root:

```bash
# Copy from example
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Postgres Database
DATABASE_URL=postgresql://localhost:5432/1another

# Convex (from step 3)
CONVEX_DEPLOYMENT=amazing-animal-123
NEXT_PUBLIC_CONVEX_URL=https://amazing-animal-123.convex.cloud

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start Development Server

In a **new terminal** (keep Convex dev running):

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 6. Access the App

#### Landing Page
Visit: `http://localhost:3000`

#### Feed (Magic Link)
Visit: `http://localhost:3000/feed?p=650e8400-e29b-41d4-a716-446655440001&d=550e8400-e29b-41d4-a716-446655440001`

This loads:
- Patient: Dave Thompson
- Doctor: Dr. Sarah Johnson

#### Other Pages
- Library: `http://localhost:3000/library`
- Account: `http://localhost:3000/account`
- Content: `http://localhost:3000/content/chest-health`

## Verification Checklist

- [ ] Dependencies installed (`node_modules/` exists)
- [ ] PostgreSQL running (`psql -d 1another` works)
- [ ] Database tables created (`\dt` shows 9 tables)
- [ ] Sample data loaded (query `SELECT * FROM doctors;`)
- [ ] Convex dev server running (terminal shows "ready")
- [ ] `.env.local` configured with correct values
- [ ] Next.js dev server running (`npm run dev`)
- [ ] Landing page loads at localhost:3000
- [ ] Feed page loads with magic link
- [ ] No console errors in browser

## Common Issues

### Issue: "Cannot find module './_generated/server'"

**Solution:** Run `npx convex dev` in a separate terminal. This generates the required Convex files.

### Issue: PostgreSQL connection refused

**Solution:** 
```bash
# Start PostgreSQL 16
brew services start postgresql@16  # macOS

# Check if running
brew services list | grep postgres

# If using a different version (14, 15), adjust the command:
brew services start postgresql@14
```

### Issue: "relation does not exist"

**Solution:** Run the schema migration:
```bash
/opt/homebrew/opt/postgresql@16/bin/psql -d 1another -f db/schema.sql
```

### Issue: "command not found: psql"

**Solution:** PostgreSQL binaries are not in PATH. Use full path:
```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

# Or use full path each time
/opt/homebrew/opt/postgresql@16/bin/psql
```

### Issue: Videos not loading

**Note:** The sample data uses public URLs from Google Cloud Storage. These are for development only. For production, use a proper video hosting service (see `public/videos/README.md`).

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use a different port
PORT=3001 npm run dev
```

## Development Workflow

### Terminal Setup (3 terminals recommended)

**Terminal 1 - Convex Dev:**
```bash
cd /Users/JackEllis/1A-MVP
npx convex dev
```

**Terminal 2 - Next.js Dev:**
```bash
cd /Users/JackEllis/1A-MVP
npm run dev
```

**Terminal 3 - Commands:**
```bash
cd /Users/JackEllis/1A-MVP
# Available for git, database queries, etc.
```

### Hot Reloading

- **Next.js:** Auto-reloads on file changes
- **Convex:** Auto-deploys functions on save
- **Tailwind:** Watches for class changes

### Database Changes

After modifying `db/schema.sql`:

```bash
# Drop and recreate (development only!)
psql -d 1another -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql -d 1another -f db/schema.sql
psql -d 1another -f db/seed.sql
```

### Convex Schema Changes

After modifying `convex/schema.ts`:

1. Save the file
2. Convex dev server auto-deploys
3. Check terminal for any errors

## Next Steps

1. **Add Real Videos**: Replace sample URLs with actual video hosting
2. **Authentication**: Implement NextAuth.js or similar
3. **Email Notifications**: Set up Resend or SendGrid
4. **Analytics**: Add Posthog or Mixpanel
5. **Error Tracking**: Set up Sentry
6. **Testing**: Add Jest and React Testing Library

## Production Deployment

See [README.md](./README.md) for production deployment instructions.

## Need Help?

- Check [README.md](./README.md) for feature documentation
- Check [ClaudeMD.md](./ClaudeMD.md) for technical details
- Check [CHANGELOG.md](./CHANGELOG.md) for version history

---

**Happy Coding! 🚀**

