import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * POST /api/auth/sync-user
 * 
 * Syncs the currently authenticated user to Convex database.
 * Called after successful authentication to ensure user exists in Convex.
 * 
 * This creates:
 * 1. A user record in the users table
 * 2. For doctors: a doctorProfile record
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (!convex) {
      return NextResponse.json(
        { error: "Convex not configured" },
        { status: 500 }
      );
    }

    const { user } = session;
    const email = user.email!; // Already validated above
    const authId = user.id || email;

    // Sync user to Convex
    const result = await convex.mutation(api.users.upsertOnLogin, {
      authId,
      email,
      name: user.name || email.split("@")[0],
      role: user.role || "patient",
      healthProvider: user.healthProvider,
    });

    return NextResponse.json({
      success: true,
      userId: result.userId,
      isNewUser: result.isNewUser,
      role: user.role,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/sync-user
 * 
 * Returns the current user's sync status and profile data.
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (!convex) {
      return NextResponse.json(
        { error: "Convex not configured" },
        { status: 500 }
      );
    }

    const { user } = session;
    const email = user.email!; // Already validated above
    const authId = user.id || email;

    // Get full user profile from Convex
    const profile = await convex.query(api.users.getFullProfile, {
      authId,
    });

    if (!profile) {
      // User not synced yet - sync them
      const result = await convex.mutation(api.users.upsertOnLogin, {
        authId,
        email,
        name: user.name || email.split("@")[0],
        role: user.role || "patient",
        healthProvider: user.healthProvider,
      });

      return NextResponse.json({
        synced: true,
        isNewUser: result.isNewUser,
        user: {
          id: authId,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    return NextResponse.json({
      synced: true,
      isNewUser: false,
      user: profile,
    });
  } catch (error) {
    console.error("Error getting user sync status:", error);
    return NextResponse.json(
      { error: "Failed to get user sync status" },
      { status: 500 }
    );
  }
}

