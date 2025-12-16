import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment Configuration
 * 
 * This file uses @t3-oss/env-nextjs to validate environment variables
 * at build time. The app will fail fast if required variables are missing.
 * 
 * Usage:
 *   import { env } from "@/env";
 *   const dbUrl = env.DATABASE_URL;
 */
export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * These are only available on the server and will not be exposed to the client.
   */
  server: {
    // Database (optional in development for preview)
    DATABASE_URL: z
      .string()
      .url()
      .optional()
      .describe("PostgreSQL connection string for Prisma"),

    // NextAuth
    NEXTAUTH_SECRET: z
      .string()
      .min(1)
      .optional()
      .describe("NextAuth.js secret for JWT signing"),

    NEXTAUTH_URL: z
      .string()
      .url()
      .optional()
      .describe("NextAuth.js URL for callbacks"),

    // Convex (existing infrastructure)
    CONVEX_DEPLOYMENT: z
      .string()
      .optional()
      .describe("Convex deployment identifier"),

    // Node environment
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Client-side environment variables schema.
   * These are exposed to the client via the NEXT_PUBLIC_ prefix.
   */
  client: {
    NEXT_PUBLIC_CONVEX_URL: z
      .string()
      .url()
      .optional()
      .describe("Public Convex URL for client-side queries"),
  },

  /**
   * Runtime environment variables.
   * Map environment variables to the schema keys.
   */
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    NODE_ENV: process.env.NODE_ENV,
    // Client
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },

  /**
   * Skip validation in certain environments.
   * Set SKIP_ENV_VALIDATION=true to bypass validation during docker builds, etc.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined.
   * This is useful for optional variables that might be set to empty strings.
   */
  emptyStringAsUndefined: true,
});

// Type export for use throughout the app
export type Env = typeof env;

