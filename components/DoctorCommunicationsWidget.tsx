"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Bell,
  ChevronRight,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  X,
  AlertCircle,
  Calendar,
  CalendarPlus,
  Play,
  Video,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  downloadICS,
  createCalendarEventFromReminder,
} from "@/lib/calendar-utils";

// Types
interface DoctorMessage {
  _id: Id<"doctorMessages">;
  doctorId: string;
  patientId: string;
  content: string;
  timestamp: number;
  readAt?: number;
}

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

interface VideoSentToPatient {
  _id: Id<"videosSentToPatients">;
  doctorId: string;
  patientId: string;
  videoId: string;
  videoType: "template" | "generated";
  sentAt: number;
  viewedAt?: number;
  // Extended info from joined data
  title?: string;
  thumbnailUrl?: string;
  duration?: string;
}

type CommunicationItem = 
  | { type: "message"; data: DoctorMessage; timestamp: number }
  | { type: "reminder"; data: PatientReminder; timestamp: number }
  | { type: "video"; data: VideoSentToPatient; timestamp: number };

interface DoctorCommunicationsWidgetProps {
  patientId: string;
  className?: string;
}

// Mock doctor data with real profile photos
const MOCK_DOCTORS: Record<string, { name: string; avatarUrl: string; specialty: string }> = {
  "doctor-1": {
    name: "Sarah Johnson",
    avatarUrl: "/images/doctors/doctor-lisa.jpg",
    specialty: "Cardiology",
  },
  "doctor-2": {
    name: "Michael Chen",
    avatarUrl: "/images/doctors/doctor-ryan.jpg",
    specialty: "Primary Care",
  },
  "550e8400-e29b-41d4-a716-446655440001": {
    name: "Sarah Johnson",
    avatarUrl: "/images/doctors/doctor-lisa.jpg",
    specialty: "Cardiology",
  },
};

// Demo data shown when no real messages/reminders exist
const DEMO_MESSAGES = [
  {
    _id: "demo-msg-1" as Id<"doctorMessages">,
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    patientId: "demo",
    content: "Have you started taking your medicine? Please let me know how you're doing with the new prescription.",
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    readAt: undefined,
  },
];

const DEMO_REMINDERS = [
  {
    _id: "demo-rem-1" as Id<"patientReminders">,
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    patientId: "demo",
    title: "Schedule Colonoscopy",
    description: "Based on your age and family history, it's time to schedule your colonoscopy screening.",
    frequency: "one-time" as const,
    dueDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
    isCompleted: false,
    completedAt: undefined,
    createdAt: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
  },
  {
    _id: "demo-rem-2" as Id<"patientReminders">,
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    patientId: "demo",
    title: "Annual Physical Due",
    description: "Your annual physical exam is coming up. Let's make sure everything is on track.",
    frequency: "one-time" as const,
    dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    isCompleted: false,
    completedAt: undefined,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
  },
];

const DEMO_VIDEOS: VideoSentToPatient[] = [
  {
    _id: "demo-vid-1" as Id<"videosSentToPatients">,
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    patientId: "demo",
    videoId: "v1",
    videoType: "template",
    sentAt: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    viewedAt: undefined,
    title: "Understanding Your Blood Pressure",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=113&fit=crop",
    duration: "5:20",
  },
  {
    _id: "demo-vid-2" as Id<"videosSentToPatients">,
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    patientId: "demo",
    videoId: "v2",
    videoType: "template",
    sentAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    viewedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    title: "Heart Health Basics",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=113&fit=crop",
    duration: "4:15",
  },
];

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
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

// Error fallback component
const ErrorFallback = ({ className }: { className?: string }) => (
  <div className={cn("bg-white rounded-2xl p-4 shadow-sm", className)}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-sky-600" />
        Inbox: Messages from Your Doctors
      </h3>
    </div>
    <div className="text-center py-6">
      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6 text-amber-400" />
      </div>
      <p className="text-gray-500 text-sm">Unable to load communications</p>
      <p className="text-gray-400 text-xs mt-1">Please try again later</p>
    </div>
  </div>
);

// Inner widget component
const DoctorCommunicationsWidgetInner = ({
  patientId,
  className,
}: DoctorCommunicationsWidgetProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Query messages, reminders, and videos
  const messages = useQuery(
    api.doctorMessages.getForPatient,
    patientId ? { patientId } : "skip"
  ) as DoctorMessage[] | undefined;

  const reminders = useQuery(
    api.patientReminders.getActiveReminders,
    patientId ? { patientId } : "skip"
  ) as PatientReminder[] | undefined;

  const videos = useQuery(
    api.videosSentToPatients.getByPatient,
    patientId ? { patientId } : "skip"
  ) as VideoSentToPatient[] | undefined;

  // Mutations
  const markMessageAsRead = useMutation(api.doctorMessages.markAsRead);
  const markReminderComplete = useMutation(api.patientReminders.markComplete);
  const markReminderIncomplete = useMutation(api.patientReminders.markIncomplete);
  const markVideoAsViewed = useMutation(api.videosSentToPatients.markAsViewed);

  // Combine and sort by timestamp
  const combinedItems: CommunicationItem[] = useMemo(() => {
    const items: CommunicationItem[] = [];

    // Use real data if available
    if (messages && messages.length > 0) {
      messages.forEach((msg) => {
        items.push({ type: "message", data: msg, timestamp: msg.timestamp });
      });
    }

    if (reminders && reminders.length > 0) {
      reminders.forEach((rem) => {
        items.push({ type: "reminder", data: rem, timestamp: rem.createdAt });
      });
    }

    if (videos && videos.length > 0) {
      videos.forEach((vid) => {
        items.push({ type: "video", data: vid, timestamp: vid.sentAt });
      });
    }

    // If no real data, use demo data as fallback
    if (items.length === 0) {
      DEMO_MESSAGES.forEach((msg) => {
        items.push({ type: "message", data: msg, timestamp: msg.timestamp });
      });
      DEMO_REMINDERS.forEach((rem) => {
        items.push({ type: "reminder", data: rem, timestamp: rem.createdAt });
      });
      DEMO_VIDEOS.forEach((vid) => {
        items.push({ type: "video", data: vid, timestamp: vid.sentAt });
      });
    }

    // Sort by timestamp descending (most recent first)
    return items.sort((a, b) => b.timestamp - a.timestamp);
  }, [messages, reminders, videos]);

  // Get counts
  const unreadMessageCount = messages?.filter((m) => !m.readAt).length || 0;
  const activeReminderCount = reminders?.filter((r) => !r.isCompleted).length || 0;
  const unwatchedVideoCount = videos?.filter((v) => !v.viewedAt).length || 0;
  const totalCount = unreadMessageCount + activeReminderCount + unwatchedVideoCount;

  const getDoctorInfo = (doctorId: string) => {
    return (
      MOCK_DOCTORS[doctorId] || {
        name: "Your Doctor",
        avatarUrl: "",
        specialty: "Healthcare Provider",
      }
    );
  };

  const handleExpandItem = async (item: CommunicationItem) => {
    const itemId = item.type === "message" ? item.data._id : item.data._id;
    
    if (expandedId === itemId) {
      setExpandedId(null);
    } else {
      setExpandedId(itemId);
      
      // Mark message as read if unread (skip demo messages)
      if (item.type === "message" && !item.data.readAt && !String(item.data._id).startsWith("demo-")) {
        try {
          await markMessageAsRead({ messageId: item.data._id });
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      }
    }
  };

  const handleToggleReminder = async (reminder: PatientReminder, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletingId(reminder._id);
    try {
      if (reminder.isCompleted) {
        await markReminderIncomplete({ reminderId: reminder._id });
      } else {
        await markReminderComplete({ reminderId: reminder._id });
      }
    } catch (error) {
      console.error("Error toggling reminder:", error);
    } finally {
      setCompletingId(null);
    }
  };

  const handleAddToCalendar = (reminder: PatientReminder, e: React.MouseEvent) => {
    e.stopPropagation();
    const event = createCalendarEventFromReminder({
      title: reminder.title,
      description: reminder.description,
      dueDate: reminder.dueDate,
      frequency: reminder.frequency,
      _id: reminder._id,
    });
    downloadICS(event);
  };

  if (combinedItems.length === 0) {
    return (
      <div className={cn("bg-white rounded-2xl p-4 shadow-sm", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-sky-600" />
            Inbox: Messages from Your Doctors
          </h3>
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-sky-400" />
          </div>
          <p className="text-gray-500 text-sm">No messages or reminders</p>
          <p className="text-gray-400 text-xs mt-1">
            Your doctors will send you updates here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-2xl shadow-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-sky-50 to-teal-50 border-b border-sky-100">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-sky-600" />
            Inbox: Messages from Your Doctors
          </h3>
          {totalCount > 0 && (
            <span className="px-2 py-0.5 bg-sky-600 text-white text-xs font-bold rounded-full">
              {totalCount} {totalCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>
      </div>

      {/* Combined List */}
      <div className="divide-y divide-gray-100">
        {combinedItems.slice(0, 5).map((item) => {
          const doctor = getDoctorInfo(item.type === "message" ? item.data.doctorId : item.data.doctorId);
          const itemId = item.data._id;
          const isExpanded = expandedId === itemId;

          if (item.type === "message") {
            const message = item.data;
            const isUnread = !message.readAt;

            return (
              <div key={`msg-${message._id}`}>
                <button
                  onClick={() => handleExpandItem(item)}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-gray-50",
                    isUnread && "bg-sky-50/50"
                  )}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start gap-3">
                    {/* Doctor Avatar with Message Icon - Clickable to profile */}
                    <Link
                      href={`/profile/${message.doctorId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="relative flex-shrink-0 hover:opacity-80 transition-opacity"
                      aria-label={`View Dr. ${doctor.name}'s profile`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-gradient-to-br from-sky-400 to-blue-500">
                        {doctor.avatarUrl ? (
                          <Image
                            src={doctor.avatarUrl}
                            alt={doctor.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {doctor.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center border-2 border-white">
                        <MessageCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                      {isUnread && (
                        <span className="absolute -top-0.5 -left-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className={cn("font-semibold text-sm truncate", isUnread ? "text-gray-900" : "text-gray-700")}>
                          Dr. {doctor.name}
                        </p>
                        <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
                          {message.readAt ? (
                            <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          <span className="text-xs">{formatTimestamp(message.timestamp)}</span>
                        </div>
                      </div>
                      <p className={cn(
                        "text-sm",
                        isExpanded ? "text-gray-700" : "line-clamp-2 text-gray-600"
                      )}>
                        {message.content}
                      </p>
                    </div>

                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </div>
                </button>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="px-4 pb-4 -mt-2">
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-sky-400 to-blue-500">
                            {doctor.avatarUrl ? (
                              <Image
                                src={doctor.avatarUrl}
                                alt={doctor.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {doctor.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Dr. {doctor.name}</p>
                            <p className="text-xs text-gray-500">{doctor.specialty}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                          aria-label="Close message"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      
                      {/* Q&A Response Options */}
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-500 font-medium mb-2">Your response:</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Response: Just started");
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-700 transition-all active:scale-[0.98] border border-emerald-200"
                          aria-label="Just started"
                          tabIndex={0}
                        >
                          <span className="text-lg">🌱</span>
                          <span className="font-medium text-sm">Just started</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Response: In progress");
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl text-amber-700 transition-all active:scale-[0.98] border border-amber-200"
                          aria-label="In progress"
                          tabIndex={0}
                        >
                          <span className="text-lg">⏳</span>
                          <span className="font-medium text-sm">In progress</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Response: Completed cycle");
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 bg-sky-50 hover:bg-sky-100 rounded-xl text-sky-700 transition-all active:scale-[0.98] border border-sky-200"
                          aria-label="Completed cycle"
                          tabIndex={0}
                        >
                          <span className="text-lg">✅</span>
                          <span className="font-medium text-sm">Completed cycle</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sky-200/50">
                        <Check className="w-4 h-4 text-sky-500" />
                        <span className="text-xs text-gray-500">
                          Received {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          if (item.type === "reminder") {
          // Reminder item
          const reminder = item.data;
          const isCompleting = completingId === reminder._id;

          return (
            <div key={`rem-${reminder._id}`}>
              <div
                onClick={() => handleExpandItem(item)}
                onKeyDown={(e) => e.key === 'Enter' && handleExpandItem(item)}
                role="button"
                tabIndex={0}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-gray-50 cursor-pointer",
                  !reminder.isCompleted && "bg-emerald-50/50"
                )}
                aria-expanded={isExpanded}
              >
                <div className="flex items-start gap-3">
                  {/* Doctor Avatar with Check Icon - Clickable to profile */}
                  <Link
                    href={`/profile/${reminder.doctorId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex-shrink-0 hover:opacity-80 transition-opacity"
                    aria-label={`View Dr. ${doctor.name}'s profile`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-gradient-to-br from-emerald-400 to-teal-500">
                      {doctor.avatarUrl ? (
                        <Image
                          src={doctor.avatarUrl}
                          alt={doctor.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {doctor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className={cn(
                        "font-semibold text-sm truncate",
                        reminder.isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                      )}>
                        {reminder.title}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {reminder.frequency === "one-time" && reminder.dueDate && (
                          <span className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            new Date(reminder.dueDate) < new Date()
                              ? "bg-red-100 text-red-600"
                              : "bg-amber-100 text-amber-600"
                          )}>
                            {formatDueDate(reminder.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      From Dr. {doctor.name}
                    </p>
                    {reminder.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {reminder.description}
                      </p>
                    )}
                  </div>

                  {/* Checkbox */}
                  <button
                    onClick={(e) => handleToggleReminder(reminder, e)}
                    disabled={isCompleting}
                    className={cn(
                      "flex-shrink-0 transition-all",
                      isCompleting && "opacity-50"
                    )}
                    aria-label={reminder.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {reminder.isCompleted ? (
                      <CheckCircle2
                        className="w-6 h-6 text-emerald-600"
                        fill="currentColor"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-emerald-500 bg-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded View */}
              {isExpanded && (
                <div className="px-4 pb-4 -mt-2">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
                          {doctor.avatarUrl ? (
                            <Image
                              src={doctor.avatarUrl}
                              alt={doctor.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {doctor.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Dr. {doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.specialty}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedId(null)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                        aria-label="Close reminder"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{reminder.title}</h4>
                    {reminder.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        {reminder.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-emerald-200/50">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          reminder.frequency === "daily" ? "bg-emerald-100 text-emerald-700" :
                          reminder.frequency === "weekly" ? "bg-amber-100 text-amber-700" :
                          "bg-sky-100 text-sky-700"
                        )}>
                          {reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)}
                        </span>
                      </div>
                      {!reminder.isCompleted && (
                        <button
                          onClick={(e) => handleAddToCalendar(reminder, e)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          Add to Calendar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
          }

          // Video item
          if (item.type === "video") {
            const video = item.data;
            const isUnwatched = !video.viewedAt;

            return (
              <div key={`vid-${video._id}`}>
                <button
                  onClick={() => handleExpandItem(item)}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-gray-50",
                    isUnwatched && "bg-violet-50/50"
                  )}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start gap-3">
                    {/* Video Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-200">
                        {video.thumbnailUrl ? (
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title || "Video"}
                            width={64}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-400 to-purple-500">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {video.duration && (
                          <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-black/70 text-white text-[10px] rounded">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Video className="w-2.5 h-2.5 text-white" />
                      </div>
                      {isUnwatched && (
                        <span className="absolute -top-0.5 -left-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className={cn("font-semibold text-sm truncate", isUnwatched ? "text-gray-900" : "text-gray-700")}>
                          {video.title || "Video from your doctor"}
                        </p>
                        <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
                          {video.viewedAt ? (
                            <Eye className="w-3.5 h-3.5 text-violet-500" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          <span className="text-xs">{formatTimestamp(video.sentAt)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        From Dr. {doctor.name}
                      </p>
                      {isUnwatched && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                          <Play className="w-3 h-3" />
                          Watch now
                        </span>
                      )}
                    </div>

                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </div>
                </button>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="px-4 pb-4 -mt-2">
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-purple-500">
                            {doctor.avatarUrl ? (
                              <Image
                                src={doctor.avatarUrl}
                                alt={doctor.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {doctor.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Dr. {doctor.name}</p>
                            <p className="text-xs text-gray-500">{doctor.specialty}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                          aria-label="Close video"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Video Preview */}
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900 mb-3">
                        {video.thumbnailUrl ? (
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title || "Video"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
                            <Video className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <button
                            onClick={async () => {
                              // Mark as viewed and navigate to video
                              try {
                                await markVideoAsViewed({ sentVideoId: video._id });
                              } catch (error) {
                                console.error("Error marking video as viewed:", error);
                              }
                              // TODO: Navigate to video player
                            }}
                            className="w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                            aria-label="Play video"
                          >
                            <Play className="w-6 h-6 text-violet-600 ml-1" fill="currentColor" />
                          </button>
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            {video.duration}
                          </span>
                        )}
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-1">{video.title || "Video from your doctor"}</h4>
                      <div className="flex items-center gap-2 pt-2 border-t border-violet-200/50">
                        {video.viewedAt ? (
                          <>
                            <Eye className="w-4 h-4 text-violet-500" />
                            <span className="text-xs text-gray-500">
                              Watched {formatTimestamp(video.viewedAt)}
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Sent {formatTimestamp(video.sentAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* View All Link */}
      {combinedItems.length > 5 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <Link
            href="/my-health/messages"
            className="flex items-center justify-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            View all {combinedItems.length} items
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

// Error Boundary
class CommunicationsErrorBoundary extends React.Component<
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
    console.error("DoctorCommunicationsWidget error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Exported wrapper component
export const DoctorCommunicationsWidget = ({
  patientId,
  className,
}: DoctorCommunicationsWidgetProps) => {
  return (
    <CommunicationsErrorBoundary fallback={<ErrorFallback className={className} />}>
      <DoctorCommunicationsWidgetInner patientId={patientId} className={className} />
    </CommunicationsErrorBoundary>
  );
};

