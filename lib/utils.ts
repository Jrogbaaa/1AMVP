import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get color class based on health score
 */
export function getHealthScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-[#00BFA6]";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

/**
 * Get motivational message based on health score
 */
export function getHealthScoreMessage(score: number): string {
  if (score >= 100) return "Perfect! 🎉";
  if (score >= 80) return "Excellent!";
  if (score >= 60) return "Great progress!";
  if (score >= 40) return "Keep it up!";
  if (score >= 20) return "Getting started";
  return "Let's begin!";
}
