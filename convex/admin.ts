import { mutation } from "./_generated/server";

/**
 * Clear all user-related data from the database.
 * This is an admin function for resetting the database.
 * 
 * ⚠️ WARNING: This will delete all user data permanently!
 */
export const clearAllUserData = mutation({
  args: {},
  handler: async (ctx) => {
    const results = {
      users: 0,
      doctorProfiles: 0,
      preventiveCareProfiles: 0,
      onboardingProgress: 0,
      chatMessages: 0,
      feedItems: 0,
      userSessions: 0,
      videoEvents: 0,
      generatedVideos: 0,
      videoGenerationJobs: 0,
    };

    // Delete all users
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
      results.users++;
    }

    // Delete all doctor profiles
    const doctorProfiles = await ctx.db.query("doctorProfiles").collect();
    for (const profile of doctorProfiles) {
      await ctx.db.delete(profile._id);
      results.doctorProfiles++;
    }

    // Delete all preventive care profiles
    const preventiveCareProfiles = await ctx.db.query("preventiveCareProfiles").collect();
    for (const profile of preventiveCareProfiles) {
      await ctx.db.delete(profile._id);
      results.preventiveCareProfiles++;
    }

    // Delete all onboarding progress
    const onboardingProgress = await ctx.db.query("onboardingProgress").collect();
    for (const progress of onboardingProgress) {
      await ctx.db.delete(progress._id);
      results.onboardingProgress++;
    }

    // Delete all chat messages
    const chatMessages = await ctx.db.query("chatMessages").collect();
    for (const message of chatMessages) {
      await ctx.db.delete(message._id);
      results.chatMessages++;
    }

    // Delete all feed items
    const feedItems = await ctx.db.query("feedItems").collect();
    for (const item of feedItems) {
      await ctx.db.delete(item._id);
      results.feedItems++;
    }

    // Delete all user sessions
    const userSessions = await ctx.db.query("userSessions").collect();
    for (const session of userSessions) {
      await ctx.db.delete(session._id);
      results.userSessions++;
    }

    // Delete all video events
    const videoEvents = await ctx.db.query("videoEvents").collect();
    for (const event of videoEvents) {
      await ctx.db.delete(event._id);
      results.videoEvents++;
    }

    // Delete all generated videos
    const generatedVideos = await ctx.db.query("generatedVideos").collect();
    for (const video of generatedVideos) {
      await ctx.db.delete(video._id);
      results.generatedVideos++;
    }

    // Delete all video generation jobs
    const videoGenerationJobs = await ctx.db.query("videoGenerationJobs").collect();
    for (const job of videoGenerationJobs) {
      await ctx.db.delete(job._id);
      results.videoGenerationJobs++;
    }

    return {
      success: true,
      message: "All user data cleared",
      deleted: results,
    };
  },
});

