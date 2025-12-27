import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all videos sent to a specific patient
export const getByPatient = query({
  args: {
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videosSentToPatients")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
    return videos;
  },
});

// Get all videos sent by a doctor
export const getByDoctor = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videosSentToPatients")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .order("desc")
      .collect();
    return videos;
  },
});

// Get videos sent to a patient by a specific doctor
export const getByDoctorPatient = query({
  args: {
    doctorId: v.string(),
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videosSentToPatients")
      .withIndex("by_doctor_patient", (q) =>
        q.eq("doctorId", args.doctorId).eq("patientId", args.patientId)
      )
      .order("desc")
      .collect();
    return videos;
  },
});

// Get unwatched video count for a patient
export const getUnwatchedCount = query({
  args: {
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videosSentToPatients")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
    
    return videos.filter((v) => !v.viewedAt).length;
  },
});

// Send a video to a patient
export const send = mutation({
  args: {
    doctorId: v.string(),
    patientId: v.string(),
    videoId: v.string(),
    videoType: v.union(v.literal("template"), v.literal("generated")),
  },
  handler: async (ctx, args) => {
    const sentVideoId = await ctx.db.insert("videosSentToPatients", {
      doctorId: args.doctorId,
      patientId: args.patientId,
      videoId: args.videoId,
      videoType: args.videoType,
      sentAt: Date.now(),
    });
    return sentVideoId;
  },
});

// Send video to multiple patients at once
export const sendToMultiple = mutation({
  args: {
    doctorId: v.string(),
    patientIds: v.array(v.string()),
    videoId: v.string(),
    videoType: v.union(v.literal("template"), v.literal("generated")),
  },
  handler: async (ctx, args) => {
    const sentVideoIds = [];
    const timestamp = Date.now();

    for (const patientId of args.patientIds) {
      const sentVideoId = await ctx.db.insert("videosSentToPatients", {
        doctorId: args.doctorId,
        patientId,
        videoId: args.videoId,
        videoType: args.videoType,
        sentAt: timestamp,
      });
      sentVideoIds.push(sentVideoId);
    }

    return sentVideoIds;
  },
});

// Mark video as viewed
export const markAsViewed = mutation({
  args: {
    sentVideoId: v.id("videosSentToPatients"),
  },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.sentVideoId);
    if (video && !video.viewedAt) {
      await ctx.db.patch(args.sentVideoId, {
        viewedAt: Date.now(),
      });
    }
  },
});

// Mark video as viewed by video ID (for patient-side tracking)
export const markVideoAsViewed = mutation({
  args: {
    patientId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const sentVideo = await ctx.db
      .query("videosSentToPatients")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .first();

    if (sentVideo && !sentVideo.viewedAt) {
      await ctx.db.patch(sentVideo._id, {
        viewedAt: Date.now(),
      });
    }
  },
});

// Delete a sent video record
export const remove = mutation({
  args: {
    sentVideoId: v.id("videosSentToPatients"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sentVideoId);
  },
});

// Get video engagement stats for a doctor
export const getEngagementStats = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videosSentToPatients")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .collect();

    const totalSent = videos.length;
    const totalViewed = videos.filter((v) => v.viewedAt).length;
    const viewRate = totalSent > 0 ? (totalViewed / totalSent) * 100 : 0;

    return {
      totalSent,
      totalViewed,
      viewRate: Math.round(viewRate),
    };
  },
});

