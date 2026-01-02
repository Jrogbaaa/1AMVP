import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all reminders for a patient
export const getForPatient = query({
  args: {
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("patientReminders")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();

    // Sort by created date (newest first)
    return reminders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get active (non-completed) reminders for a patient
export const getActiveReminders = query({
  args: {
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("patientReminders")
      .withIndex("by_completed", (q) =>
        q.eq("patientId", args.patientId).eq("isCompleted", false)
      )
      .collect();

    // Sort by due date (soonest first), then by created date
    return reminders.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate - b.dueDate;
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// Get reminders by frequency for a patient
export const getByFrequency = query({
  args: {
    patientId: v.string(),
    frequency: v.union(
      v.literal("one-time"),
      v.literal("daily"),
      v.literal("weekly")
    ),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("patientReminders")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .filter((q) => q.eq(q.field("frequency"), args.frequency))
      .collect();

    return reminders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get all reminders sent by a doctor
export const getByDoctor = query({
  args: {
    doctorId: v.string(),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("patientReminders")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .collect();

    return reminders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get reminders for a specific doctor-patient pair
export const getByDoctorPatient = query({
  args: {
    doctorId: v.string(),
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("patientReminders")
      .withIndex("by_doctor_patient", (q) =>
        q.eq("doctorId", args.doctorId).eq("patientId", args.patientId)
      )
      .collect();

    return reminders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Send a reminder to a patient
export const sendToPatient = mutation({
  args: {
    doctorId: v.string(),
    patientId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(
      v.literal("one-time"),
      v.literal("daily"),
      v.literal("weekly")
    ),
    dueDate: v.optional(v.number()),
    templateId: v.optional(v.id("doctorReminderTemplates")),
  },
  handler: async (ctx, args) => {
    const reminderId = await ctx.db.insert("patientReminders", {
      doctorId: args.doctorId,
      patientId: args.patientId,
      templateId: args.templateId,
      title: args.title,
      description: args.description,
      frequency: args.frequency,
      dueDate: args.dueDate,
      isCompleted: false,
      createdAt: Date.now(),
    });

    // If using a template, increment its usage count
    if (args.templateId) {
      const template = await ctx.db.get(args.templateId);
      if (template) {
        await ctx.db.patch(args.templateId, {
          usageCount: template.usageCount + 1,
          updatedAt: Date.now(),
        });
      }
    }

    return reminderId;
  },
});

// Send reminder to multiple patients at once
export const sendToMultiple = mutation({
  args: {
    doctorId: v.string(),
    patientIds: v.array(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(
      v.literal("one-time"),
      v.literal("daily"),
      v.literal("weekly")
    ),
    dueDate: v.optional(v.number()),
    templateId: v.optional(v.id("doctorReminderTemplates")),
  },
  handler: async (ctx, args) => {
    const reminderIds = [];
    const timestamp = Date.now();

    for (const patientId of args.patientIds) {
      const reminderId = await ctx.db.insert("patientReminders", {
        doctorId: args.doctorId,
        patientId,
        templateId: args.templateId,
        title: args.title,
        description: args.description,
        frequency: args.frequency,
        dueDate: args.dueDate,
        isCompleted: false,
        createdAt: timestamp,
      });
      reminderIds.push(reminderId);
    }

    // If using a template, increment its usage count
    if (args.templateId) {
      const template = await ctx.db.get(args.templateId);
      if (template) {
        await ctx.db.patch(args.templateId, {
          usageCount: template.usageCount + args.patientIds.length,
          updatedAt: Date.now(),
        });
      }
    }

    return reminderIds;
  },
});

// Mark reminder as complete
export const markComplete = mutation({
  args: {
    reminderId: v.id("patientReminders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reminderId, {
      isCompleted: true,
      completedAt: Date.now(),
    });
  },
});

// Mark reminder as incomplete (undo)
export const markIncomplete = mutation({
  args: {
    reminderId: v.id("patientReminders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reminderId, {
      isCompleted: false,
      completedAt: undefined,
    });
  },
});

// Delete a reminder
export const remove = mutation({
  args: {
    reminderId: v.id("patientReminders"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reminderId);
  },
});

// Get completion stats for a patient
export const getCompletionStats = query({
  args: {
    patientId: v.string(),
  },
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query("patientReminders")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();

    const total = reminders.length;
    const completed = reminders.filter((r) => r.isCompleted).length;
    const daily = reminders.filter((r) => r.frequency === "daily").length;
    const weekly = reminders.filter((r) => r.frequency === "weekly").length;
    const oneTime = reminders.filter((r) => r.frequency === "one-time").length;

    return {
      total,
      completed,
      pending: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byFrequency: { daily, weekly, oneTime },
    };
  },
});

