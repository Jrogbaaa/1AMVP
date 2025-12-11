"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Play,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Calendar,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for dashboard
const DASHBOARD_STATS = [
  {
    label: "Total Patients",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: <Users className="w-6 h-6" />,
    color: "bg-sky-500",
  },
  {
    label: "Videos Watched",
    value: "1,842",
    change: "+24%",
    trend: "up",
    icon: <Play className="w-6 h-6" />,
    color: "bg-emerald-500",
  },
  {
    label: "Completion Rate",
    value: "78%",
    change: "+5%",
    trend: "up",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "bg-violet-500",
  },
  {
    label: "Avg. Watch Time",
    value: "4:32",
    change: "+18%",
    trend: "up",
    icon: <Clock className="w-6 h-6" />,
    color: "bg-amber-500",
  },
];

const RECENT_PATIENTS = [
  {
    id: "1",
    name: "Dave Thompson",
    email: "dave.t@email.com",
    lastActivity: "2 minutes ago",
    videosWatched: 8,
    totalVideos: 10,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    lastActivity: "1 hour ago",
    videosWatched: 5,
    totalVideos: 10,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@email.com",
    lastActivity: "3 hours ago",
    videosWatched: 10,
    totalVideos: 10,
    status: "completed",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    lastActivity: "Yesterday",
    videosWatched: 3,
    totalVideos: 10,
    status: "inactive",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "j.wilson@email.com",
    lastActivity: "2 days ago",
    videosWatched: 7,
    totalVideos: 10,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
];

const RECENT_MESSAGES = [
  {
    id: "1",
    patientName: "Dave Thompson",
    message: "Thank you for the follow-up video, Dr. Ellis! I have a question about my medication schedule...",
    time: "5 min ago",
    unread: true,
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    patientName: "Sarah Mitchell",
    message: "I watched the blood pressure video. Very informative! When should I start monitoring daily?",
    time: "2 hours ago",
    unread: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    patientName: "Michael Chen",
    message: "All done with the recommended videos. Feeling much more informed about my condition.",
    time: "Yesterday",
    unread: false,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];

const POPULAR_CHAPTERS = [
  { id: "1", title: "Heart Health Basics", views: 456, completionRate: 85 },
  { id: "2", title: "Blood Pressure Management", views: 389, completionRate: 78 },
  { id: "3", title: "Diet & Nutrition", views: 312, completionRate: 72 },
];

export default function DoctorDashboard() {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">("week");

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, Dr. Ellis 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your patients today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(["week", "month", "year"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  timeFilter === filter
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          <Link
            href="/doctor/send"
            className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors"
          >
            Send Content
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_STATS.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "p-3 rounded-xl text-white",
                  stat.color
                )}
              >
                {stat.icon}
              </div>
              <span
                className={cn(
                  "text-sm font-medium px-2 py-1 rounded-full",
                  stat.trend === "up"
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-red-700 bg-red-50"
                )}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Patient Activity
              </h2>
              <p className="text-sm text-gray-500">Video engagement tracking</p>
            </div>
            <Link
              href="/doctor/patients"
              className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {RECENT_PATIENTS.map((patient) => (
              <div
                key={patient.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                    <Image
                      src={patient.avatarUrl}
                      alt={patient.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {patient.name}
                      </p>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full",
                          patient.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : patient.status === "active"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {patient.status === "completed"
                          ? "Completed"
                          : patient.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{patient.lastActivity}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            patient.videosWatched === patient.totalVideos
                              ? "bg-emerald-500"
                              : "bg-sky-500"
                          )}
                          style={{
                            width: `${(patient.videosWatched / patient.totalVideos) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                        {patient.videosWatched}/{patient.totalVideos}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Videos watched</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500">Patient inquiries</p>
            </div>
            <Link
              href="/doctor/messages"
              className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {RECENT_MESSAGES.map((message) => (
              <Link
                key={message.id}
                href={`/doctor/messages?patient=${message.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={message.avatarUrl}
                        alt={message.patientName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {message.unread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-sky-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm truncate",
                          message.unread
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-700"
                        )}
                      >
                        {message.patientName}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {message.time}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm mt-1 line-clamp-2",
                        message.unread ? "text-gray-700" : "text-gray-500"
                      )}
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <Link
              href="/doctor/messages"
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              View All Messages
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Chapters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Popular Chapters
            </h2>
            <p className="text-sm text-gray-500">Most viewed content this {timeFilter}</p>
          </div>
          <Link
            href="/doctor/chapters"
            className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Manage Library
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {POPULAR_CHAPTERS.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/doctor/chapters#${chapter.id}`}
              className="p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-100 text-sky-600 font-bold text-lg group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-sky-600 transition-colors">
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{chapter.views} views</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Activity className="w-4 h-4" />
                      <span>{chapter.completionRate}% completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/doctor/send"
          className="flex items-center gap-4 p-4 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <Play className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">Send Videos</p>
            <p className="text-sm text-sky-100">To patients</p>
          </div>
        </Link>

        <Link
          href="/doctor/patients"
          className="flex items-center gap-4 p-4 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">Manage Patients</p>
            <p className="text-sm text-emerald-100">View all</p>
          </div>
        </Link>

        <Link
          href="/doctor/chapters"
          className="flex items-center gap-4 p-4 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">Video Library</p>
            <p className="text-sm text-violet-100">10 chapters</p>
          </div>
        </Link>

        <Link
          href="/doctor/messages"
          className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">Messages</p>
            <p className="text-sm text-amber-100">5 unread</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
