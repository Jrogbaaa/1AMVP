"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UserSyncResult {
  isSynced: boolean;
  isSyncing: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: "patient" | "doctor" | "admin";
    healthProvider?: string;
    avatarUrl?: string;
    doctorProfile?: {
      specialty?: string;
      clinicName?: string;
      avatarUrl?: string;
      heygenAvatarId?: string;
      heygenVoiceId?: string;
      avatarStatus: "not_configured" | "pending" | "active" | "error";
    };
    preventiveCareProfile?: {
      dateOfBirth: string;
      sexAtBirth: "male" | "female";
      conditions: string[];
    };
  } | null;
  syncUser: () => Promise<void>;
  error: string | null;
}

/**
 * Hook to sync the current user to Convex and get their full profile.
 * 
 * This hook:
 * 1. Checks if the user is authenticated via NextAuth
 * 2. Creates/updates the user in Convex on first access
 * 3. Returns the user's full profile including role-specific data
 * 
 * Usage:
 * ```tsx
 * const { user, isSynced, isSyncing } = useUserSync();
 * 
 * if (isSyncing) return <Loading />;
 * if (!user) return <LoginPrompt />;
 * 
 * // Use user data
 * console.log(user.role, user.doctorProfile?.specialty);
 * ```
 */
export const useUserSync = (): UserSyncResult => {
  const { data: session, status } = useSession();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSyncedRef = useRef(false);

  // Get user ID (email is used as ID for Credentials provider)
  const authId = session?.user?.id || session?.user?.email || "";

  // Query user profile from Convex
  const userProfile = useQuery(
    api.users.getFullProfile,
    authId ? { authId } : "skip"
  );

  // Mutation to upsert user
  const upsertUser = useMutation(api.users.upsertOnLogin);

  // Sync user to Convex
  const syncUser = useCallback(async () => {
    if (!session?.user?.email || isSyncing) return;

    setIsSyncing(true);
    setError(null);

    try {
      await upsertUser({
        authId: session.user.id || session.user.email,
        email: session.user.email,
        name: session.user.name || session.user.email.split("@")[0],
        role: session.user.role || "patient",
        healthProvider: session.user.healthProvider,
      });
      hasSyncedRef.current = true;
    } catch (err) {
      console.error("Failed to sync user:", err);
      setError(err instanceof Error ? err.message : "Failed to sync user");
    } finally {
      setIsSyncing(false);
    }
  }, [session, isSyncing, upsertUser]);

  // Auto-sync on first authenticated session
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.email &&
      !hasSyncedRef.current &&
      !userProfile &&
      !isSyncing
    ) {
      syncUser();
    }
  }, [status, session, userProfile, isSyncing, syncUser]);

  // Build user object from session and Convex data
  const user = session?.user
    ? {
        id: authId,
        email: session.user.email || "",
        name: userProfile?.name || session.user.name || "",
        role: (userProfile?.role || session.user.role || "patient") as "patient" | "doctor" | "admin",
        healthProvider: userProfile?.healthProvider || session.user.healthProvider,
        avatarUrl: userProfile?.avatarUrl,
        doctorProfile: (userProfile as unknown as { doctorProfile?: UserSyncResult["user"] extends { doctorProfile?: infer T } ? T : never })?.doctorProfile,
        preventiveCareProfile: (userProfile as unknown as { preventiveCareProfile?: UserSyncResult["user"] extends { preventiveCareProfile?: infer T } ? T : never })?.preventiveCareProfile,
      }
    : null;

  return {
    isSynced: hasSyncedRef.current || !!userProfile,
    isSyncing: isSyncing || status === "loading",
    user,
    syncUser,
    error,
  };
};

export default useUserSync;

