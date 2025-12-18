import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get job by HeyGen job ID
 */
export const getByHeygenJobId = query({
  args: { heygenJobId: v.string() },
  handler: async (ctx, { heygenJobId }) => {
    return await ctx.db
      .query("videoGenerationJobs")
      .withIndex("by_job", (q) => q.eq("heygenJobId", heygenJobId))
      .first();
  },
});

/**
 * Get jobs for a doctor
 */
export const getByDoctorId = query({
  args: { doctorId: v.string() },
  handler: async (ctx, { doctorId }) => {
    return await ctx.db
      .query("videoGenerationJobs")
      .withIndex("by_doctor", (q) => q.eq("doctorId", doctorId))
      .order("desc")
      .collect();
  },
});

/**
 * Get pending/processing jobs
 */
export const getPendingJobs = query({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("videoGenerationJobs")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    
    const processing = await ctx.db
      .query("videoGenerationJobs")
      .withIndex("by_status", (q) => q.eq("status", "processing"))
      .collect();

    return [...pending, ...processing];
  },
});

/**
 * Create a new generation job
 */
export const create = mutation({
  args: {
    doctorId: v.string(),
    generatedVideoId: v.id("generatedVideos"),
    heygenJobId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("videoGenerationJobs", {
      doctorId: args.doctorId,
      generatedVideoId: args.generatedVideoId,
      heygenJobId: args.heygenJobId,
      status: args.status,
      progress: 0,
      errorMessage: undefined,
      startedAt: Date.now(),
      completedAt: undefined,
    });
  },
});

/**
 * Update job status
 */
export const updateStatus = mutation({
  args: {
    heygenJobId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    progress: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, { heygenJobId, status, progress, errorMessage }) => {
    const job = await ctx.db
      .query("videoGenerationJobs")
      .withIndex("by_job", (q) => q.eq("heygenJobId", heygenJobId))
      .first();

    if (!job) {
      throw new Error(`Job not found: ${heygenJobId}`);
    }

    const updates: Record<string, unknown> = { status };
    
    if (progress !== undefined) {
      updates.progress = progress;
    }
    
    if (errorMessage !== undefined) {
      updates.errorMessage = errorMessage;
    }
    
    if (status === "completed" || status === "failed") {
      updates.completedAt = Date.now();
    }

    await ctx.db.patch(job._id, updates);
    
    return job._id;
  },
});

/**
 * Get job by generated video ID
 */
export const getByVideoId = query({
  args: { generatedVideoId: v.id("generatedVideos") },
  handler: async (ctx, { generatedVideoId }) => {
    return await ctx.db
      .query("videoGenerationJobs")
      .withIndex("by_video", (q) => q.eq("generatedVideoId", generatedVideoId))
      .first();
  },
});

