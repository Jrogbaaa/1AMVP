"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Search,
  Filter,
  Wand2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Clock,
  User,
  Copy,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Plus,
  Bookmark,
  BookmarkCheck,
  Send,
  MoreVertical,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for API responses
interface GenerateVideoResponse {
  success: boolean;
  data?: {
    generatedVideoId: string;
    heygenVideoId: string;
    status: string;
    message: string;
  };
  error?: string;
}

// Mock data for doctor videos - in production this would come from Convex
interface DoctorVideo {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatarUrl: string;
  title: string;
  description: string;
  script: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: number;
  cloneCount: number;
  category: string;
  createdAt: string;
}

const MOCK_DOCTOR_VIDEOS: DoctorVideo[] = [
  {
    id: "dv-1",
    doctorId: "doc-2",
    doctorName: "Dr. Sarah Chen",
    doctorSpecialty: "Cardiology",
    doctorAvatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    title: "Managing Stress for Heart Health",
    description: "Learn evidence-based techniques for managing stress to protect your cardiovascular system.",
    script: "Chronic stress can have a significant impact on your heart health. When you're stressed, your body releases cortisol and adrenaline, which can raise your blood pressure and heart rate. Over time, this puts extra strain on your cardiovascular system. Today, I want to share some evidence-based techniques that my patients have found helpful for managing stress...",
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
    duration: "5:30",
    viewCount: 1245,
    cloneCount: 34,
    category: "Lifestyle",
    createdAt: "2024-12-10",
  },
  {
    id: "dv-2",
    doctorId: "doc-3",
    doctorName: "Dr. Michael Rodriguez",
    doctorSpecialty: "Internal Medicine",
    doctorAvatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    title: "Understanding Cholesterol Numbers",
    description: "A clear explanation of what your cholesterol test results mean and how to improve them.",
    script: "When you get your cholesterol test results, you'll see several numbers. Let me break down what each one means. Your total cholesterol is the overall amount of cholesterol in your blood. But what's more important is the breakdown between LDL and HDL cholesterol...",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop",
    duration: "4:15",
    viewCount: 2341,
    cloneCount: 67,
    category: "Education",
    createdAt: "2024-12-08",
  },
  {
    id: "dv-3",
    doctorId: "doc-4",
    doctorName: "Dr. Emily Watson",
    doctorSpecialty: "Preventive Cardiology",
    doctorAvatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
    title: "Exercise After a Heart Event",
    description: "Safe ways to return to physical activity following a cardiac event or procedure.",
    script: "If you've recently had a heart event or procedure, you might be wondering when and how you can safely return to exercise. The good news is that regular physical activity is actually one of the best things you can do for your heart health. But it's important to do it safely...",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
    duration: "6:45",
    viewCount: 1876,
    cloneCount: 52,
    category: "Recovery",
    createdAt: "2024-12-05",
  },
  {
    id: "dv-4",
    doctorId: "doc-5",
    doctorName: "Dr. James Park",
    doctorSpecialty: "Electrophysiology",
    doctorAvatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop",
    title: "Living with Atrial Fibrillation",
    description: "What you need to know about managing AFib in your daily life.",
    script: "Atrial fibrillation, or AFib, is one of the most common heart rhythm disorders. If you've been diagnosed with AFib, you might have many questions about how it affects your daily life. Let me explain what's happening in your heart and what you can do to manage it effectively...",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop",
    duration: "7:20",
    viewCount: 3102,
    cloneCount: 89,
    category: "Conditions",
    createdAt: "2024-12-01",
  },
  {
    id: "dv-5",
    doctorId: "doc-6",
    doctorName: "Dr. Amanda Foster",
    doctorSpecialty: "Heart Failure",
    doctorAvatarUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop",
    title: "Sodium and Your Heart",
    description: "How sodium affects your heart and practical tips for reducing salt intake.",
    script: "Sodium plays a crucial role in our bodies, but too much can be harmful, especially for your heart. When you consume excess sodium, your body retains water to dilute it, which increases blood volume and puts extra pressure on your heart and blood vessels...",
    thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
    duration: "4:50",
    viewCount: 1567,
    cloneCount: 41,
    category: "Nutrition",
    createdAt: "2024-11-28",
  },
  {
    id: "dv-6",
    doctorId: "doc-7",
    doctorName: "Dr. Robert Kim",
    doctorSpecialty: "Interventional Cardiology",
    doctorAvatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop",
    title: "What to Expect During a Stent Procedure",
    description: "A step-by-step guide to coronary stent placement to help ease patient anxiety.",
    script: "If you've been told you need a stent, it's natural to feel anxious about the procedure. Let me walk you through exactly what will happen so you know what to expect. A stent procedure, also called percutaneous coronary intervention or PCI, is a minimally invasive procedure...",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
    duration: "8:15",
    viewCount: 4521,
    cloneCount: 112,
    category: "Procedures",
    createdAt: "2024-11-25",
  },
];

const CATEGORIES = ["All", "Education", "Lifestyle", "Nutrition", "Recovery", "Conditions", "Procedures"];

export default function DiscoverVideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "most_cloned">("popular");
  const [isAvatarTrained, setIsAvatarTrained] = useState(true); // TODO: fetch from Convex
  const [cloningVideoId, setCloningVideoId] = useState<string | null>(null);
  const [cloneError, setCloneError] = useState<string | null>(null);
  const [clonedVideos, setClonedVideos] = useState<Set<string>>(new Set());
  const [showScriptModal, setShowScriptModal] = useState<string | null>(null);
  const [savedVideos, setSavedVideos] = useState<Set<string>>(new Set(["dv-2", "dv-4"]));
  const [activeVideoMenu, setActiveVideoMenu] = useState<string | null>(null);

  // Filter and sort videos
  const filteredVideos = MOCK_DOCTOR_VIDEOS
    .filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.viewCount - a.viewCount;
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "most_cloned":
          return b.cloneCount - a.cloneCount;
        default:
          return 0;
      }
    });

  // Toggle video in saved list
  const handleToggleSaved = (videoId: string) => {
    setSavedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
    setActiveVideoMenu(null);
  };

  // Clone a video (generate with current doctor's avatar)
  const handleCloneVideo = useCallback(async (video: DoctorVideo) => {
    if (!isAvatarTrained) {
      setCloneError("Please configure your AI avatar in Settings before cloning videos.");
      return;
    }

    setCloningVideoId(video.id);
    setCloneError(null);

    try {
      const response = await fetch("/api/heygen/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: video.title,
          script: video.script,
          description: `Cloned from ${video.doctorName}: ${video.description}`,
        }),
      });

      const data: GenerateVideoResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to clone video");
      }

      // Mark as cloned
      setClonedVideos((prev) => new Set(prev).add(video.id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to clone video. Please try again.";
      setCloneError(message);
    } finally {
      setCloningVideoId(null);
    }
  }, [isAvatarTrained]);

  const selectedVideoForScript = MOCK_DOCTOR_VIDEOS.find((v) => v.id === showScriptModal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/doctor"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-violet-600" />
              Discover Videos
            </h1>
            <p className="text-gray-500 mt-1">
              Browse videos from other doctors and clone them with your own avatar
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Status Warning */}
      {!isAvatarTrained && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-amber-800">AI Avatar Not Configured</p>
            <p className="text-sm text-amber-700 mt-1">
              You need to configure your HeyGen avatar before you can clone videos.
            </p>
            <Link
              href="/doctor/settings"
              className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              Go to Settings →
            </Link>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {cloneError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{cloneError}</p>
          </div>
          <button
            onClick={() => setCloneError(null)}
            className="p-1 text-red-400 hover:text-red-600 rounded transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos by title, description, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all",
                selectedCategory === category
                  ? "bg-violet-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Sort by:</span>
        <div className="flex gap-2">
          {[
            { value: "popular", label: "Most Viewed", icon: <Eye className="w-4 h-4" /> },
            { value: "recent", label: "Recent", icon: <Clock className="w-4 h-4" /> },
            { value: "most_cloned", label: "Most Cloned", icon: <Copy className="w-4 h-4" /> },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value as typeof sortBy)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                sortBy === option.value
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{MOCK_DOCTOR_VIDEOS.length}</p>
              <p className="text-sm text-gray-500">Shared Videos</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Eye className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {MOCK_DOCTOR_VIDEOS.reduce((sum, v) => sum + v.viewCount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Views</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {MOCK_DOCTOR_VIDEOS.reduce((sum, v) => sum + v.cloneCount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Clones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-200">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {video.duration}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                <button
                  className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  aria-label="Preview video"
                >
                  <Play className="w-6 h-6 text-gray-800 ml-0.5" fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Doctor Info */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-100">
                  <Image
                    src={video.doctorAvatarUrl}
                    alt={video.doctorName}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{video.doctorName}</p>
                  <p className="text-xs text-gray-500">{video.doctorSpecialty}</p>
                </div>
              </div>

              {/* Video Info */}
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{video.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{video.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {video.viewCount.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" />
                  {video.cloneCount} clones
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {/* Primary Action: Add to My Videos */}
                <button
                  onClick={() => handleToggleSaved(video.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all",
                    savedVideos.has(video.id)
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  )}
                >
                  {savedVideos.has(video.id) ? (
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

                {/* More Options Menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveVideoMenu(activeVideoMenu === video.id ? null : video.id)}
                    className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeVideoMenu === video.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveVideoMenu(null)}
                      />
                      <div className="absolute right-0 bottom-full mb-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
                        <button
                          onClick={() => {
                            setShowScriptModal(video.id);
                            setActiveVideoMenu(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Script</span>
                        </button>
                        
                        <button
                          onClick={() => handleToggleSaved(video.id)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {savedVideos.has(video.id) ? (
                            <>
                              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                              <span>Remove from My Videos</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-4 h-4" />
                              <span>Add to My Videos</span>
                            </>
                          )}
                        </button>

                        <div className="border-t border-gray-100 my-1" />

                        <button
                          onClick={() => {
                            handleCloneVideo(video);
                            setActiveVideoMenu(null);
                          }}
                          disabled={cloningVideoId === video.id || !isAvatarTrained || clonedVideos.has(video.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors",
                            clonedVideos.has(video.id)
                              ? "text-emerald-700"
                              : "text-gray-700",
                            (!isAvatarTrained && !clonedVideos.has(video.id)) && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {cloningVideoId === video.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Cloning...</span>
                            </>
                          ) : clonedVideos.has(video.id) ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Already Cloned</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 text-violet-600" />
                              <span>AI Clone with My Avatar</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/doctor/send?video=${video.id}`}
                          onClick={() => setActiveVideoMenu(null)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send to Patient</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      {/* Script Modal */}
      {showScriptModal && selectedVideoForScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedVideoForScript.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    By {selectedVideoForScript.doctorName}
                  </p>
                </div>
                <button
                  onClick={() => setShowScriptModal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Video Script</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedVideoForScript.script}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowScriptModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleSaved(selectedVideoForScript.id);
                  setShowScriptModal(null);
                }}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5",
                  savedVideos.has(selectedVideoForScript.id)
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-sky-600 text-white hover:bg-sky-700"
                )}
              >
                {savedVideos.has(selectedVideoForScript.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    Added to My Videos
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add to My Videos
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

