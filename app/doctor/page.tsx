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
  CheckCircle2,
  MessageSquare,
  ArrowRight,
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
  Pill,
  AlertCircle,
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
    avatarUrl: "/images/patients/dave-thompson.jpg",
    healthProvider: "Kaiser Permanente",
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
    healthProvider: "United Healthcare",
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
    healthProvider: "Blue Cross",
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
    lastActivity: "5 days ago",
    videosWatched: 3,
    totalVideos: 10,
    status: "inactive",
    hasNewActivity: false,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    healthProvider: "Aetna",
    lastMessage: {
      type: "to_patient" as const,
      content: "Hi Emily, just checking in - how are you feeling this week?",
      time: "5 days ago",
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
    healthProvider: "Cigna",
    lastMessage: {
      type: "check_in" as const,
      content: "Took all my medications ✅",
      time: "2 days ago",
      isUnread: false,
    },
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    lastActivity: "4 hours ago",
    videosWatched: 6,
    totalVideos: 10,
    status: "active",
    hasNewActivity: false,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    healthProvider: "Humana",
    lastMessage: null,
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

// Health topic categories for Browse by Topic
const HEALTH_TOPICS = [
  { id: "all", label: "All Topics" },
  { id: "Cardiology", label: "Cardiology" },
  { id: "Foundation", label: "Foundation" },
  { id: "Lifestyle", label: "Lifestyle" },
  { id: "Nutrition", label: "Nutrition" },
  { id: "Recovery", label: "Recovery" },
  { id: "Education", label: "Education" },
  { id: "Conditions", label: "Conditions" },
];

// Vertical videos for TikTok-style preview
const VERTICAL_VIDEOS = [
  {
    id: "vv-1",
    title: "Quick Heart Health Tip",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=180&h=320&fit=crop",
    videoUrl: "/videos/heart-health.mp4",
    duration: 45,
    category: "Cardiology",
    views: 12400,
    doctor: {
      name: "Sarah Chen",
      avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    },
  },
  {
    id: "vv-2",
    title: "Morning Stretches for Back Pain",
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=180&h=320&fit=crop",
    videoUrl: "/videos/stretches.mp4",
    duration: 60,
    category: "Recovery",
    views: 8900,
    doctor: {
      name: "James Wilson",
      avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    },
  },
  {
    id: "vv-3",
    title: "Understanding Your Blood Pressure",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=180&h=320&fit=crop",
    videoUrl: "/videos/blood-pressure.mp4",
    duration: 90,
    category: "Education",
    views: 15200,
    doctor: {
      name: "Michael Rodriguez",
      avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop",
    },
  },
  {
    id: "vv-4",
    title: "Heart-Healthy Breakfast Ideas",
    thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=180&h=320&fit=crop",
    videoUrl: "/videos/breakfast.mp4",
    duration: 55,
    category: "Nutrition",
    views: 21000,
    doctor: {
      name: "Emily Foster",
      avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
    },
  },
  {
    id: "vv-5",
    title: "Managing Stress in 60 Seconds",
    thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=180&h=320&fit=crop",
    videoUrl: "/videos/stress.mp4",
    duration: 60,
    category: "Lifestyle",
    views: 18500,
    doctor: {
      name: "David Kim",
      avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop",
    },
  },
  {
    id: "vv-6",
    title: "Post-Surgery Exercise Guide",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=180&h=320&fit=crop",
    videoUrl: "/videos/exercise.mp4",
    duration: 75,
    category: "Recovery",
    views: 9800,
    doctor: {
      name: "Rachel Martinez",
      avatarUrl: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=100&h=100&fit=crop",
    },
  },
];

// Patient check-ins data for the Check-ins section
const PATIENT_CHECK_INS = [
  {
    id: "1",
    name: "Dave Thompson",
    avatarUrl: "/images/patients/dave-thompson.jpg",
    pendingResponses: 2,
    lastCheckIn: "2 min ago",
    messages: [
      {
        id: "msg-1",
        type: "video" as const,
        title: "Understanding Your Blood Pressure",
        thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
        duration: "3:45",
        status: "sent" as const,
        sentAt: "5 min ago",
        watched: false,
      },
      {
        id: "ci-1",
        type: "wellness" as const,
        question: "How are you feeling today?",
        status: "pending" as const,
        sentAt: "2 min ago",
      },
      {
        id: "ci-2",
        type: "medication" as const,
        question: "Did you take your medications today?",
        status: "pending" as const,
        sentAt: "1 hour ago",
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    pendingResponses: 0,
    lastCheckIn: "Yesterday",
    messages: [
      {
        id: "msg-2",
        type: "video" as const,
        title: "Heart Health Basics",
        thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=225&fit=crop",
        duration: "4:20",
        status: "sent" as const,
        sentAt: "2 days ago",
        watched: true,
      },
      {
        id: "ci-3",
        type: "wellness" as const,
        question: "How are you feeling today?",
        status: "answered" as const,
        answer: "Good",
        emoji: "🙂",
        sentAt: "Yesterday",
        answeredAt: "Yesterday",
      },
    ],
  },
  {
    id: "3",
    name: "Michael Chen",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    pendingResponses: 3,
    lastCheckIn: "3 hours ago",
    messages: [
      {
        id: "msg-3",
        type: "video" as const,
        title: "Managing Your Medications",
        thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=225&fit=crop",
        duration: "5:10",
        status: "sent" as const,
        sentAt: "1 day ago",
        watched: false,
      },
      {
        id: "ci-4",
        type: "wellness" as const,
        question: "How are you feeling today?",
        status: "pending" as const,
        sentAt: "3 hours ago",
      },
      {
        id: "ci-5",
        type: "medication" as const,
        question: "Did you take your medications today?",
        status: "pending" as const,
        sentAt: "3 hours ago",
      },
      {
        id: "msg-4",
        type: "video" as const,
        title: "Exercise After Heart Events",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
        duration: "6:30",
        status: "sent" as const,
        sentAt: "3 hours ago",
        watched: true,
      },
      {
        id: "ci-6",
        type: "medication" as const,
        question: "How are your medications working?",
        status: "pending" as const,
        sentAt: "3 hours ago",
      },
    ],
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    pendingResponses: 4,
    lastCheckIn: "3 days ago",
    messages: [
      {
        id: "msg-5",
        type: "video" as const,
        title: "Diet & Nutrition Tips",
        thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
        duration: "4:15",
        status: "sent" as const,
        sentAt: "1 week ago",
        watched: true,
      },
      {
        id: "ci-7",
        type: "wellness" as const,
        question: "How are you feeling today?",
        status: "pending" as const,
        sentAt: "3 days ago",
      },
      {
        id: "msg-6",
        type: "video" as const,
        title: "Managing Stress for Heart Health",
        thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
        duration: "3:50",
        status: "sent" as const,
        sentAt: "3 days ago",
        watched: false,
      },
      {
        id: "ci-8",
        type: "medication" as const,
        question: "Did you take your medications today?",
        status: "pending" as const,
        sentAt: "3 days ago",
      },
      {
        id: "ci-9",
        type: "medication" as const,
        question: "How are your medications working?",
        status: "pending" as const,
        sentAt: "3 days ago",
      },
    ],
  },
  {
    id: "5",
    name: "James Wilson",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    pendingResponses: 0,
    lastCheckIn: "1 day ago",
    checkIns: [
      {
        id: "ci-10",
        type: "medication" as const,
        question: "Did you take your medications today?",
        status: "answered" as const,
        answer: "Yes, all of them",
        emoji: "✅",
        sentAt: "1 day ago",
        answeredAt: "1 day ago",
      },
    ],
  },
];

// Check-in question templates
const CHECK_IN_TEMPLATES = [
  { id: "wellness", type: "wellness" as const, question: "How are you feeling today?", icon: Heart, color: "from-emerald-400 to-cyan-500" },
  { id: "medication", type: "medication" as const, question: "Did you take your medications today?", icon: Pill, color: "from-emerald-400 to-cyan-500" },
  { id: "medication-effect", type: "medication" as const, question: "How are your medications working?", icon: Pill, color: "from-emerald-400 to-cyan-500" },
];

export default function DoctorDashboard() {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [addedVideos, setAddedVideos] = useState<Set<string>>(new Set(["1a-2", "1a-4"]));
  const [selectedCheckInPatient, setSelectedCheckInPatient] = useState<string | null>("4");
  const [checkInSearch, setCheckInSearch] = useState("");
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [customCheckInMessage, setCustomCheckInMessage] = useState("");
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

  // Get doctor's specialty to show personalized content first
  const doctorSpecialty = user?.doctorProfile?.specialty || "Cardiology";

  // Filter 1A videos by search query and topic
  const filtered1AVideos = BROWSE_1A_VIDEOS.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "all" || video.category === selectedTopic;
    return matchesSearch && matchesTopic;
  }).sort((a, b) => {
    // Show videos matching doctor's specialty first
    const aMatchesSpecialty = a.category.toLowerCase().includes(doctorSpecialty.toLowerCase()) ? -1 : 0;
    const bMatchesSpecialty = b.category.toLowerCase().includes(doctorSpecialty.toLowerCase()) ? -1 : 0;
    return aMatchesSpecialty - bMatchesSpecialty;
  });

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

      {/* ========== SECTION: My Patients (Combined with Activity) ========== */}
      <section id="patients" className="scroll-mt-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-full">
                <Users className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  My Patients
                </h2>
                <p className="text-sm text-gray-500">{RECENT_PATIENTS.length} patients in your care</p>
              </div>
            </div>
            <Link
              href="/doctor/send"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-sky-600 transition-all"
            >
              <Send className="w-4 h-4" />
              Send
            </Link>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Patient
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Progress
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">
                    Last Activity
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">
                    Provider
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {RECENT_PATIENTS.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/doctor/patients/${patient.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100 flex-shrink-0">
                            <Image
                              src={patient.avatarUrl}
                              alt={patient.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {patient.hasNewActivity && (
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{patient.name}</p>
                            {patient.status === "completed" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
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
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {patient.videosWatched}/{patient.totalVideos} videos
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {patient.lastActivity}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{patient.healthProvider}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/doctor/send?patient=${patient.id}`;
                          }}
                          className="p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                          aria-label="Send content"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========== SECTION: Messages ========== */}
      <section id="messages" className="scroll-mt-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
            {/* Left Panel - Patient List */}
            <div className="border-r border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                </div>
                <p className="text-sm text-gray-500">Patient communications</p>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={checkInSearch}
                    onChange={(e) => setCheckInSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Patient List */}
              <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
                {PATIENT_CHECK_INS.filter(p => 
                  p.name.toLowerCase().includes(checkInSearch.toLowerCase())
                ).map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedCheckInPatient(patient.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left",
                      selectedCheckInPatient === patient.id && "bg-sky-50 border-l-4 border-l-sky-500"
                    )}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={patient.avatarUrl}
                          alt={patient.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {patient.pendingResponses > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                          {patient.pendingResponses}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      {patient.pendingResponses > 0 ? (
                        <p className="text-sm text-amber-600 font-medium">
                          {patient.pendingResponses} pending response{patient.pendingResponses !== 1 ? 's' : ''}
                        </p>
                      ) : (
                        <p className="text-sm text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          All caught up
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Check-in Details */}
            <div className="flex flex-col min-h-[400px]">
              {selectedCheckInPatient ? (
                <>
                  {/* Selected Patient Header */}
                  {(() => {
                    const patient = PATIENT_CHECK_INS.find(p => p.id === selectedCheckInPatient);
                    if (!patient) return null;
                    return (
                      <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={patient.avatarUrl}
                            alt={patient.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-500">Last check-in: {patient.lastCheckIn}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Messages (Check-ins + Videos) */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {(() => {
                      const patient = PATIENT_CHECK_INS.find(p => p.id === selectedCheckInPatient);
                      if (!patient || !patient.messages) return null;
                      return patient.messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col items-end gap-2">
                          {msg.type === "video" ? (
                            <>
                              {/* Video Message - Clean Thumbnail */}
                              <div className="relative w-[180px] rounded-xl overflow-hidden shadow-md">
                                <div className="relative aspect-video w-full bg-gray-900">
                                  <Image
                                    src={msg.thumbnailUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop"}
                                    alt={msg.title || "Video"}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                      <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
                                    </div>
                                  </div>
                                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-medium rounded">
                                    {msg.duration}
                                  </span>
                                </div>
                                <div className="bg-white px-2.5 py-2">
                                  <p className="text-xs font-medium text-gray-900 line-clamp-1">{msg.title}</p>
                                </div>
                              </div>
                              {/* Video Status */}
                              <div className="flex items-center gap-1.5 text-xs">
                                {msg.watched ? (
                                  <span className="flex items-center gap-1 text-emerald-600">
                                    <Eye className="w-3 h-3" />
                                    Watched
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    Not watched
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Check-in Question Bubble */}
                              <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[320px] text-white shadow-md">
                                <div className="flex items-center gap-2 mb-1 text-white/90">
                                  {msg.type === "wellness" ? (
                                    <Heart className="w-4 h-4" />
                                  ) : (
                                    <Pill className="w-4 h-4" />
                                  )}
                                  <span className="text-sm font-medium">{msg.type}</span>
                                </div>
                                <p className="font-medium">{msg.question}</p>
                              </div>
                              
                              {/* Check-in Status */}
                              {msg.status === "pending" ? (
                                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Awaiting response...</span>
                                </div>
                              ) : (
                                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[280px]">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">{msg.emoji}</span>
                                    <span className="font-medium text-gray-900">{msg.answer}</span>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Send Button - Uses universal send flow */}
                  <div className="p-4 border-t border-gray-100">
                    <Link
                      href="/doctor/send"
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Select a patient to view check-ins</p>
                  </div>
                </div>
              )}
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Browse Videos
                </h2>
                <p className="text-sm text-gray-600">Add videos to your collection</p>
              </div>
            </div>
            <div className="relative w-full lg:w-64">
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

          {/* Trending Vertical Videos */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-500" />
                <h3 className="font-semibold text-gray-900">Trending Short Videos</h3>
              </div>
              <span className="text-sm text-gray-500">{VERTICAL_VIDEOS.length} videos</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {VERTICAL_VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="flex-shrink-0 w-36 group cursor-pointer"
                  onClick={() => window.location.href = `/doctor/discover?video=${video.id}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/doctor/discover?video=${video.id}`)}
                  aria-label={`Watch ${video.title}`}
                >
                  <div className="relative aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-xl">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Play indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                    
                    {/* Duration badge */}
                    <div className="absolute bottom-14 right-2 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-gray-700 text-[10px] rounded-full font-medium">
                      {video.category}
                    </div>
                    
                    {/* Doctor info at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-white/20 flex-shrink-0 border border-white/30">
                          <Image
                            src={video.doctor.avatarUrl}
                            alt={video.doctor.name}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white text-[10px] font-medium truncate">
                          Dr. {video.doctor.name.split(" ")[0]}
                        </span>
                      </div>
                      <h3 className="text-white text-xs font-semibold line-clamp-2 leading-tight">
                        {video.title}
                      </h3>
                    </div>
                    
                    {/* Views */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      <Eye className="w-3 h-3" />
                      {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}k` : video.views}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browse by Topic Filters */}
          <div className="px-6 pb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Browse by Topic</p>
            <div className="flex flex-wrap gap-2">
              {HEALTH_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedTopic === topic.id
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white/80 text-gray-600 hover:bg-white hover:text-emerald-700 border border-emerald-200"
                  )}
                >
                  {topic.label}
                  {topic.id === doctorSpecialty && selectedTopic !== topic.id && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 rounded-full">
                      Your specialty
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 pt-2">
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

      {/* Check-in Modal - Side by Side Layout */}
      {showCheckInModal && selectedCheckInPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Send Check-in to {PATIENT_CHECK_INS.find(p => p.id === selectedCheckInPatient)?.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose a template message or write a custom one
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCheckInModal(false);
                    setCustomCheckInMessage("");
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Side by Side */}
            <div className="grid md:grid-cols-2 divide-x divide-gray-100">
              {/* Left Side - Template Messages */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Template Messages
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {CHECK_IN_TEMPLATES.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => {
                          console.log("Sending template check-in:", template.question, "to patient:", selectedCheckInPatient);
                          setShowCheckInModal(false);
                        }}
                        className="w-full p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-colors text-left group border border-transparent hover:border-emerald-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg bg-gradient-to-r", template.color, "text-white")}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 group-hover:text-emerald-700">
                              {template.question}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{template.type}</p>
                          </div>
                          <Send className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 mt-1" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - Custom Message */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-600" />
                  Custom Message
                </h4>
                <textarea
                  value={customCheckInMessage}
                  onChange={(e) => setCustomCheckInMessage(e.target.value)}
                  placeholder="Type your custom check-in message here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                  aria-label="Custom check-in message"
                />
                <p className="text-xs text-gray-400 mt-2">
                  This is a one-way message. Patients will see this in their check-in feed.
                </p>
                <button
                  onClick={() => {
                    if (customCheckInMessage.trim()) {
                      console.log("Sending custom check-in:", customCheckInMessage, "to patient:", selectedCheckInPatient);
                      setShowCheckInModal(false);
                      setCustomCheckInMessage("");
                    }
                  }}
                  disabled={!customCheckInMessage.trim()}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-sky-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Custom Message
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => {
                  setShowCheckInModal(false);
                  setCustomCheckInMessage("");
                }}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
