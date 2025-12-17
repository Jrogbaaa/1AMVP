import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/auth";

/**
 * Auth helper types
 */
export interface AuthenticatedUser {
  id: string;
  email: string | null | undefined;
  name: string | null | undefined;
  role: UserRole;
  healthProvider?: string;
}

export interface AuthResult {
  user: AuthenticatedUser;
  isAuthenticated: true;
}

export interface UnauthenticatedResult {
  user: null;
  isAuthenticated: false;
}

/**
 * Get current session (does not throw)
 * Use this when you want to check auth status without redirecting
 */
export const getSession = async () => {
  const session = await auth();
  return session;
};

/**
 * Get authenticated user or null
 * Use this when authentication is optional
 */
export const getUser = async (): Promise<AuthenticatedUser | null> => {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role || "patient",
    healthProvider: session.user.healthProvider,
  };
};

/**
 * Require authentication - redirects to auth page if not authenticated
 * Use this in Server Components or Server Actions that require auth
 * 
 * @param redirectTo - Optional custom redirect path (default: /auth)
 */
export const requireAuth = async (redirectTo?: string): Promise<AuthenticatedUser> => {
  const user = await getUser();

  if (!user) {
    redirect(redirectTo || "/auth");
  }

  return user;
};

/**
 * Require specific role(s) - redirects if user doesn't have required role
 * Use this for role-based access control in Server Components or Server Actions
 * 
 * @param allowedRoles - Array of roles that are allowed
 * @param redirectTo - Optional custom redirect path for unauthorized users (default: /feed)
 */
export const requireRole = async (
  allowedRoles: UserRole[],
  redirectTo?: string
): Promise<AuthenticatedUser> => {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized users (they are authenticated but wrong role)
    redirect(redirectTo || "/feed?error=unauthorized");
  }

  return user;
};

/**
 * Check if user has a specific role (without redirecting)
 * Use this when you need to conditionally render based on role
 */
export const hasRole = async (allowedRoles: UserRole[]): Promise<boolean> => {
  const user = await getUser();
  
  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role);
};

/**
 * Check if user is authenticated (without redirecting)
 * Use this when you need to conditionally render based on auth status
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getUser();
  return user !== null;
};

/**
 * Get user ID or throw if not authenticated
 * Use this when you need just the user ID and want to fail fast
 */
export const requireUserId = async (): Promise<string> => {
  const user = await requireAuth();
  return user.id;
};

/**
 * Convenience function for doctor-only routes
 */
export const requireDoctor = async (): Promise<AuthenticatedUser> => {
  return requireRole(["doctor", "admin"]);
};

/**
 * Convenience function for admin-only routes
 */
export const requireAdmin = async (): Promise<AuthenticatedUser> => {
  return requireRole(["admin"]);
};

