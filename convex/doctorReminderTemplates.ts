import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all reminder templates for a doctor
export const getByDoctor = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query("doctorReminderTemplates")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .collect();

    // Sort by usage count (most used first)
    return templates.sort((a, b) => b.usageCount - a.usageCount);
  },
});

// Get templates by category for a doctor
export const getByCategory = query({
  args: {
    doctorId: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query("doctorReminderTemplates")
      .withIndex("by_category", (q) =>
        q.eq("doctorId", args.doctorId).eq("category", args.category)
      )
      .collect();

    return templates.sort((a, b) => b.usageCount - a.usageCount);
  },
});

// Get a single template
export const get = query({
  args: {
    templateId: v.id("doctorReminderTemplates"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.templateId);
  },
});

// Create a new reminder template
export const create = mutation({
  args: {
    doctorId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(
      v.literal("one-time"),
      v.literal("daily"),
      v.literal("weekly")
    ),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const templateId = await ctx.db.insert("doctorReminderTemplates", {
      doctorId: args.doctorId,
      title: args.title,
      description: args.description,
      frequency: args.frequency,
      category: args.category,
      usageCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return templateId;
  },
});

// Create multiple templates at once (for onboarding or bulk import)
export const createMultiple = mutation({
  args: {
    doctorId: v.string(),
    templates: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        frequency: v.union(
          v.literal("one-time"),
          v.literal("daily"),
          v.literal("weekly")
        ),
        category: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const templateIds = [];
    const timestamp = Date.now();

    for (const template of args.templates) {
      const templateId = await ctx.db.insert("doctorReminderTemplates", {
        doctorId: args.doctorId,
        title: template.title,
        description: template.description,
        frequency: template.frequency,
        category: template.category,
        usageCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      templateIds.push(templateId);
    }

    return templateIds;
  },
});

// Update a reminder template
export const update = mutation({
  args: {
    templateId: v.id("doctorReminderTemplates"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    frequency: v.optional(
      v.union(v.literal("one-time"), v.literal("daily"), v.literal("weekly"))
    ),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { templateId, ...updates } = args;
    const cleanUpdates: Record<string, unknown> = { updatedAt: Date.now() };

    if (updates.title !== undefined) cleanUpdates.title = updates.title;
    if (updates.description !== undefined)
      cleanUpdates.description = updates.description;
    if (updates.frequency !== undefined)
      cleanUpdates.frequency = updates.frequency;
    if (updates.category !== undefined) cleanUpdates.category = updates.category;

    await ctx.db.patch(templateId, cleanUpdates);
  },
});

// Delete a reminder template
export const remove = mutation({
  args: {
    templateId: v.id("doctorReminderTemplates"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.templateId);
  },
});

// Increment usage count (called when template is used to send reminder)
export const incrementUsage = mutation({
  args: {
    templateId: v.id("doctorReminderTemplates"),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (template) {
      await ctx.db.patch(args.templateId, {
        usageCount: template.usageCount + 1,
        updatedAt: Date.now(),
      });
    }
  },
});

