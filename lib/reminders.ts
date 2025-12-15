// Shared reminders data - sourced from My Health section

export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  scoreBoost: number;
  category: "annual" | "today" | "week";
  icon: string;
  actionLabel?: string;
  actionType?: "schedule" | "check" | "calendar";
}

export const ANNUAL_REMINDERS: Reminder[] = [
  {
    id: "annual-physical",
    title: "Annual Physical",
    description: "Schedule your yearly check-up",
    dueDate: "March 2025",
    scoreBoost: 15,
    category: "annual",
    icon: "🩺",
    actionLabel: "Schedule",
    actionType: "schedule",
  },
  {
    id: "cholesterol-screening",
    title: "Cholesterol Screening",
    description: "Blood work to check lipid levels",
    dueDate: "June 2025",
    scoreBoost: 10,
    category: "annual",
    icon: "🔬",
    actionLabel: "Schedule",
    actionType: "schedule",
  },
  {
    id: "flu-vaccination",
    title: "Flu Vaccination",
    description: "Annual flu shot",
    dueDate: "October 2025",
    scoreBoost: 5,
    category: "annual",
    icon: "💉",
    actionLabel: "Schedule",
    actionType: "schedule",
  },
];

export const TODAY_REMINDERS: Reminder[] = [
  {
    id: "med1",
    title: "Take morning medication",
    description: "9:00 AM · Aspirin 81mg",
    scoreBoost: 2,
    category: "today",
    icon: "💊",
    actionType: "check",
  },
  {
    id: "bp",
    title: "Log blood pressure",
    description: "Target: 120/80",
    scoreBoost: 3,
    category: "today",
    icon: "❤️",
    actionType: "check",
  },
  {
    id: "walk",
    title: "30-minute walk",
    description: "Daily activity",
    scoreBoost: 5,
    category: "today",
    icon: "🚶",
    actionType: "check",
  },
];

export const WEEK_REMINDERS: Reminder[] = [
  {
    id: "video",
    title: "Watch educational videos",
    description: "3 videos on heart health",
    scoreBoost: 5,
    category: "week",
    icon: "🎬",
    actionType: "check",
  },
  {
    id: "water",
    title: "Track water intake",
    description: "8 glasses/day for 7 days",
    scoreBoost: 3,
    category: "week",
    icon: "💧",
    actionType: "check",
  },
];

// All reminders combined
export const ALL_REMINDERS = [...ANNUAL_REMINDERS, ...TODAY_REMINDERS, ...WEEK_REMINDERS];

// Score values for action items (used in my-health page)
export const ACTION_SCORES: Record<string, number> = {
  med1: 2,
  bp: 3,
  walk: 5,
  video: 5,
  water: 3,
};

