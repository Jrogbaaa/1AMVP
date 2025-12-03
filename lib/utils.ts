import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const calculateHealthScore = (metrics: {
  watchedDoctorVideo: boolean;
  completedOnboarding: boolean;
  completedNextSteps: boolean;
  submittedCalendarRequest: boolean;
  watchedEducationalVideos: number;
}): number => {
  let score = 0;

  // Doctor video (30%)
  if (metrics.watchedDoctorVideo) score += 30;

  // Onboarding (25%)
  if (metrics.completedOnboarding) score += 25;

  // Next steps (20%)
  if (metrics.completedNextSteps) score += 20;

  // Calendar request (15%)
  if (metrics.submittedCalendarRequest) score += 15;

  // Educational videos (10% - max 5 videos, 2% each)
  const videoScore = Math.min(metrics.watchedEducationalVideos * 2, 10);
  score += videoScore;

  return Math.min(score, 100);
};

export const getHealthScoreColor = (score: number): string => {
  if (score >= 70) return "text-green-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
};

export const getHealthScoreMessage = (score: number): string => {
  if (score >= 70) return "Great progress!";
  if (score >= 40) return "Keep it up!";
  return "Critical follow-ups needed";
};

export const extractMagicLinkParams = (url: string): {
  patientId?: string;
  doctorId?: string;
} => {
  try {
    const urlObj = new URL(url);
    const patientId = urlObj.searchParams.get("p") || undefined;
    const doctorId = urlObj.searchParams.get("d") || undefined;
    return { patientId, doctorId };
  } catch {
    return {};
  }
};

export const generateMagicLink = (
  patientId: string,
  doctorId: string,
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
): string => {
  return `${baseUrl}/feed?p=${patientId}&d=${doctorId}`;
};

