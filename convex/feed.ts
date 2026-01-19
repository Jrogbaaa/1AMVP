import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId, getUserIdOrFallback } from "./authHelpers";

/**
 * Get personalized feed for user
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 * This allows both authenticated and anonymous users to view feeds
 */
export const getFeed = query({
  args: { 
    userId: v.optional(v.string()), 
    patientId: v.string(), 
    doctorId: v.string() 
  },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    // Check if user has existing feed
    const existingFeed = await ctx.db
      .query("feedItems")
      .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
      .collect();

    if (existingFeed.length > 0) {
      return existingFeed.sort((a, b) => a.position - b.position);
    }

    // Return empty array if no feed exists
    // Use the generateFeed mutation to create a new feed
    return [];
  },
});

/**
 * Generate initial feed (mutation for writes)
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 */
export const generateFeed = mutation({
  args: { 
    userId: v.optional(v.string()), 
    patientId: v.string(), 
    doctorId: v.string() 
  },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    // Check if feed already exists
    const existingFeed = await ctx.db
      .query("feedItems")
      .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
      .first();

    if (existingFeed) {
      return { success: true, message: "Feed already exists" };
    }

    // Card 1: Always the doctor's personalized video
    const card1 = {
      userId: effectiveUserId,
      videoId: "750e8400-e29b-41d4-a716-446655440001",
      position: 0,
      reason: "Your personalized follow-up from your doctor",
      timestamp: Date.now(),
    };

    // Cards 2+: Educational content
    const educationalCards = [
      {
        userId: effectiveUserId,
        videoId: "750e8400-e29b-41d4-a716-446655440002",
        position: 1,
        reason: "Recommended based on your recent visit",
        timestamp: Date.now(),
      },
      {
        userId: effectiveUserId,
        videoId: "750e8400-e29b-41d4-a716-446655440003",
        position: 2,
        reason: "Heart health essentials",
        timestamp: Date.now(),
      },
      {
        userId: effectiveUserId,
        videoId: "750e8400-e29b-41d4-a716-446655440004",
        position: 3,
        reason: "Important for your treatment",
        timestamp: Date.now(),
      },
      {
        userId: effectiveUserId,
        videoId: "750e8400-e29b-41d4-a716-446655440005",
        position: 4,
        reason: "Personalized for your condition",
        timestamp: Date.now(),
      },
    ];

    // Insert feed items with error handling
    try {
      await ctx.db.insert("feedItems", card1);
      for (const card of educationalCards) {
        await ctx.db.insert("feedItems", card);
      }
    } catch (error) {
      console.error("Failed to generate feed:", error);
      throw error;
    }

    return { success: true, message: "Feed generated" };
  },
});

/**
 * Track scroll event
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 * Rate limiting is applied per user ID
 */
export const trackScroll = mutation({
  args: { 
    userId: v.optional(v.string()), 
    videoId: v.string(), 
    position: v.number() 
  },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    const session = await ctx.db
      .query("userSessions")
      .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
      .first();

    const now = Date.now();
    const maxScrollsPerSession = 20; // Rate limit: 20 scrolls per session
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes

    if (!session) {
      // Create new session
      await ctx.db.insert("userSessions", {
        userId: effectiveUserId,
        scrollCount: 1,
        lastScrollTime: now,
        sessionStart: now,
        isRateLimited: false,
      });
      return { rateLimited: false };
    }

    // Check if session expired
    const sessionExpired = now - session.sessionStart > sessionTimeout;
    if (sessionExpired) {
      // Reset session
      await ctx.db.patch(session._id, {
        scrollCount: 1,
        lastScrollTime: now,
        sessionStart: now,
        isRateLimited: false,
      });
      return { rateLimited: false };
    }

    // Increment scroll count
    const newScrollCount = session.scrollCount + 1;
    const rateLimited = newScrollCount >= maxScrollsPerSession;

    await ctx.db.patch(session._id, {
      scrollCount: newScrollCount,
      lastScrollTime: now,
      isRateLimited: rateLimited,
    });

    return { rateLimited };
  },
});

/**
 * Check if user is rate limited
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 */
export const checkRateLimit = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    const session = await ctx.db
      .query("userSessions")
      .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
      .first();

    if (!session) {
      return { rateLimited: false, scrollCount: 0 };
    }

    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000;
    const sessionExpired = now - session.sessionStart > sessionTimeout;

    if (sessionExpired) {
      return { rateLimited: false, scrollCount: 0 };
    }

    return {
      rateLimited: session.isRateLimited,
      scrollCount: session.scrollCount,
      remainingScrolls: Math.max(0, 20 - session.scrollCount),
    };
  },
});
