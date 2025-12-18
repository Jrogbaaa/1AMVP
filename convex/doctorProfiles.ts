import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get doctor profile by doctor ID
 */
export const getByDoctorId = query({
  args: { doctorId: v.string() },
  handler: async (ctx, { doctorId }) => {
    return await ctx.db
      .query("doctorProfiles")
      .withIndex("by_doctor", (q) => q.eq("doctorId", doctorId))
      .first();
  },
});

/**
 * Get doctor profile by email
 */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("doctorProfiles")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

/**
 * Create a new doctor profile
 */
export const create = mutation({
  args: {
    doctorId: v.string(),
    name: v.string(),
    email: v.string(),
    specialty: v.optional(v.string()),
    clinicName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if profile already exists
    const existing = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .first();

    if (existing) {
      throw new Error("Doctor profile already exists");
    }

    return await ctx.db.insert("doctorProfiles", {
      ...args,
      heygenAvatarId: undefined,
      heygenVoiceId: undefined,
      avatarStatus: "not_configured",
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update doctor profile
 */
export const update = mutation({
  args: {
    doctorId: v.string(),
    name: v.optional(v.string()),
    specialty: v.optional(v.string()),
    clinicName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, { doctorId, ...updates }) => {
    const profile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_doctor", (q) => q.eq("doctorId", doctorId))
      .first();

    if (!profile) {
      throw new Error("Doctor profile not found");
    }

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(profile._id, {
      ...cleanUpdates,
      updatedAt: Date.now(),
    });

    return profile._id;
  },
});

/**
 * Update HeyGen credentials
 */
export const updateHeygenCredentials = mutation({
  args: {
    doctorId: v.string(),
    heygenAvatarId: v.string(),
    heygenVoiceId: v.string(),
  },
  handler: async (ctx, { doctorId, heygenAvatarId, heygenVoiceId }) => {
    const profile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_doctor", (q) => q.eq("doctorId", doctorId))
      .first();

    if (!profile) {
      throw new Error("Doctor profile not found");
    }

    await ctx.db.patch(profile._id, {
      heygenAvatarId,
      heygenVoiceId,
      avatarStatus: "active",
      updatedAt: Date.now(),
    });

    return profile._id;
  },
});

/**
 * Update avatar status
 */
export const updateAvatarStatus = mutation({
  args: {
    doctorId: v.string(),
    avatarStatus: v.union(
      v.literal("not_configured"),
      v.literal("pending"),
      v.literal("active"),
      v.literal("error")
    ),
  },
  handler: async (ctx, { doctorId, avatarStatus }) => {
    const profile = await ctx.db
      .query("doctorProfiles")
      .withIndex("by_doctor", (q) => q.eq("doctorId", doctorId))
      .first();

    if (!profile) {
      throw new Error("Doctor profile not found");
    }

    await ctx.db.patch(profile._id, {
      avatarStatus,
      updatedAt: Date.now(),
    });

    return profile._id;
  },
});

