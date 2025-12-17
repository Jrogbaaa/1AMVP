"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { ReactNode, useCallback, useMemo } from "react";

// Only create Convex client if URL is provided (handles CI/build without env vars)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

/**
 * Custom hook that provides auth info to Convex
 * This allows Convex functions to verify the user's identity server-side
 */
const useAuthFromNextAuth = () => {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Fetch token for Convex authentication
  // In a production setup, you'd want to use a proper JWT that Convex can verify
  // For now, we'll pass user info that Convex can use to identify the user
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!isAuthenticated || !session?.user) {
        return null;
      }

      // Return a token-like structure with user info
      // Convex will use this to identify the user in ctx.auth.getUserIdentity()
      // In production, you'd want a proper signed JWT here
      const tokenData = {
        sub: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      };

      // Encode as base64 for transport (not secure, but functional for MVP)
      // In production, use a proper JWT signed with a shared secret
      return btoa(JSON.stringify(tokenData));
    },
    [isAuthenticated, session]
  );

  return useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      fetchAccessToken,
    }),
    [isLoading, isAuthenticated, fetchAccessToken]
  );
};

/**
 * Inner provider that uses the session context
 */
const ConvexProviderWithSession = ({ children }: { children: ReactNode }) => {
  const authInfo = useAuthFromNextAuth();

  if (!convex) {
    return <>{children}</>;
  }

  return (
    <ConvexProviderWithAuth client={convex} useAuth={() => authInfo}>
      {children}
    </ConvexProviderWithAuth>
  );
};

/**
 * Main provider component that wraps the app with both NextAuth and Convex
 * 
 * This setup:
 * 1. Provides NextAuth session context
 * 2. Passes auth info to Convex for server-side verification
 * 3. Allows Convex functions to use ctx.auth.getUserIdentity()
 */
export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  // If no Convex client (missing URL), just provide session without Convex
  if (!convex) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <ConvexProviderWithSession>{children}</ConvexProviderWithSession>
    </SessionProvider>
  );
};
