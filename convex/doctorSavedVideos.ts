import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all saved videos for a doctor
export const getByDoctor = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const savedVideos = await ctx.db
      .query("doctorSavedVideos")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .collect();
    return savedVideos;
  },
});

// Get videos on doctor's public profile
export const getPublicProfile = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const savedVideos = await ctx.db
      .query("doctorSavedVideos")
      .withIndex("by_public_profile", (q) =>
        q.eq("doctorId", args.doctorId).eq("isOnPublicProfile", true)
      )
      .collect();
    return savedVideos;
  },
});

// Check if a video is saved by doctor
export const isVideoSaved = query({
  args: {
    doctorId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("doctorSavedVideos")
      .withIndex("by_doctor_video", (q) =>
        q.eq("doctorId", args.doctorId).eq("videoId", args.videoId)
      )
      .first();
    return saved !== null;
  },
});

// Get saved video record
export const getSavedVideo = query({
  args: {
    doctorId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("doctorSavedVideos")
      .withIndex("by_doctor_video", (q) =>
        q.eq("doctorId", args.doctorId).eq("videoId", args.videoId)
      )
      .first();
    return saved;
  },
});

// Add video to My Videos
export const add = mutation({
  args: {
    doctorId: v.string(),
    videoId: v.string(),
    videoType: v.union(v.literal("template"), v.literal("generated")),
    isOnPublicProfile: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if already saved
    const existing = await ctx.db
      .query("doctorSavedVideos")
      .withIndex("by_doctor_video", (q) =>
        q.eq("doctorId", args.doctorId).eq("videoId", args.videoId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    const savedVideoId = await ctx.db.insert("doctorSavedVideos", {
      doctorId: args.doctorId,
      videoId: args.videoId,
      videoType: args.videoType,
      isOnPublicProfile: args.isOnPublicProfile ?? false,
      addedAt: Date.now(),
    });
    return savedVideoId;
  },
});

// Add multiple videos at once (for onboarding)
export const addMultiple = mutation({
  args: {
    doctorId: v.string(),
    videos: v.array(
      v.object({
        videoId: v.string(),
        videoType: v.union(v.literal("template"), v.literal("generated")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const savedVideoIds = [];
    const timestamp = Date.now();

    for (const video of args.videos) {
      // Check if already saved
      const existing = await ctx.db
        .query("doctorSavedVideos")
        .withIndex("by_doctor_video", (q) =>
          q.eq("doctorId", args.doctorId).eq("videoId", video.videoId)
        )
        .first();

      if (existing) {
        savedVideoIds.push(existing._id);
        continue;
      }

      const savedVideoId = await ctx.db.insert("doctorSavedVideos", {
        doctorId: args.doctorId,
        videoId: video.videoId,
        videoType: video.videoType,
        isOnPublicProfile: false,
        addedAt: timestamp,
      });
      savedVideoIds.push(savedVideoId);
    }

    return savedVideoIds;
  },
});

// Remove video from My Videos
export const remove = mutation({
  args: {
    doctorId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("doctorSavedVideos")
      .withIndex("by_doctor_video", (q) =>
        q.eq("doctorId", args.doctorId).eq("videoId", args.videoId)
      )
      .first();

    if (saved) {
      await ctx.db.delete(saved._id);
    }
  },
});

// Toggle public profile status
export const togglePublicProfile = mutation({
  args: {
    doctorId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("doctorSavedVideos")
      .withIndex("by_doctor_video", (q) =>
        q.eq("doctorId", args.doctorId).eq("videoId", args.videoId)
      )
      .first();

    if (saved) {
      await ctx.db.patch(saved._id, {
        isOnPublicProfile: !saved.isOnPublicProfile,
      });
    }
  },
});

// Update public profile status
export const setPublicProfile = mutation({
  args: {
    savedVideoId: v.id("doctorSavedVideos"),
    isOnPublicProfile: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.savedVideoId, {
      isOnPublicProfile: args.isOnPublicProfile,
    });
  },
});

