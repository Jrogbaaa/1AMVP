import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get template by ID
 */
export const getById = query({
  args: { id: v.id("videoTemplates") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * Get all system templates
 */
export const getSystemTemplates = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    let query = ctx.db
      .query("videoTemplates")
      .withIndex("by_system", (q) => q.eq("isSystemTemplate", true));

    if (category) {
      query = query.filter((q) => q.eq(q.field("category"), category));
    }

    return await query.order("desc").collect();
  },
});

/**
 * Get templates created by a specific doctor
 */
export const getByDoctorId = query({
  args: { doctorId: v.string() },
  handler: async (ctx, { doctorId }) => {
    return await ctx.db
      .query("videoTemplates")
      .withIndex("by_doctor", (q) => q.eq("createdByDoctorId", doctorId))
      .order("desc")
      .collect();
  },
});

/**
 * Get public templates (available for cloning)
 */
export const getPublicTemplates = query({
  args: { 
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { category, limit = 50 }) => {
    let query = ctx.db
      .query("videoTemplates")
      .withIndex("by_public", (q) => q.eq("isPublic", true));

    if (category) {
      query = query.filter((q) => q.eq(q.field("category"), category));
    }

    return await query.order("desc").take(limit);
  },
});

/**
 * Get templates by category
 */
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    return await ctx.db
      .query("videoTemplates")
      .withIndex("by_category", (q) => q.eq("category", category))
      .order("desc")
      .collect();
  },
});

/**
 * Create a new template
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    script: v.string(),
    category: v.string(),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    createdByDoctorId: v.optional(v.string()),
    isPublic: v.boolean(),
    isSystemTemplate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("videoTemplates", {
      ...args,
      cloneCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update a template
 */
export const update = mutation({
  args: {
    id: v.id("videoTemplates"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    script: v.optional(v.string()),
    category: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...cleanUpdates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Increment clone count when a template is cloned
 */
export const incrementCloneCount = mutation({
  args: { id: v.id("videoTemplates") },
  handler: async (ctx, { id }) => {
    const template = await ctx.db.get(id);
    if (!template) return;
    
    await ctx.db.patch(id, {
      cloneCount: template.cloneCount + 1,
    });
  },
});

/**
 * Delete a template
 */
export const deleteTemplate = mutation({
  args: { id: v.id("videoTemplates") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

