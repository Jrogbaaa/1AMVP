import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get personalized feed for user
export const getFeed = query({
  args: { userId: v.string(), patientId: v.string(), doctorId: v.string() },
  handler: async (ctx, args) => {
    // Check if user has existing feed
    const existingFeed = await ctx.db
      .query("feedItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (existingFeed.length > 0) {
      return existingFeed.sort((a, b) => a.position - b.position);
    }

    // Return empty array if no feed exists
    // Use the generateFeed mutation to create a new feed
    return [];
  },
});

// Generate initial feed (mutation for writes)
export const generateFeed = mutation({
  args: { userId: v.string(), patientId: v.string(), doctorId: v.string() },
  handler: async (ctx, args) => {
    // Check if feed already exists
    const existingFeed = await ctx.db
      .query("feedItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingFeed) {
      return { success: true, message: "Feed already exists" };
    }

    // Card 1: Always the doctor's personalized video
    const card1 = {
      userId: args.userId,
      videoId: "750e8400-e29b-41d4-a716-446655440001",
      position: 0,
      reason: "Your personalized follow-up from your doctor",
      timestamp: Date.now(),
    };

    // Cards 2+: Educational content
    const educationalCards = [
      {
        userId: args.userId,
        videoId: "750e8400-e29b-41d4-a716-446655440002",
        position: 1,
        reason: "Recommended based on your recent visit",
        timestamp: Date.now(),
      },
      {
        userId: args.userId,
        videoId: "750e8400-e29b-41d4-a716-446655440003",
        position: 2,
        reason: "Heart health essentials",
        timestamp: Date.now(),
      },
      {
        userId: args.userId,
        videoId: "750e8400-e29b-41d4-a716-446655440004",
        position: 3,
        reason: "Important for your treatment",
        timestamp: Date.now(),
      },
      {
        userId: args.userId,
        videoId: "750e8400-e29b-41d4-a716-446655440005",
        position: 4,
        reason: "Personalized for your condition",
        timestamp: Date.now(),
      },
    ];

    // Insert feed items
    await ctx.db.insert("feedItems", card1);
    for (const card of educationalCards) {
      await ctx.db.insert("feedItems", card);
    }

    return { success: true, message: "Feed generated" };
  },
});

// Track scroll event
export const trackScroll = mutation({
  args: { userId: v.string(), videoId: v.string(), position: v.number() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("userSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();
    const maxScrollsPerSession = 20; // Rate limit: 20 scrolls per session
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes

    if (!session) {
      // Create new session
      await ctx.db.insert("userSessions", {
        userId: args.userId,
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

// Check if user is rate limited
export const checkRateLimit = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("userSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
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

