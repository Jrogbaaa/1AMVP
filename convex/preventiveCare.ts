import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's preventive care profile
export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("preventiveCareProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    return profile;
  },
});

// Check if user has completed preventive care onboarding
export const hasCompletedOnboarding = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("preventiveCareProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    return !!profile;
  },
});

// Save or update preventive care profile
export const saveProfile = mutation({
  args: {
    userId: v.string(),
    // Core basics
    dateOfBirth: v.string(),
    sexAtBirth: v.union(v.literal("male"), v.literal("female")),
    anatomyPresent: v.array(v.string()),
    // Pregnancy
    isPregnant: v.optional(v.boolean()),
    weeksPregnant: v.optional(v.number()),
    // Smoking & tobacco
    smokingStatus: v.union(
      v.literal("never"),
      v.literal("former"),
      v.literal("current")
    ),
    smokingYears: v.optional(v.number()),
    packsPerDay: v.optional(v.number()),
    quitYear: v.optional(v.number()),
    // Alcohol
    alcoholFrequency: v.string(),
    drinksPerOccasion: v.optional(v.number()),
    // Sexual health
    sexuallyActive: v.optional(v.boolean()),
    partnersLast12Months: v.optional(v.number()),
    stiHistory: v.optional(v.boolean()),
    hivRisk: v.optional(v.boolean()),
    // Medical conditions
    conditions: v.array(v.string()),
    cancerTypes: v.optional(v.array(v.string())),
    // Family history
    familyHistory: v.array(v.string()),
    // Height & weight
    heightInches: v.number(),
    weightLbs: v.number(),
    // Preventive history
    lastBloodPressure: v.optional(v.string()),
    lastCholesterol: v.optional(v.string()),
    lastDiabetesTest: v.optional(v.string()),
    lastColonoscopy: v.optional(v.string()),
    lastCervicalScreening: v.optional(v.string()),
    lastMammogram: v.optional(v.string()),
    lastHivTest: v.optional(v.string()),
    lastDepressionScreening: v.optional(v.string()),
    // Location & coverage
    zipCode: v.optional(v.string()),
    insurancePlan: v.optional(v.string()),
    // Care logistics
    hasPCP: v.optional(v.boolean()),
    openToTelehealth: v.optional(v.boolean()),
    preferredAppointmentTimes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { userId, ...profileData } = args;
    const now = Date.now();

    // Check if profile exists
    const existing = await ctx.db
      .query("preventiveCareProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      // Update existing profile
      await ctx.db.patch(existing._id, {
        ...profileData,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new profile
      const id = await ctx.db.insert("preventiveCareProfiles", {
        userId,
        ...profileData,
        completedAt: now,
        updatedAt: now,
      });
      return id;
    }
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
    const { userId, currentStep, completed, data } = args;
    const now = Date.now();

    const existing = await ctx.db
      .query("onboardingProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        currentStep,
        completed,
        data,
        lastUpdated: now,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("onboardingProgress", {
        userId,
        currentStep,
        completed,
        data,
        lastUpdated: now,
      });
      return id;
    }
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
    return progress;
  },
});

