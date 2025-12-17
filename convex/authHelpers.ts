import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * User identity from auth context
 */
export interface UserIdentity {
  subject: string; // User ID
  email?: string;
  name?: string;
  role?: "patient" | "doctor" | "admin";
}

/**
 * Get the authenticated user's identity from the Convex context
 * Returns null if not authenticated
 */
export const getUserIdentity = async (
  ctx: QueryCtx | MutationCtx
): Promise<UserIdentity | null> => {
  const identity = await ctx.auth.getUserIdentity();
  
  if (!identity) {
    return null;
  }

  return {
    subject: identity.subject,
    email: identity.email,
    name: identity.name,
    role: identity.role as UserIdentity["role"],
  };
};

/**
 * Get the authenticated user ID from the Convex context
 * Returns null if not authenticated
 */
export const getAuthUserId = async (
  ctx: QueryCtx | MutationCtx
): Promise<string | null> => {
  const identity = await getUserIdentity(ctx);
  return identity?.subject ?? null;
};

/**
 * Require authentication - throws if not authenticated
 * Use this at the start of mutations/queries that require auth
 */
export const requireAuth = async (
  ctx: QueryCtx | MutationCtx
): Promise<UserIdentity> => {
  const identity = await getUserIdentity(ctx);
  
  if (!identity) {
    throw new Error("Unauthorized: Authentication required");
  }

  return identity;
};

/**
 * Require a specific role - throws if user doesn't have required role
 * Use this for role-based access control
 */
export const requireRole = async (
  ctx: QueryCtx | MutationCtx,
  allowedRoles: Array<"patient" | "doctor" | "admin">
): Promise<UserIdentity> => {
  const identity = await requireAuth(ctx);

  if (!identity.role || !allowedRoles.includes(identity.role)) {
    throw new Error(
      `Forbidden: Requires one of roles: ${allowedRoles.join(", ")}`
    );
  }

  return identity;
};

/**
 * Get user ID with fallback for anonymous users
 * Returns the authenticated user's ID, or a provided fallback, or "anonymous"
 * 
 * This is useful for gradual auth migration where some features
 * work for anonymous users but benefit from authentication
 */
export const getUserIdOrFallback = async (
  ctx: QueryCtx | MutationCtx,
  fallbackUserId?: string
): Promise<string> => {
  const authUserId = await getAuthUserId(ctx);
  return authUserId ?? fallbackUserId ?? "anonymous";
};

