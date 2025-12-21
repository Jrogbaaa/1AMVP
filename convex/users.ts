import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get user by auth ID (typically email for NextAuth Credentials)
 */
export const getByAuthId = query({
  args: { authId: v.string() },
  handler: async (ctx, { authId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", authId))
      .first();
  },
});

/**
 * Get user by email
 */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();
  },
});

/**
 * Create or update user on login (upsert)
 * This is called when a user signs in via NextAuth
 */
export const upsertOnLogin = mutation({
  args: {
    authId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("patient"), v.literal("doctor"), v.literal("admin")),
    healthProvider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const emailLower = args.email.toLowerCase();

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", args.authId))
      .first();

    if (existingUser) {
      // Update existing user (update login time and any changed fields)
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: emailLower,
        role: args.role,
        healthProvider: args.healthProvider,
        lastLoginAt: now,
        updatedAt: now,
      });
      return { userId: existingUser._id, isNewUser: false };
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      authId: args.authId,
      email: emailLower,
      name: args.name,
      role: args.role,
      healthProvider: args.healthProvider,
      avatarUrl: undefined,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    });

    // If this is a doctor, also create their doctor profile
    if (args.role === "doctor") {
      // Check if doctor profile already exists
      const existingProfile = await ctx.db
        .query("doctorProfiles")
        .withIndex("by_doctor", (q) => q.eq("doctorId", args.authId))
        .first();

      if (!existingProfile) {
        await ctx.db.insert("doctorProfiles", {
          doctorId: args.authId,
          name: args.name,
          email: emailLower,
          specialty: undefined,
          clinicName: undefined,
          avatarUrl: undefined,
          heygenAvatarId: undefined,
          heygenVoiceId: undefined,
          avatarStatus: "not_configured",
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    return { userId, isNewUser: true };
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    authId: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    healthProvider: v.optional(v.string()),
  },
  handler: async (ctx, { authId, ...updates }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", authId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(user._id, {
      ...cleanUpdates,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

/**
 * Get all doctors (for admin view or doctor discovery)
 */
export const getDoctors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "doctor"))
      .collect();
  },
});

/**
 * Get user with their related profile data
 */
export const getFullProfile = query({
  args: { authId: v.string() },
  handler: async (ctx, { authId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_id", (q) => q.eq("authId", authId))
      .first();

    if (!user) {
      return null;
    }

    // Get role-specific profile data
    if (user.role === "doctor") {
      const doctorProfile = await ctx.db
        .query("doctorProfiles")
        .withIndex("by_doctor", (q) => q.eq("doctorId", authId))
        .first();

      return { ...user, doctorProfile };
    }

    if (user.role === "patient") {
      const preventiveCareProfile = await ctx.db
        .query("preventiveCareProfiles")
        .withIndex("by_user", (q) => q.eq("userId", authId))
        .first();

      return { ...user, preventiveCareProfile };
    }

    return user;
  },
});

