import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Get generated video by ID
 */
export const getById = query({
  args: { id: v.id("generatedVideos") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * Get all generated videos for a doctor
 */
export const getByDoctorId = query({
  args: { doctorId: v.string() },
  handler: async (ctx, { doctorId }) => {
    return await ctx.db
      .query("generatedVideos")
      .withIndex("by_doctor", (q) => q.eq("doctorId", doctorId))
      .order("desc")
      .collect();
  },
});

/**
 * Get public videos for discovery feed
 */
export const getPublicVideos = query({
  args: { 
    limit: v.optional(v.number()),
    excludeDoctorId: v.optional(v.string()),
  },
  handler: async (ctx, { limit = 50, excludeDoctorId }) => {
    const videos = await ctx.db
      .query("generatedVideos")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .order("desc")
      .take(limit);

    // Filter out the requesting doctor's own videos
    if (excludeDoctorId) {
      return videos.filter((v) => v.doctorId !== excludeDoctorId);
    }

    return videos;
  },
});

/**
 * Get videos by status
 */
export const getByStatus = query({
  args: { 
    doctorId: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, { doctorId, status }) => {
    return await ctx.db
      .query("generatedVideos")
      .withIndex("by_doctor", (q) => q.eq("doctorId", doctorId))
      .filter((q) => q.eq(q.field("status"), status))
      .order("desc")
      .collect();
  },
});

/**
 * Create a new generated video record
 */
export const create = mutation({
  args: {
    doctorId: v.string(),
    templateId: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    script: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("generatedVideos", {
      doctorId: args.doctorId,
      templateId: args.templateId ? (args.templateId as Id<"videoTemplates">) : undefined,
      title: args.title,
      description: args.description,
      script: args.script,
      heygenVideoId: undefined,
      videoUrl: undefined,
      thumbnailUrl: undefined,
      duration: undefined,
      status: args.status,
      errorMessage: undefined,
      isPublic: args.isPublic,
      viewCount: 0,
      sentCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update HeyGen video ID
 */
export const updateHeygenId = mutation({
  args: {
    id: v.id("generatedVideos"),
    heygenVideoId: v.string(),
  },
  handler: async (ctx, { id, heygenVideoId }) => {
    await ctx.db.patch(id, {
      heygenVideoId,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Update video status and details after generation completes
 */
export const updateAfterGeneration = mutation({
  args: {
    id: v.id("generatedVideos"),
    status: v.union(
      v.literal("completed"),
      v.literal("failed")
    ),
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Toggle public visibility
 */
export const togglePublic = mutation({
  args: {
    id: v.id("generatedVideos"),
    isPublic: v.boolean(),
  },
  handler: async (ctx, { id, isPublic }) => {
    await ctx.db.patch(id, {
      isPublic,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Increment view count
 */
export const incrementViewCount = mutation({
  args: { id: v.id("generatedVideos") },
  handler: async (ctx, { id }) => {
    const video = await ctx.db.get(id);
    if (!video) return;
    
    await ctx.db.patch(id, {
      viewCount: video.viewCount + 1,
    });
  },
});

/**
 * Increment sent count
 */
export const incrementSentCount = mutation({
  args: { id: v.id("generatedVideos") },
  handler: async (ctx, { id }) => {
    const video = await ctx.db.get(id);
    if (!video) return;
    
    await ctx.db.patch(id, {
      sentCount: video.sentCount + 1,
    });
  },
});

/**
 * Delete a generated video
 */
export const deleteVideo = mutation({
  args: { id: v.id("generatedVideos") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

