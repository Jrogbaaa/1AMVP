import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get chat messages for user
export const getChatMessages = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user_timestamp", (q) => q.eq("userId", args.userId))
      .collect();

    return messages.sort((a, b) => a.timestamp - b.timestamp);
  },
});

// Send chat message
export const sendMessage = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("chatMessages", {
      userId: args.userId,
      role: args.role,
      content: args.content,
      timestamp: Date.now(),
    });

    return { messageId };
  },
});

// Initialize onboarding chat
export const initializeOnboardingChat = mutation({
  args: { userId: v.string(), doctorName: v.string(), patientName: v.string() },
  handler: async (ctx, args) => {
    // Check if already initialized
    const existingMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingMessages) {
      return { alreadyInitialized: true };
    }

    // Send welcome message from doctor
    await ctx.db.insert("chatMessages", {
      userId: args.userId,
      role: "assistant",
      content: `${args.patientName}, thanks for coming in today. Here's your next step. I'll guide you through everything.`,
      timestamp: Date.now(),
    });

    return { initialized: true };
  },
});

// Update onboarding progress
export const updateOnboardingProgress = mutation({
  args: {
    userId: v.string(),
    currentStep: v.number(),
    completed: v.boolean(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("onboardingProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
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
        userId: args.userId,
        currentStep: args.currentStep,
        completed: args.completed,
        data: args.data,
        lastUpdated: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get onboarding progress
export const getOnboardingProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("onboardingProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return progress || {
      currentStep: 0,
      completed: false,
      data: {},
      lastUpdated: Date.now(),
    };
  },
});

