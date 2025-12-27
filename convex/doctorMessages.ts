import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all messages for a specific patient from a doctor
export const getByPatient = query({
  args: {
    doctorId: v.string(),
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("doctorMessages")
      .withIndex("by_doctor_patient", (q) =>
        q.eq("doctorId", args.doctorId).eq("patientId", args.patientId)
      )
      .order("desc")
      .collect();
    return messages;
  },
});

// Get all messages sent by a doctor
export const getByDoctor = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("doctorMessages")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .order("desc")
      .collect();
    return messages;
  },
});

// Get all messages for a patient (for patient view)
export const getForPatient = query({
  args: {
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("doctorMessages")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
    return messages;
  },
});

// Get unread message count for a patient
export const getUnreadCount = query({
  args: {
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("doctorMessages")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
    
    return messages.filter((m) => !m.readAt).length;
  },
});

// Send a message to a patient (one-way from doctor)
export const send = mutation({
  args: {
    doctorId: v.string(),
    patientId: v.string(),
    content: v.string(),
    templateId: v.optional(v.id("doctorMessageTemplates")),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("doctorMessages", {
      doctorId: args.doctorId,
      patientId: args.patientId,
      content: args.content,
      templateId: args.templateId,
      timestamp: Date.now(),
    });

    // If using a template, increment usage count
    if (args.templateId) {
      const template = await ctx.db.get(args.templateId);
      if (template) {
        await ctx.db.patch(args.templateId, {
          usageCount: template.usageCount + 1,
          updatedAt: Date.now(),
        });
      }
    }

    return messageId;
  },
});

// Send message to multiple patients at once (mass send)
export const sendToMultiple = mutation({
  args: {
    doctorId: v.string(),
    patientIds: v.array(v.string()),
    content: v.string(),
    templateId: v.optional(v.id("doctorMessageTemplates")),
  },
  handler: async (ctx, args) => {
    const messageIds = [];
    const timestamp = Date.now();

    for (const patientId of args.patientIds) {
      const messageId = await ctx.db.insert("doctorMessages", {
        doctorId: args.doctorId,
        patientId,
        content: args.content,
        templateId: args.templateId,
        timestamp,
      });
      messageIds.push(messageId);
    }

    // If using a template, increment usage count
    if (args.templateId) {
      const template = await ctx.db.get(args.templateId);
      if (template) {
        await ctx.db.patch(args.templateId, {
          usageCount: template.usageCount + args.patientIds.length,
          updatedAt: Date.now(),
        });
      }
    }

    return messageIds;
  },
});

// Mark message as read
export const markAsRead = mutation({
  args: {
    messageId: v.id("doctorMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      readAt: Date.now(),
    });
  },
});

// Mark all messages as read for a patient
export const markAllAsRead = mutation({
  args: {
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("doctorMessages")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();

    const timestamp = Date.now();
    for (const message of messages) {
      if (!message.readAt) {
        await ctx.db.patch(message._id, { readAt: timestamp });
      }
    }
  },
});

// Delete a message
export const remove = mutation({
  args: {
    messageId: v.id("doctorMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});

