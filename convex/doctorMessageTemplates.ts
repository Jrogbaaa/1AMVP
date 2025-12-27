import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all templates for a doctor
export const getByDoctor = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query("doctorMessageTemplates")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .collect();
    
    // Sort by usage count (most used first)
    return templates.sort((a, b) => b.usageCount - a.usageCount);
  },
});

// Get a single template
export const get = query({
  args: {
    templateId: v.id("doctorMessageTemplates"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.templateId);
  },
});

// Create a new template
export const create = mutation({
  args: {
    doctorId: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const templateId = await ctx.db.insert("doctorMessageTemplates", {
      doctorId: args.doctorId,
      title: args.title,
      content: args.content,
      usageCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return templateId;
  },
});

// Create multiple templates at once (for onboarding)
export const createMultiple = mutation({
  args: {
    doctorId: v.string(),
    templates: v.array(
      v.object({
        title: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const templateIds = [];
    const timestamp = Date.now();

    for (const template of args.templates) {
      const templateId = await ctx.db.insert("doctorMessageTemplates", {
        doctorId: args.doctorId,
        title: template.title,
        content: template.content,
        usageCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      templateIds.push(templateId);
    }

    return templateIds;
  },
});

// Update a template
export const update = mutation({
  args: {
    templateId: v.id("doctorMessageTemplates"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { templateId, ...updates } = args;
    await ctx.db.patch(templateId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a template
export const remove = mutation({
  args: {
    templateId: v.id("doctorMessageTemplates"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.templateId);
  },
});

