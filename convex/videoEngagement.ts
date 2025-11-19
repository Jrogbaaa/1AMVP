import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Track video engagement event
export const trackVideoEvent = mutation({
  args: {
    userId: v.string(),
    videoId: v.string(),
    eventType: v.union(
      v.literal("view"),
      v.literal("play"),
      v.literal("pause"),
      v.literal("complete"),
      v.literal("like"),
      v.literal("save")
    ),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("videoEvents", {
      userId: args.userId,
      videoId: args.videoId,
      eventType: args.eventType,
      timestamp: Date.now(),
      metadata: args.metadata,
    });

    return { success: true };
  },
});

// Get user's video engagement
export const getUserVideoEngagement = query({
  args: { userId: v.string(), videoId: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("videoEvents")
      .withIndex("by_user_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .collect();

    const hasViewed = events.some((e) => e.eventType === "view");
    const hasPlayed = events.some((e) => e.eventType === "play");
    const hasCompleted = events.some((e) => e.eventType === "complete");
    const hasLiked = events.some((e) => e.eventType === "like");
    const hasSaved = events.some((e) => e.eventType === "save");

    return {
      viewed: hasViewed,
      played: hasPlayed,
      completed: hasCompleted,
      liked: hasLiked,
      saved: hasSaved,
      eventCount: events.length,
    };
  },
});

// Get all engagement for a user (for health score calculation)
export const getUserEngagementSummary = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("videoEvents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const completedVideos = new Set(
      events.filter((e) => e.eventType === "complete").map((e) => e.videoId)
    );

    const likedVideos = new Set(
      events.filter((e) => e.eventType === "like").map((e) => e.videoId)
    );

    const savedVideos = new Set(
      events.filter((e) => e.eventType === "save").map((e) => e.videoId)
    );

    return {
      totalEvents: events.length,
      completedVideosCount: completedVideos.size,
      likedVideosCount: likedVideos.size,
      savedVideosCount: savedVideos.size,
      completedVideoIds: Array.from(completedVideos),
    };
  },
});

