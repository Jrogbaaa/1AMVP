import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Auth tables are now managed by NextAuth.js (not Convex)
export default defineSchema({
  // Users table - stores all users (patients, doctors, admins)
  users: defineTable({
    authId: v.string(), // NextAuth user ID (typically email)
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("patient"), v.literal("doctor"), v.literal("admin")),
    healthProvider: v.optional(v.string()), // For patients
    avatarUrl: v.optional(v.string()),
    // Metadata
    lastLoginAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_auth_id", ["authId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // Doctor profiles with HeyGen integration
  doctorProfiles: defineTable({
    doctorId: v.string(), // Auth user ID
    name: v.string(),
    email: v.string(),
    specialty: v.optional(v.string()),
    clinicName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // Health system group (Kaiser, United, etc.)
    healthSystemGroup: v.optional(v.string()),
    // Onboarding status
    onboardingCompleted: v.optional(v.boolean()),
    // HeyGen integration fields
    heygenAvatarId: v.optional(v.string()),
    heygenVoiceId: v.optional(v.string()),
    avatarStatus: v.union(
      v.literal("not_configured"),
      v.literal("pending"),
      v.literal("active"),
      v.literal("error")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_email", ["email"])
    .index("by_health_system", ["healthSystemGroup"]),

  // Video templates (pre-made scripts doctors can clone)
  videoTemplates: defineTable({
    title: v.string(),
    description: v.string(),
    script: v.string(),
    category: v.string(),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    // Source attribution
    createdByDoctorId: v.optional(v.string()), // null for system templates
    isPublic: v.boolean(), // Can other doctors clone this?
    isSystemTemplate: v.boolean(), // Pre-made by 1Another
    // Metrics
    cloneCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_doctor", ["createdByDoctorId"])
    .index("by_public", ["isPublic"])
    .index("by_system", ["isSystemTemplate"]),

  // Generated videos (personalized versions created by doctors)
  generatedVideos: defineTable({
    doctorId: v.string(),
    templateId: v.optional(v.id("videoTemplates")), // Source template if cloned
    title: v.string(),
    description: v.optional(v.string()),
    script: v.string(),
    // HeyGen video details
    heygenVideoId: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
    // Status tracking
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
    // Sharing
    isPublic: v.boolean(), // Share with other doctors to clone
    // Metrics
    viewCount: v.number(),
    sentCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_status", ["status"])
    .index("by_template", ["templateId"])
    .index("by_public", ["isPublic"]),

  // Video generation jobs (tracking async HeyGen API calls)
  videoGenerationJobs: defineTable({
    doctorId: v.string(),
    generatedVideoId: v.id("generatedVideos"),
    // HeyGen job tracking
    heygenJobId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    progress: v.optional(v.number()), // 0-100 percentage
    errorMessage: v.optional(v.string()),
    // Timestamps
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_job", ["heygenJobId"])
    .index("by_video", ["generatedVideoId"])
    .index("by_status", ["status"]),

  // Feed items with real-time updates
  feedItems: defineTable({
    userId: v.string(),
    videoId: v.string(),
    position: v.number(),
    reason: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_position", ["userId", "position"]),

  // Chat messages for onboarding
  chatMessages: defineTable({
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_timestamp", ["userId", "timestamp"]),

  // Session tracking for rate limiting
  userSessions: defineTable({
    userId: v.string(),
    scrollCount: v.number(),
    lastScrollTime: v.number(),
    sessionStart: v.number(),
    isRateLimited: v.boolean(),
  })
    .index("by_user", ["userId"]),

  // Video engagement events (real-time)
  videoEvents: defineTable({
    userId: v.string(),
    videoId: v.string(),
    eventType: v.union(
      v.literal("view"),
      v.literal("play"),
      v.literal("pause"),
      v.literal("complete"),
      v.literal("like"),
      v.literal("save")
    ),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_video", ["videoId"])
    .index("by_user_video", ["userId", "videoId"]),

  // Onboarding progress (real-time)
  onboardingProgress: defineTable({
    userId: v.string(),
    currentStep: v.number(),
    completed: v.boolean(),
    data: v.any(),
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"]),

  // Preventive care profile (health data from onboarding)
  preventiveCareProfiles: defineTable({
    userId: v.string(),
    // Core basics
    dateOfBirth: v.string(),
    sexAtBirth: v.union(v.literal("male"), v.literal("female")),
    anatomyPresent: v.array(v.string()), // ["cervix", "uterus", "prostate"]
    // Pregnancy
    isPregnant: v.optional(v.boolean()),
    weeksPregnant: v.optional(v.number()),
    // Smoking & tobacco
    smokingStatus: v.union(
      v.literal("never"),
      v.literal("former"),
      v.literal("current")
    ),
    smokingYears: v.optional(v.number()),
    packsPerDay: v.optional(v.number()),
    quitYear: v.optional(v.number()),
    // Alcohol
    alcoholFrequency: v.string(), // "never", "rarely", "weekly", "daily"
    drinksPerOccasion: v.optional(v.number()),
    // Sexual health
    sexuallyActive: v.optional(v.boolean()),
    partnersLast12Months: v.optional(v.number()),
    stiHistory: v.optional(v.boolean()),
    hivRisk: v.optional(v.boolean()),
    // Medical conditions
    conditions: v.array(v.string()), // ["diabetes", "hypertension", "high_cholesterol", etc.]
    cancerTypes: v.optional(v.array(v.string())),
    // Family history (first-degree)
    familyHistory: v.array(v.string()), // ["colorectal_cancer", "breast_cancer", etc.]
    // Height & weight
    heightInches: v.number(),
    weightLbs: v.number(),
    // Preventive history (when last done)
    lastBloodPressure: v.optional(v.string()), // "never", "within_1_year", "1_3_years", "over_3_years"
    lastCholesterol: v.optional(v.string()),
    lastDiabetesTest: v.optional(v.string()),
    lastColonoscopy: v.optional(v.string()),
    lastCervicalScreening: v.optional(v.string()),
    lastMammogram: v.optional(v.string()),
    lastHivTest: v.optional(v.string()),
    lastDepressionScreening: v.optional(v.string()),
    // Location & coverage
    zipCode: v.optional(v.string()),
    insurancePlan: v.optional(v.string()),
    // Care logistics
    hasPCP: v.optional(v.boolean()),
    openToTelehealth: v.optional(v.boolean()),
    preferredAppointmentTimes: v.optional(v.array(v.string())),
    // Timestamps
    completedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // Doctor message templates (consistent messages to send)
  doctorMessageTemplates: defineTable({
    doctorId: v.string(),
    title: v.string(), // e.g., "Post-visit follow-up"
    content: v.string(),
    usageCount: v.number(), // Track how often used
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_doctor", ["doctorId"]),

  // Doctor-to-patient messages (one-way text messages from doctor)
  // Note: Patients can ONLY respond via check-in surveys, not free text
  doctorMessages: defineTable({
    doctorId: v.string(),
    patientId: v.string(),
    content: v.string(),
    templateId: v.optional(v.id("doctorMessageTemplates")), // If sent from template
    timestamp: v.number(),
    readAt: v.optional(v.number()),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_patient", ["patientId"])
    .index("by_doctor_patient", ["doctorId", "patientId"])
    .index("by_timestamp", ["timestamp"]),

  // Doctor's saved videos (My Videos)
  doctorSavedVideos: defineTable({
    doctorId: v.string(),
    videoId: v.string(), // Can reference videoTemplates or generatedVideos
    videoType: v.union(v.literal("template"), v.literal("generated")), // Source type
    isOnPublicProfile: v.boolean(), // Show on doctor's public profile
    addedAt: v.number(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_video", ["videoId"])
    .index("by_doctor_video", ["doctorId", "videoId"])
    .index("by_public_profile", ["doctorId", "isOnPublicProfile"]),

  // Videos sent to patients
  videosSentToPatients: defineTable({
    doctorId: v.string(),
    patientId: v.string(),
    videoId: v.string(),
    videoType: v.union(v.literal("template"), v.literal("generated")),
    sentAt: v.number(),
    viewedAt: v.optional(v.number()),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_patient", ["patientId"])
    .index("by_doctor_patient", ["doctorId", "patientId"])
    .index("by_video", ["videoId"]),

  // Patient check-in responses (for tracking survey answers)
  patientCheckInResponses: defineTable({
    doctorId: v.string(),
    patientId: v.string(),
    questionId: v.string(), // Reference to check-in question
    answerId: v.string(), // Selected option
    timestamp: v.number(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_patient", ["patientId"])
    .index("by_doctor_patient", ["doctorId", "patientId"]),

  // Doctor reminder templates (reusable reminders)
  doctorReminderTemplates: defineTable({
    doctorId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(
      v.literal("one-time"),
      v.literal("daily"),
      v.literal("weekly")
    ),
    category: v.optional(v.string()), // "medication", "appointment", "lifestyle", "custom"
    usageCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_category", ["doctorId", "category"]),

  // Reminders sent to patients
  patientReminders: defineTable({
    doctorId: v.string(),
    patientId: v.string(),
    templateId: v.optional(v.id("doctorReminderTemplates")),
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(
      v.literal("one-time"),
      v.literal("daily"),
      v.literal("weekly")
    ),
    dueDate: v.optional(v.number()), // For one-time reminders
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
    readAt: v.optional(v.number()), // When patient viewed the reminder
    createdAt: v.number(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_patient", ["patientId"])
    .index("by_doctor_patient", ["doctorId", "patientId"])
    .index("by_completed", ["patientId", "isCompleted"]),

  // Patient invitations (pending invites before patient creates account)
  patientInvites: defineTable({
    doctorId: v.string(),
    // Contact info
    contactType: v.union(v.literal("email"), v.literal("phone")),
    contactValue: v.string(), // Email or phone number
    // Pre-loaded content to be assigned when patient joins
    preloadedVideoIds: v.optional(v.array(v.string())),
    preloadedCheckinIds: v.optional(v.array(v.string())),
    preloadedReminderIds: v.optional(v.array(v.string())),
    // Status tracking
    status: v.union(
      v.literal("pending"), // Invite sent, waiting for patient
      v.literal("accepted"), // Patient created account
      v.literal("expired") // Invite expired
    ),
    // When accepted, link to patient
    patientId: v.optional(v.string()),
    // Timestamps
    sentAt: v.number(),
    acceptedAt: v.optional(v.number()),
    expiresAt: v.number(), // Auto-expire after X days
  })
    .index("by_doctor", ["doctorId"])
    .index("by_contact", ["contactType", "contactValue"])
    .index("by_status", ["status"]),
});

