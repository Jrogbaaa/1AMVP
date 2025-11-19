import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Auth tables are now managed by NextAuth.js (not Convex)
export default defineSchema({
  // Feed items with real-time updates
  feedItems: defineTable({
    userId: v.string(),
    videoId: v.string(),
    position: v.number(),
    reason: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_position", ["userId", "position"]),

  // Chat messages for onboarding
  chatMessages: defineTable({
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_timestamp", ["userId", "timestamp"]),

  // Session tracking for rate limiting
  userSessions: defineTable({
    userId: v.string(),
    scrollCount: v.number(),
    lastScrollTime: v.number(),
    sessionStart: v.number(),
    isRateLimited: v.boolean(),
  })
    .index("by_user", ["userId"]),

  // Video engagement events (real-time)
  videoEvents: defineTable({
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
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_video", ["videoId"])
    .index("by_user_video", ["userId", "videoId"]),

  // Onboarding progress (real-time)
  onboardingProgress: defineTable({
    userId: v.string(),
    currentStep: v.number(),
    completed: v.boolean(),
    data: v.any(),
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"]),
});

