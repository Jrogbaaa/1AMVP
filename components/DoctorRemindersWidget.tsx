"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Clock,
  RefreshCw,
  ChevronRight,
  CalendarPlus,
  Pill,
  Activity,
  Heart,
  Download,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  downloadICS,
  createCalendarEventFromReminder,
} from "@/lib/calendar-utils";

interface PatientReminder {
  _id: Id<"patientReminders">;
  doctorId: string;
  patientId: string;
  title: string;
  description?: string;
  frequency: "one-time" | "daily" | "weekly";
  dueDate?: number;
  isCompleted: boolean;
  completedAt?: number;
  createdAt: number;
}

interface DoctorRemindersWidgetProps {
  patientId: string;
  className?: string;
}

// Mock doctor data
const MOCK_DOCTORS: Record<string, { name: string; avatarUrl: string }> = {
  "doctor-1": {
    name: "Sarah Johnson",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
  },
  "doctor-2": {
    name: "Michael Chen",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
  },
};

const getCategoryIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("medication") || lowerTitle.includes("pill") || lowerTitle.includes("medicine")) {
    return <Pill className="w-4 h-4" />;
  }
  if (lowerTitle.includes("walk") || lowerTitle.includes("exercise") || lowerTitle.includes("activity")) {
    return <Activity className="w-4 h-4" />;
  }
  if (lowerTitle.includes("appointment") || lowerTitle.includes("schedule") || lowerTitle.includes("visit")) {
    return <Calendar className="w-4 h-4" />;
  }
  return <Heart className="w-4 h-4" />;
};

const getCategoryColor = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("medication") || lowerTitle.includes("pill") || lowerTitle.includes("medicine")) {
    return "bg-blue-100 text-blue-600";
  }
  if (lowerTitle.includes("walk") || lowerTitle.includes("exercise") || lowerTitle.includes("activity")) {
    return "bg-green-100 text-green-600";
  }
  if (lowerTitle.includes("appointment") || lowerTitle.includes("schedule") || lowerTitle.includes("visit")) {
    return "bg-purple-100 text-purple-600";
  }
  return "bg-rose-100 text-rose-600";
};

const getFrequencyInfo = (frequency: PatientReminder["frequency"]) => {
  switch (frequency) {
    case "daily":
      return {
        label: "Daily",
        icon: <RefreshCw className="w-3 h-3" />,
        color: "bg-emerald-100 text-emerald-700",
      };
    case "weekly":
      return {
        label: "Weekly",
        icon: <Calendar className="w-3 h-3" />,
        color: "bg-amber-100 text-amber-700",
      };
    case "one-time":
      return {
        label: "One-time",
        icon: <Clock className="w-3 h-3" />,
        color: "bg-sky-100 text-sky-700",
      };
  }
};

const formatDueDate = (dueDate: number): string => {
  const date = new Date(dueDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays < 7) return `Due in ${diffDays} days`;
  if (diffDays < 30) return `Due in ${Math.ceil(diffDays / 7)} weeks`;
  return date.toLocaleDateString();
};

// Error fallback component for the widget
const RemindersErrorFallback = ({ className }: { className?: string }) => (
  <div className={cn("bg-white rounded-2xl p-4 shadow-sm", className)}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
        <Bell className="w-5 h-5 text-emerald-600" />
        Reminders from Your Doctor
      </h3>
    </div>
    <div className="text-center py-6">
      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 text-amber-400" />
      </div>
      <p className="text-gray-500 text-sm">Unable to load reminders</p>
      <p className="text-gray-400 text-xs mt-1">
        Please try again later
      </p>
    </div>
  </div>
);

// Inner widget component that handles the query
const DoctorRemindersWidgetInner = ({
  patientId,
  className,
}: DoctorRemindersWidgetProps) => {
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Query active reminders
  const reminders = useQuery(
    api.patientReminders.getActiveReminders,
    patientId ? { patientId } : "skip"
  ) as PatientReminder[] | undefined;

  const markComplete = useMutation(api.patientReminders.markComplete);
  const markIncomplete = useMutation(api.patientReminders.markIncomplete);

  // Group reminders by frequency
  const dailyReminders = reminders?.filter((r) => r.frequency === "daily") || [];
  const weeklyReminders = reminders?.filter((r) => r.frequency === "weekly") || [];
  const oneTimeReminders = reminders?.filter((r) => r.frequency === "one-time") || [];

  const handleToggleComplete = async (reminder: PatientReminder) => {
    setCompletingId(reminder._id);
    try {
      if (reminder.isCompleted) {
        await markIncomplete({ reminderId: reminder._id });
      } else {
        await markComplete({ reminderId: reminder._id });
      }
    } catch (error) {
      console.error("Error toggling reminder:", error);
    } finally {
      setCompletingId(null);
    }
  };

  const handleAddToCalendar = (reminder: PatientReminder) => {
    const event = createCalendarEventFromReminder({
      title: reminder.title,
      description: reminder.description,
      dueDate: reminder.dueDate,
      frequency: reminder.frequency,
      _id: reminder._id,
    });
    downloadICS(event);
  };

  const getDoctorInfo = (doctorId: string) => {
    return MOCK_DOCTORS[doctorId] || { name: "Your Doctor", avatarUrl: "" };
  };

  if (!reminders || reminders.length === 0) {
    return (
      <div className={cn("bg-white rounded-2xl p-4 shadow-sm", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            Reminders from Your Doctor
          </h3>
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-gray-500 text-sm">No active reminders</p>
          <p className="text-gray-400 text-xs mt-1">
            Your doctor will assign reminders here
          </p>
        </div>
      </div>
    );
  }

  const ReminderItem = ({ reminder }: { reminder: PatientReminder }) => {
    const doctor = getDoctorInfo(reminder.doctorId);
    const frequencyInfo = getFrequencyInfo(reminder.frequency);
    const isCompleting = completingId === reminder._id;

    return (
      <div
        className={cn(
          "p-3 rounded-xl transition-all",
          reminder.isCompleted
            ? "bg-gray-50 opacity-60"
            : "bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-gray-200"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => handleToggleComplete(reminder)}
            disabled={isCompleting}
            className={cn(
              "flex-shrink-0 mt-0.5 transition-all",
              isCompleting && "opacity-50"
            )}
            aria-label={reminder.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {reminder.isCompleted ? (
              <CheckCircle2
                className="w-5 h-5 text-emerald-600 animate-check-complete"
                fill="currentColor"
              />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-emerald-500 bg-white transition-colors" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={cn("p-1 rounded-md", getCategoryColor(reminder.title))}>
                {getCategoryIcon(reminder.title)}
              </span>
              <h4
                className={cn(
                  "font-semibold text-sm",
                  reminder.isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                )}
              >
                {reminder.title}
              </h4>
              <span
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
                  frequencyInfo.color
                )}
              >
                {frequencyInfo.icon}
                {frequencyInfo.label}
              </span>
            </div>

            {reminder.description && (
              <p className="text-gray-500 text-xs mb-2">{reminder.description}</p>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Doctor attribution */}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-gradient-to-br from-sky-400 to-blue-500">
                    {doctor.avatarUrl ? (
                      <Image
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white font-bold text-[8px]">
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">Dr. {doctor.name}</span>
                </div>

                {/* Due date for one-time */}
                {reminder.frequency === "one-time" && reminder.dueDate && (
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      new Date(reminder.dueDate) < new Date()
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                    )}
                  >
                    {formatDueDate(reminder.dueDate)}
                  </span>
                )}
              </div>

              {/* Add to Calendar */}
              {!reminder.isCompleted && (
                <button
                  onClick={() => handleAddToCalendar(reminder)}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                  aria-label="Add to calendar"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add to Calendar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("bg-white rounded-2xl shadow-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            Reminders from Your Doctor
          </h3>
          <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
            {reminders.filter((r) => !r.isCompleted).length} active
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Daily Reminders */}
        {dailyReminders.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-semibold text-gray-700">Daily</h4>
              <span className="text-xs text-gray-400">
                ({dailyReminders.filter((r) => !r.isCompleted).length}/{dailyReminders.length})
              </span>
            </div>
            <div className="space-y-2">
              {dailyReminders.map((reminder) => (
                <ReminderItem key={reminder._id} reminder={reminder} />
              ))}
            </div>
          </div>
        )}

        {/* Weekly Reminders */}
        {weeklyReminders.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-gray-700">Weekly</h4>
              <span className="text-xs text-gray-400">
                ({weeklyReminders.filter((r) => !r.isCompleted).length}/{weeklyReminders.length})
              </span>
            </div>
            <div className="space-y-2">
              {weeklyReminders.map((reminder) => (
                <ReminderItem key={reminder._id} reminder={reminder} />
              ))}
            </div>
          </div>
        )}

        {/* One-time Reminders */}
        {oneTimeReminders.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <h4 className="text-sm font-semibold text-gray-700">One-time Tasks</h4>
              <span className="text-xs text-gray-400">
                ({oneTimeReminders.filter((r) => !r.isCompleted).length}/{oneTimeReminders.length})
              </span>
            </div>
            <div className="space-y-2">
              {oneTimeReminders.map((reminder) => (
                <ReminderItem key={reminder._id} reminder={reminder} />
              ))}
            </div>
          </div>
        )}

        {/* Download All Button */}
        <button
          onClick={() => {
            reminders
              .filter((r) => !r.isCompleted)
              .forEach((reminder) => handleAddToCalendar(reminder));
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-50 to-sky-50 text-emerald-700 font-medium rounded-xl hover:from-emerald-100 hover:to-sky-100 transition-colors border border-emerald-200"
        >
          <Download className="w-4 h-4" />
          Add All to Calendar
        </button>
      </div>

      {/* View All Link */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <Link
          href="/my-health/reminders"
          className="flex items-center justify-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          View all reminders
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

// Error Boundary class component for catching render errors
class RemindersErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("DoctorRemindersWidget error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Exported wrapper component with error boundary
export const DoctorRemindersWidget = ({
  patientId,
  className,
}: DoctorRemindersWidgetProps) => {
  return (
    <RemindersErrorBoundary fallback={<RemindersErrorFallback className={className} />}>
      <DoctorRemindersWidgetInner patientId={patientId} className={className} />
    </RemindersErrorBoundary>
  );
};

