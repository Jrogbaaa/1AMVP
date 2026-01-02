"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  ChevronRight,
  Check,
  CheckCheck,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DoctorMessage {
  _id: Id<"doctorMessages">;
  doctorId: string;
  patientId: string;
  content: string;
  timestamp: number;
  readAt?: number;
}

interface DoctorMessagesWidgetProps {
  patientId: string;
  className?: string;
}

// Mock doctor data - in production this would come from a query
const MOCK_DOCTORS: Record<string, { name: string; avatarUrl: string; specialty: string }> = {
  "doctor-1": {
    name: "Sarah Johnson",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    specialty: "Cardiology",
  },
  "doctor-2": {
    name: "Michael Chen",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    specialty: "Primary Care",
  },
};

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

export const DoctorMessagesWidget = ({
  patientId,
  className,
}: DoctorMessagesWidgetProps) => {
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  // Query messages for this patient
  const messages = useQuery(
    api.doctorMessages.getForPatient,
    patientId ? { patientId } : "skip"
  ) as DoctorMessage[] | undefined;

  const markAsRead = useMutation(api.doctorMessages.markAsRead);

  // Get unread count
  const unreadCount = messages?.filter((m) => !m.readAt).length || 0;

  // Get the 3 most recent messages
  const recentMessages = messages?.slice(0, 3) || [];

  const handleExpandMessage = async (message: DoctorMessage) => {
    if (expandedMessageId === message._id) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(message._id);
      // Mark as read if unread
      if (!message.readAt) {
        try {
          await markAsRead({ messageId: message._id });
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      }
    }
  };

  const handleCloseExpanded = () => {
    setExpandedMessageId(null);
  };

  const getDoctorInfo = (doctorId: string) => {
    return (
      MOCK_DOCTORS[doctorId] || {
        name: "Your Doctor",
        avatarUrl: "",
        specialty: "Healthcare Provider",
      }
    );
  };

  if (!messages || messages.length === 0) {
    return (
      <div className={cn("bg-white rounded-2xl p-4 shadow-sm", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-sky-600" />
            Messages from Doctors
          </h3>
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-sky-400" />
          </div>
          <p className="text-gray-500 text-sm">No messages yet</p>
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
      <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-sky-600" />
            Messages from Doctors
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-sky-600 text-white text-xs font-bold rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-gray-100">
        {recentMessages.map((message) => {
          const doctor = getDoctorInfo(message.doctorId);
          const isUnread = !message.readAt;
          const isExpanded = expandedMessageId === message._id;

          return (
            <div key={message._id}>
              <button
                onClick={() => handleExpandMessage(message)}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-gray-50",
                  isUnread && "bg-sky-50/50"
                )}
                aria-expanded={isExpanded}
              >
                <div className="flex items-start gap-3">
                  {/* Doctor Avatar */}
                  <div className="relative flex-shrink-0">
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
                    {isUnread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-sky-500 rounded-full border-2 border-white" />
                    )}
                  </div>

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

                  {/* Expand indicator */}
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-gray-400 flex-shrink-0 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>
              </button>

              {/* Expanded Message View */}
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
                        onClick={handleCloseExpanded}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                        aria-label="Close message"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
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
        })}
      </div>

      {/* View All Link */}
      {messages.length > 3 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <Link
            href="/my-health/messages"
            className="flex items-center justify-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            View all {messages.length} messages
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

