"use client";

import { useState, useEffect, useCallback } from "react";

// Engagement thresholds for showing auth prompt
const ENGAGEMENT_THRESHOLDS = {
  // Minimum videos to watch before showing auth prompt
  MIN_VIDEOS_WATCHED: 1,
  // Minimum seconds of video watched
  MIN_WATCH_TIME_SECONDS: 30,
  // Minimum interactions (likes, shares attempts, etc.)
  MIN_INTERACTIONS: 1,
};

export interface EngagementData {
  videosWatched: string[];
  videosCompleted: string[];
  totalWatchTimeSeconds: number;
  interactions: number;
  firstVideoWatchedAt: string | null;
  lastActivityAt: string | null;
  hasEarnedTrust: boolean;
  authPromptShown: boolean;
  authPromptDismissedAt: string | null;
}

const STORAGE_KEY = "1a_engagement";

const DEFAULT_ENGAGEMENT: EngagementData = {
  videosWatched: [],
  videosCompleted: [],
  totalWatchTimeSeconds: 0,
  interactions: 0,
  firstVideoWatchedAt: null,
  lastActivityAt: null,
  hasEarnedTrust: false,
  authPromptShown: false,
  authPromptDismissedAt: null,
};

const getStoredEngagement = (): EngagementData => {
  if (typeof window === "undefined") return DEFAULT_ENGAGEMENT;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_ENGAGEMENT, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_ENGAGEMENT;
};

const saveEngagement = (data: EngagementData): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};

// Calculate if user has earned trust based on engagement
const calculateHasEarnedTrust = (data: EngagementData): boolean => {
  const hasWatchedEnoughVideos =
    data.videosWatched.length >= ENGAGEMENT_THRESHOLDS.MIN_VIDEOS_WATCHED;
  const hasWatchedEnoughTime =
    data.totalWatchTimeSeconds >= ENGAGEMENT_THRESHOLDS.MIN_WATCH_TIME_SECONDS;
  const hasEnoughInteractions =
    data.interactions >= ENGAGEMENT_THRESHOLDS.MIN_INTERACTIONS;

  // User earns trust by watching at least one video OR having meaningful watch time OR interacting
  return hasWatchedEnoughVideos || hasWatchedEnoughTime || hasEnoughInteractions;
};

export const useEngagement = () => {
  const [engagement, setEngagement] = useState<EngagementData>(DEFAULT_ENGAGEMENT);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load engagement data on mount
  useEffect(() => {
    const stored = getStoredEngagement();
    setEngagement(stored);
    setIsLoaded(true);
  }, []);

  // Update engagement data helper
  const updateEngagement = useCallback((updates: Partial<EngagementData>) => {
    setEngagement((prev) => {
      const updated = { ...prev, ...updates, lastActivityAt: new Date().toISOString() };
      updated.hasEarnedTrust = calculateHasEarnedTrust(updated);
      saveEngagement(updated);
      return updated;
    });
  }, []);

  // Track video view (when video starts playing)
  const trackVideoView = useCallback(
    (videoId: string) => {
      setEngagement((prev) => {
        if (prev.videosWatched.includes(videoId)) return prev;

        const updated = {
          ...prev,
          videosWatched: [...prev.videosWatched, videoId],
          firstVideoWatchedAt: prev.firstVideoWatchedAt || new Date().toISOString(),
          lastActivityAt: new Date().toISOString(),
        };
        updated.hasEarnedTrust = calculateHasEarnedTrust(updated);
        saveEngagement(updated);
        return updated;
      });
    },
    []
  );

  // Track video completion
  const trackVideoComplete = useCallback(
    (videoId: string) => {
      setEngagement((prev) => {
        if (prev.videosCompleted.includes(videoId)) return prev;

        const updated = {
          ...prev,
          videosCompleted: [...prev.videosCompleted, videoId],
          lastActivityAt: new Date().toISOString(),
        };
        updated.hasEarnedTrust = calculateHasEarnedTrust(updated);
        saveEngagement(updated);
        return updated;
      });
    },
    []
  );

  // Track watch time (call this periodically while video is playing)
  const trackWatchTime = useCallback(
    (seconds: number) => {
      setEngagement((prev) => {
        const updated = {
          ...prev,
          totalWatchTimeSeconds: prev.totalWatchTimeSeconds + seconds,
          lastActivityAt: new Date().toISOString(),
        };
        updated.hasEarnedTrust = calculateHasEarnedTrust(updated);
        saveEngagement(updated);
        return updated;
      });
    },
    []
  );

  // Track an interaction (like, share, save attempt, etc.)
  const trackInteraction = useCallback(() => {
    setEngagement((prev) => {
      const updated = {
        ...prev,
        interactions: prev.interactions + 1,
        lastActivityAt: new Date().toISOString(),
      };
      updated.hasEarnedTrust = calculateHasEarnedTrust(updated);
      saveEngagement(updated);
      return updated;
    });
  }, []);

  // Mark auth prompt as shown
  const markAuthPromptShown = useCallback(() => {
    updateEngagement({ authPromptShown: true });
  }, [updateEngagement]);

  // Mark auth prompt as dismissed
  const markAuthPromptDismissed = useCallback(() => {
    updateEngagement({
      authPromptDismissedAt: new Date().toISOString(),
    });
  }, [updateEngagement]);

  // Should we show the auth prompt?
  const shouldShowAuthPrompt = useCallback((): boolean => {
    // Don't show if not yet earned trust
    if (!engagement.hasEarnedTrust) return false;

    // Don't show if they dismissed it recently (within 24 hours)
    if (engagement.authPromptDismissedAt) {
      const dismissedAt = new Date(engagement.authPromptDismissedAt);
      const hoursSinceDismissed =
        (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) return false;
    }

    return true;
  }, [engagement.hasEarnedTrust, engagement.authPromptDismissedAt]);

  // Reset engagement (useful for testing)
  const resetEngagement = useCallback(() => {
    setEngagement(DEFAULT_ENGAGEMENT);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    engagement,
    isLoaded,
    trackVideoView,
    trackVideoComplete,
    trackWatchTime,
    trackInteraction,
    markAuthPromptShown,
    markAuthPromptDismissed,
    shouldShowAuthPrompt,
    resetEngagement,
    hasEarnedTrust: engagement.hasEarnedTrust,
  };
};

export default useEngagement;
