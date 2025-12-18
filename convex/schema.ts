import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Auth tables are now managed by NextAuth.js (not Convex)
export default defineSchema({
  // Doctor profiles with HeyGen integration
  doctorProfiles: defineTable({
    doctorId: v.string(), // Auth user ID
    name: v.string(),
    email: v.string(),
    specialty: v.optional(v.string()),
    clinicName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // HeyGen integration fields
    heygenAvatarId: v.optional(v.string()),
    heygenVoiceId: v.optional(v.string()),
    avatarStatus: v.union(
      v.literal("not_configured"),
      v.literal("pending"),
      v.literal("active"),
      v.literal("error")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_email", ["email"]),

  // Video templates (pre-made scripts doctors can clone)
  videoTemplates: defineTable({
    title: v.string(),
    description: v.string(),
    script: v.string(),
    category: v.string(),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    // Source attribution
    createdByDoctorId: v.optional(v.string()), // null for system templates
    isPublic: v.boolean(), // Can other doctors clone this?
    isSystemTemplate: v.boolean(), // Pre-made by 1Another
    // Metrics
    cloneCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_doctor", ["createdByDoctorId"])
    .index("by_public", ["isPublic"])
    .index("by_system", ["isSystemTemplate"]),

  // Generated videos (personalized versions created by doctors)
  generatedVideos: defineTable({
    doctorId: v.string(),
    templateId: v.optional(v.id("videoTemplates")), // Source template if cloned
    title: v.string(),
    description: v.optional(v.string()),
    script: v.string(),
    // HeyGen video details
    heygenVideoId: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
    // Status tracking
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
    // Sharing
    isPublic: v.boolean(), // Share with other doctors to clone
    // Metrics
    viewCount: v.number(),
    sentCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_status", ["status"])
    .index("by_template", ["templateId"])
    .index("by_public", ["isPublic"]),

  // Video generation jobs (tracking async HeyGen API calls)
  videoGenerationJobs: defineTable({
    doctorId: v.string(),
    generatedVideoId: v.id("generatedVideos"),
    // HeyGen job tracking
    heygenJobId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    progress: v.optional(v.number()), // 0-100 percentage
    errorMessage: v.optional(v.string()),
    // Timestamps
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_job", ["heygenJobId"])
    .index("by_video", ["generatedVideoId"])
    .index("by_status", ["status"]),

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

