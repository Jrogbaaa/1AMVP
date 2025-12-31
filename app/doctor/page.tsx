"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserSync } from "@/hooks/useUserSync";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Users,
  Play,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Activity,
  Sparkles,
  Video,
  ExternalLink,
  Wand2,
  UserCircle,
  Film,
  Plus,
  Heart,
  Send,
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Search,
  MoreVertical,
  Bookmark,
  BookmarkCheck,
  Globe,
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
    hasNewActivity: true,
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
    lastMessage: {
      type: "from_patient" as const,
      content: "Thank you for the follow-up video! I have a question about my medication...",
      time: "2 min ago",
      isUnread: true,
    },
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    lastActivity: "1 hour ago",
    videosWatched: 5,
    totalVideos: 10,
    status: "active",
    hasNewActivity: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    lastMessage: {
      type: "to_patient" as const,
      content: "Great progress on the videos! Let me know if you have any questions.",
      time: "1 hour ago",
      isUnread: false,
    },
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "m.chen@email.com",
    lastActivity: "3 hours ago",
    videosWatched: 10,
    totalVideos: 10,
    status: "completed",
    hasNewActivity: false,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    lastMessage: {
      type: "check_in" as const,
      content: "Feeling good today 🙂",
      time: "3 hours ago",
      isUnread: false,
    },
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    lastActivity: "Yesterday",
    videosWatched: 3,
    totalVideos: 10,
    status: "inactive",
    hasNewActivity: false,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    lastMessage: {
      type: "to_patient" as const,
      content: "Hi Emily, just checking in - how are you feeling this week?",
      time: "Yesterday",
      isUnread: false,
    },
  },
  {
    id: "5",
    name: "James Wilson",
    email: "j.wilson@email.com",
    lastActivity: "2 days ago",
    videosWatched: 7,
    totalVideos: 10,
    status: "active",
    hasNewActivity: false,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    lastMessage: {
      type: "check_in" as const,
      content: "Took all my medications ✅",
      time: "2 days ago",
      isUnread: false,
    },
  },
];

// Mock My Videos data
const MY_VIDEOS = [
  {
    id: "mv-1",
    title: "Welcome to Your Heart Health Journey",
    description: "Introduction video for new patients",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop",
    duration: "3:45",
    views: 234,
    isOnPublicProfile: true,
    addedAt: "Dec 20, 2024",
  },
  {
    id: "mv-2",
    title: "Understanding Blood Pressure",
    description: "What your numbers mean and how to improve them",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
    duration: "5:20",
    views: 189,
    isOnPublicProfile: true,
    addedAt: "Dec 18, 2024",
  },
  {
    id: "mv-3",
    title: "Medication Guide",
    description: "How to take your heart medications properly",
    thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=225&fit=crop",
    duration: "4:15",
    views: 156,
    isOnPublicProfile: false,
    addedAt: "Dec 15, 2024",
  },
];

// Mock 1A Video Library
const BROWSE_1A_VIDEOS = [
  {
    id: "1a-1",
    title: "Heart Health Basics",
    description: "Essential information about cardiovascular health",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=225&fit=crop",
    duration: "4:32",
    category: "Foundation",
    isAdded: false,
  },
  {
    id: "1a-2",
    title: "Managing Stress for Heart Health",
    description: "Evidence-based techniques for stress management",
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
    duration: "5:30",
    category: "Lifestyle",
    isAdded: true,
  },
  {
    id: "1a-3",
    title: "Sodium and Your Heart",
    description: "How sodium affects your cardiovascular system",
    thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
    duration: "4:50",
    category: "Nutrition",
    isAdded: false,
  },
  {
    id: "1a-4",
    title: "Exercise After a Heart Event",
    description: "Safe ways to return to physical activity",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
    duration: "6:45",
    category: "Recovery",
    isAdded: true,
  },
  {
    id: "1a-5",
    title: "Understanding Cholesterol Numbers",
    description: "What your cholesterol test results mean",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop",
    duration: "4:15",
    category: "Education",
    isAdded: false,
  },
  {
    id: "1a-6",
    title: "Living with Atrial Fibrillation",
    description: "Managing AFib in your daily life",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop",
    duration: "7:20",
    category: "Conditions",
    isAdded: false,
  },
];

export default function DoctorDashboard() {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedVideos, setAddedVideos] = useState<Set<string>>(new Set(["1a-2", "1a-4"]));
  const { user } = useUserSync();
  
  // Get doctor's videos from Convex
  const doctorVideos = useQuery(
    api.generatedVideos.getByDoctorId,
    user?.id ? { doctorId: user.id } : "skip"
  );

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get doctor's display name
  const doctorName = user?.name
    ? `Dr. ${user.name.split(" ").slice(-1)[0]}`
    : "Doctor";

  const doctorFullName = user?.name || "Doctor";

  // Count videos by status
  const videoStats = {
    total: doctorVideos?.length || 0,
    completed: doctorVideos?.filter(v => v.status === "completed").length || 0,
    generating: doctorVideos?.filter(v => v.status === "generating").length || 0,
  };

  // Toggle add video to My Videos
  const handleToggleVideo = (videoId: string) => {
    setAddedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  // Filter 1A videos
  const filtered1AVideos = BROWSE_1A_VIDEOS.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Notification counts
  const newActivityCount = RECENT_PATIENTS.filter(p => p.hasNewActivity).length;

  return (
    <div className="space-y-12 pb-12">
      {/* ========== SECTION: Dashboard Header ========== */}
      <section id="dashboard" className="scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {doctorName} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here&apos;s what&apos;s happening with your patients today
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
          </div>
        </div>

        {/* Stats Grid - 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
          {DASHBOARD_STATS.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "p-2 md:p-3 rounded-xl text-white",
                    stat.color
                  )}
                >
                  <div className="w-4 h-4 md:w-6 md:h-6 [&>svg]:w-full [&>svg]:h-full">
                    {stat.icon}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs md:text-sm font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded-full",
                    stat.trend === "up"
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-red-700 bg-red-50"
                  )}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-2 md:mt-4">
                <p className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 truncate">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SECTION: Patient Activity ========== */}
      <section id="activity" className="scroll-mt-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-sky-100 rounded-full">
                <Activity className="w-6 h-6 text-sky-600" />
                {newActivityCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    {newActivityCount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Patient Activity
                </h2>
                <p className="text-sm text-gray-500">Recent engagement and messages</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {RECENT_PATIENTS.map((patient) => (
              <Link
                key={patient.id}
                href={`/doctor/patients/${patient.id}`}
                className="p-4 hover:bg-gray-50 transition-colors block"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0 bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                      {patient.avatarUrl ? (
                        <Image
                          src={patient.avatarUrl}
                          alt={patient.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    {patient.hasNewActivity && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {patient.name}
                      </p>
                      {patient.status === "completed" && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                          Completed
                        </span>
                      )}
                    </div>
                    {!patient.lastMessage && (
                      <p className="text-sm text-gray-500">{patient.lastActivity}</p>
                    )}
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                        {patient.videosWatched}/{patient.totalVideos}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
                {/* Last Message */}
                {patient.lastMessage && (
                  <div className="mt-3 ml-16 flex items-start gap-2">
                    <div className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                      patient.lastMessage.type === "from_patient" 
                        ? "bg-sky-100" 
                        : patient.lastMessage.type === "check_in"
                        ? "bg-purple-100"
                        : "bg-gray-100"
                    )}>
                      <MessageSquare className={cn(
                        "w-3 h-3",
                        patient.lastMessage.type === "from_patient" 
                          ? "text-sky-600" 
                          : patient.lastMessage.type === "check_in"
                          ? "text-purple-600"
                          : "text-gray-500"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs font-medium",
                          patient.lastMessage.type === "from_patient" 
                            ? "text-sky-600" 
                            : patient.lastMessage.type === "check_in"
                            ? "text-purple-600"
                            : "text-gray-500"
                        )}>
                          {patient.lastMessage.type === "from_patient" 
                            ? "From patient" 
                            : patient.lastMessage.type === "check_in"
                            ? "Check-in response"
                            : "You sent"}
                        </span>
                        <span className="text-xs text-gray-400">{patient.lastMessage.time}</span>
                        {patient.lastMessage.isUnread && (
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <p className={cn(
                        "text-sm line-clamp-1 mt-0.5",
                        patient.lastMessage.isUnread ? "text-gray-900 font-medium" : "text-gray-600"
                      )}>
                        {patient.lastMessage.content}
                      </p>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION: My Patients ========== */}
      <section id="patients" className="scroll-mt-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  My Patients
                </h2>
                <p className="text-sm text-gray-500">{RECENT_PATIENTS.length} patients in your care</p>
              </div>
            </div>
            <Link
              href="/doctor/patients"
              className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECENT_PATIENTS.slice(0, 6).map((patient) => (
                <Link
                  key={patient.id}
                  href={`/doctor/patients/${patient.id}`}
                  className="p-4 bg-gray-50 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                        {patient.avatarUrl ? (
                          <Image
                            src={patient.avatarUrl}
                            alt={patient.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      {patient.hasNewActivity && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate group-hover:text-sky-600 transition-colors">
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{patient.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            patient.videosWatched === patient.totalVideos
                              ? "bg-emerald-500"
                              : "bg-sky-500"
                          )}
                          style={{
                            width: `${(patient.videosWatched / patient.totalVideos) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {patient.videosWatched}/{patient.totalVideos}
                      </span>
                    </div>
                    {patient.status === "completed" && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                        Completed
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION: My Videos ========== */}
      <section id="my-videos" className="scroll-mt-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-full">
                <Film className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  My Videos
                </h2>
                <p className="text-sm text-gray-500">Videos you&apos;ve added to your library</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {MY_VIDEOS.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MY_VIDEOS.map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all group"
                  >
                    <div className="relative aspect-video bg-gray-200">
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-xl">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <button className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-gray-800 ml-0.5" fill="currentColor" />
                        </button>
                      </div>
                      {video.isOnPublicProfile && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-xl flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Public
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{video.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">{video.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Eye className="w-3.5 h-3.5" />
                          {video.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                            aria-label="Send video"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Film className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos yet</h3>
                <p className="text-gray-500 mb-4">
                  Browse the 1A video library below and add videos to your collection.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== SECTION: Browse 1A Videos ========== */}
      <section id="browse" className="scroll-mt-20">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Browse 1A Video Library
                </h2>
                <p className="text-sm text-gray-600">Add videos to your collection</p>
              </div>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white/80"
              />
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered1AVideos.map((video) => {
                const isAdded = addedVideos.has(video.id);
                return (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <div className="relative aspect-video bg-gray-200">
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-xl">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 text-gray-700 text-xs rounded-xl font-medium">
                        {video.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{video.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{video.description}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => handleToggleVideo(video.id)}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all",
                            isAdded
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-emerald-600 text-white hover:bg-emerald-700"
                          )}
                        >
                          {isAdded ? (
                            <>
                              <BookmarkCheck className="w-4 h-4" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Add to My Videos
                            </>
                          )}
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          aria-label="AI Clone"
                          title="Make my version with AI"
                        >
                          <Wand2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION: Train AI on Me ========== */}
      <section id="train-ai" className="scroll-mt-20">
        <div className="bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 rounded-2xl border border-rose-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-full">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Train AI on Me
                </h2>
                <p className="text-sm text-gray-600">Create your AI avatar for personalized videos</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Train AI Avatar Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <UserCircle className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Train AI on Your Likeness
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Create a realistic AI avatar that looks and sounds like you. Upload a short video sample to get started.
                    </p>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://www.heygen.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-700 transition-all"
                      >
                        <Wand2 className="w-4 h-4" />
                        Train with HeyGen
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Powered by HeyGen AI video generation
                    </p>
                  </div>
                </div>
              </div>

              {/* Create Videos Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                    <Film className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Create AI Videos
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Once trained, clone any video from the 1A library with your own avatar. Your face, your voice.
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/doctor/create-chapters"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all"
                      >
                        <Video className="w-4 h-4" />
                        Create My Videos
                      </Link>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      10 template chapters available for personalization
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="mt-6 pt-6 border-t border-rose-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">How it works:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Train Your Avatar</p>
                    <p className="text-xs text-gray-500">Upload a video to HeyGen to create your AI twin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Clone Videos</p>
                    <p className="text-xs text-gray-500">Select videos from the 1A library to personalize</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Send to Patients</p>
                    <p className="text-xs text-gray-500">Your personalized videos are ready to share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION: My Profile ========== */}
      <section id="profile" className="scroll-mt-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-full">
                <User className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  My Profile
                </h2>
                <p className="text-sm text-gray-500">Your public doctor profile</p>
              </div>
            </div>
            <Link
              href="/doctor/settings"
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              Edit Profile
            </Link>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gray-100 bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={doctorFullName}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {doctorFullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{doctorName}</h3>
                    <p className="text-gray-600">{user?.doctorProfile?.specialty || "Healthcare Provider"}</p>
                    <p className="text-sm text-gray-500 mt-1">{user?.doctorProfile?.clinicName || "1Another Health"}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {user?.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Public Profile Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{MY_VIDEOS.filter(v => v.isOnPublicProfile).length}</p>
                    <p className="text-sm text-gray-500">Public Videos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{RECENT_PATIENTS.length}</p>
                    <p className="text-sm text-gray-500">Patients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">4.9</p>
                    <p className="text-sm text-gray-500">Rating</p>
                  </div>
                </div>
              </div>

              {/* Public Videos Preview */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-3">Videos on Public Profile</h4>
                <div className="space-y-3">
                  {MY_VIDEOS.filter(v => v.isOnPublicProfile).slice(0, 3).map((video) => (
                    <div key={video.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="relative w-16 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                        <p className="text-xs text-gray-500">{video.views} views</p>
                      </div>
                      <Globe className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
