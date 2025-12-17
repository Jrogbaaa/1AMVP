import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserIdOrFallback } from "./authHelpers";

/**
 * Get chat messages for user
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 */
export const getChatMessages = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user_timestamp", (q) => q.eq("userId", effectiveUserId))
      .collect();

    return messages.sort((a, b) => a.timestamp - b.timestamp);
  },
});

/**
 * Send chat message
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 */
export const sendMessage = mutation({
  args: {
    userId: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    const messageId = await ctx.db.insert("chatMessages", {
      userId: effectiveUserId,
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    });

    return { messageId };
  },
});

/**
 * Initialize onboarding chat
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 */
export const initializeOnboardingChat = mutation({
  args: { 
    userId: v.optional(v.string()), 
    doctorName: v.string(), 
    patientName: v.string() 
  },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    // Check if already initialized
    const existingMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
      .first();

    if (existingMessages) {
      return { alreadyInitialized: true };
    }

    // Send welcome message from doctor
    await ctx.db.insert("chatMessages", {
      userId: effectiveUserId,
      role: "assistant",
      content: `${args.patientName}, thanks for coming in today. Here's your next step. I'll guide you through everything.`,
      timestamp: Date.now(),
    });

    return { initialized: true };
  },
});

/**
 * Update onboarding progress
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 */
export const updateOnboardingProgress = mutation({
  args: {
    userId: v.optional(v.string()),
    currentStep: v.number(),
    completed: v.boolean(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    const existing = await ctx.db
      .query("onboardingProgress")
      .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        currentStep: args.currentStep,
        completed: args.completed,
        data: args.data,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("onboardingProgress", {
        userId: effectiveUserId,
        currentStep: args.currentStep,
        completed: args.completed,
        data: args.data,
        lastUpdated: Date.now(),
      });
    }

    return { success: true };
  },
});

/**
 * Get onboarding progress
 * 
 * Authentication: Optional (falls back to provided userId or anonymous)
 */
export const getOnboardingProgress = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Prefer authenticated user ID, fall back to provided userId
    const effectiveUserId = await getUserIdOrFallback(ctx, args.userId);

    const progress = await ctx.db
      .query("onboardingProgress")
      .withIndex("by_user", (q) => q.eq("userId", effectiveUserId))
      .first();

    return progress || {
      currentStep: 0,
      completed: false,
      data: {},
      lastUpdated: Date.now(),
    };
  },
});
