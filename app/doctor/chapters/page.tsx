"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Send,
  Users,
  CheckCircle,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Filter,
  BarChart3,
  Folder,
  Bookmark,
  BookmarkCheck,
  Globe,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  views: number;
  completionRate: number;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  category: string;
  videos: VideoItem[];
  totalViews: number;
  avgCompletionRate: number;
  assignedPatients: number;
}

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "1",
    title: "Heart Health Basics",
    description: "Essential information about how your heart works and how to keep it healthy.",
    category: "Foundation",
    totalViews: 456,
    avgCompletionRate: 85,
    assignedPatients: 124,
    videos: [
      {
        id: "v1-1",
        title: "Understanding Your Heart",
        description: "Learn the basic anatomy and function of your heart.",
        duration: "4:32",
        thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=225&fit=crop",
        views: 189,
        completionRate: 92,
      },
      {
        id: "v1-2",
        title: "Heart Rate & Rhythm",
        description: "What your heart rate tells you about your health.",
        duration: "3:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop",
        views: 156,
        completionRate: 88,
      },
      {
        id: "v1-3",
        title: "Signs of a Healthy Heart",
        description: "Key indicators that show your heart is functioning well.",
        duration: "5:10",
        thumbnailUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=225&fit=crop",
        views: 111,
        completionRate: 75,
      },
    ],
  },
  {
    id: "2",
    title: "Blood Pressure Management",
    description: "Learn to understand, monitor, and manage your blood pressure effectively.",
    category: "Foundation",
    totalViews: 389,
    avgCompletionRate: 78,
    assignedPatients: 98,
    videos: [
      {
        id: "v2-1",
        title: "Reading Blood Pressure Numbers",
        description: "What systolic and diastolic numbers mean for your health.",
        duration: "3:20",
        thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
        views: 201,
        completionRate: 85,
      },
      {
        id: "v2-2",
        title: "Home Monitoring Tips",
        description: "How to accurately measure blood pressure at home.",
        duration: "4:15",
        thumbnailUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=225&fit=crop",
        views: 188,
        completionRate: 71,
      },
    ],
  },
  {
    id: "3",
    title: "Diet & Nutrition",
    description: "Heart-healthy eating habits and dietary recommendations.",
    category: "Lifestyle",
    totalViews: 312,
    avgCompletionRate: 72,
    assignedPatients: 87,
    videos: [
      {
        id: "v3-1",
        title: "Heart-Healthy Foods",
        description: "The best foods to support cardiovascular health.",
        duration: "5:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
        views: 145,
        completionRate: 78,
      },
      {
        id: "v3-2",
        title: "Foods to Limit or Avoid",
        description: "Understanding which foods can harm your heart.",
        duration: "4:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=225&fit=crop",
        views: 98,
        completionRate: 68,
      },
      {
        id: "v3-3",
        title: "Meal Planning Tips",
        description: "Simple strategies for heart-healthy meal prep.",
        duration: "6:00",
        thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=225&fit=crop",
        views: 69,
        completionRate: 70,
      },
    ],
  },
  {
    id: "4",
    title: "Exercise & Physical Activity",
    description: "Safe and effective exercises for cardiovascular health.",
    category: "Lifestyle",
    totalViews: 287,
    avgCompletionRate: 68,
    assignedPatients: 76,
    videos: [
      {
        id: "v4-1",
        title: "Starting a Safe Exercise Routine",
        description: "How to begin exercising safely with heart conditions.",
        duration: "5:15",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
        views: 132,
        completionRate: 72,
      },
      {
        id: "v4-2",
        title: "Low-Impact Cardio Exercises",
        description: "Gentle exercises that strengthen your heart.",
        duration: "7:20",
        thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop",
        views: 155,
        completionRate: 64,
      },
    ],
  },
  {
    id: "5",
    title: "Medication Management",
    description: "Understanding and properly taking your heart medications.",
    category: "Treatment",
    totalViews: 398,
    avgCompletionRate: 82,
    assignedPatients: 145,
    videos: [
      {
        id: "v5-1",
        title: "Understanding Your Medications",
        description: "Learn what each medication does and why it's important.",
        duration: "6:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=225&fit=crop",
        views: 198,
        completionRate: 89,
      },
      {
        id: "v5-2",
        title: "Managing Side Effects",
        description: "Common side effects and how to handle them.",
        duration: "4:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=225&fit=crop",
        views: 134,
        completionRate: 78,
      },
      {
        id: "v5-3",
        title: "Medication Reminders & Tips",
        description: "Strategies to never miss a dose.",
        duration: "3:15",
        thumbnailUrl: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=225&fit=crop",
        views: 66,
        completionRate: 79,
      },
    ],
  },
  {
    id: "6",
    title: "Stress Management",
    description: "Techniques to reduce stress and protect your heart.",
    category: "Lifestyle",
    totalViews: 256,
    avgCompletionRate: 75,
    assignedPatients: 65,
    videos: [
      {
        id: "v6-1",
        title: "How Stress Affects Your Heart",
        description: "Understanding the connection between stress and heart health.",
        duration: "4:00",
        thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
        views: 145,
        completionRate: 80,
      },
      {
        id: "v6-2",
        title: "Breathing Exercises",
        description: "Simple breathing techniques for instant calm.",
        duration: "5:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop",
        views: 111,
        completionRate: 70,
      },
    ],
  },
  {
    id: "7",
    title: "Sleep & Recovery",
    description: "The importance of quality sleep for heart health.",
    category: "Lifestyle",
    totalViews: 198,
    avgCompletionRate: 71,
    assignedPatients: 54,
    videos: [
      {
        id: "v7-1",
        title: "Sleep and Heart Health",
        description: "Why good sleep is crucial for your cardiovascular system.",
        duration: "4:20",
        thumbnailUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=225&fit=crop",
        views: 98,
        completionRate: 75,
      },
      {
        id: "v7-2",
        title: "Better Sleep Habits",
        description: "Tips for improving your sleep quality.",
        duration: "5:00",
        thumbnailUrl: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400&h=225&fit=crop",
        views: 100,
        completionRate: 67,
      },
    ],
  },
  {
    id: "8",
    title: "Warning Signs & Emergency Care",
    description: "Recognizing symptoms that require immediate attention.",
    category: "Safety",
    totalViews: 445,
    avgCompletionRate: 91,
    assignedPatients: 189,
    videos: [
      {
        id: "v8-1",
        title: "Heart Attack Warning Signs",
        description: "Know the symptoms that could save your life.",
        duration: "5:15",
        thumbnailUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=225&fit=crop",
        views: 234,
        completionRate: 95,
      },
      {
        id: "v8-2",
        title: "When to Call 911",
        description: "Understanding what constitutes a cardiac emergency.",
        duration: "3:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&h=225&fit=crop",
        views: 145,
        completionRate: 92,
      },
      {
        id: "v8-3",
        title: "First Aid Basics",
        description: "What to do while waiting for emergency services.",
        duration: "4:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=225&fit=crop",
        views: 66,
        completionRate: 86,
      },
    ],
  },
  {
    id: "9",
    title: "Follow-Up Care",
    description: "Preparing for and maximizing your follow-up appointments.",
    category: "Treatment",
    totalViews: 234,
    avgCompletionRate: 79,
    assignedPatients: 78,
    videos: [
      {
        id: "v9-1",
        title: "Preparing for Your Visit",
        description: "Questions to ask and information to bring.",
        duration: "3:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=225&fit=crop",
        views: 123,
        completionRate: 82,
      },
      {
        id: "v9-2",
        title: "Understanding Test Results",
        description: "What your cardiac tests mean for your health.",
        duration: "5:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop",
        views: 111,
        completionRate: 76,
      },
    ],
  },
  {
    id: "10",
    title: "Living Well Long-Term",
    description: "Strategies for maintaining heart health for years to come.",
    category: "Foundation",
    totalViews: 178,
    avgCompletionRate: 69,
    assignedPatients: 45,
    videos: [
      {
        id: "v10-1",
        title: "Building Healthy Habits",
        description: "Small changes that make a big difference over time.",
        duration: "5:00",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
        views: 89,
        completionRate: 72,
      },
      {
        id: "v10-2",
        title: "Support Systems & Resources",
        description: "Finding help and community for your heart health journey.",
        duration: "4:15",
        thumbnailUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=225&fit=crop",
        views: 89,
        completionRate: 66,
      },
    ],
  },
];

const CATEGORIES = ["All", "Foundation", "Lifestyle", "Treatment", "Safety"];

export default function ChaptersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(["1"]));
  const [savedVideos, setSavedVideos] = useState<Set<string>>(new Set(["v1-1", "v2-1"]));
  const [publicVideos, setPublicVideos] = useState<Set<string>>(new Set(["v1-1"]));
  const [activeVideoMenu, setActiveVideoMenu] = useState<string | null>(null);

  const filteredChapters = MOCK_CHAPTERS.filter((chapter) => {
    const matchesSearch =
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || chapter.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const handleToggleSaved = (videoId: string) => {
    setSavedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
        // Also remove from public if removing from saved
        setPublicVideos((p) => {
          const ps = new Set(p);
          ps.delete(videoId);
          return ps;
        });
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
    setActiveVideoMenu(null);
  };

  const handleTogglePublic = (videoId: string) => {
    // First ensure it's in saved
    if (!savedVideos.has(videoId)) {
      setSavedVideos((prev) => new Set(prev).add(videoId));
    }
    setPublicVideos((prev) => {
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

  const totalVideos = MOCK_CHAPTERS.reduce((sum, ch) => sum + ch.videos.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Library</h1>
          <p className="text-gray-500">
            {MOCK_CHAPTERS.length} chapters • {totalVideos} videos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            Add Chapter
          </button>
          <Link
            href="/doctor/send"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-sky-600 transition-all"
          >
            <Send className="w-4 h-4" />
            Send to Patients
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search chapters or videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all",
                selectedCategory === category
                  ? "bg-sky-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {filteredChapters.map((chapter, chapterIndex) => {
          const isExpanded = expandedChapters.has(chapter.id);

          return (
            <div
              key={chapter.id}
              id={chapter.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Chapter Header */}
              <button
                onClick={() => handleToggleChapter(chapter.id)}
                className="w-full flex items-center gap-4 p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-100 text-sky-600 font-bold text-lg flex-shrink-0">
                  {chapterIndex + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {chapter.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{chapter.description}</p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Play className="w-4 h-4" />
                    <span>{chapter.videos.length} videos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{chapter.totalViews} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{chapter.assignedPatients} assigned</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" />
                    <span>{chapter.avgCompletionRate}% completion</span>
                  </div>
                </div>
                <div className="p-2">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Mobile Stats */}
              <div className="md:hidden flex items-center gap-4 px-6 pb-4 text-sm text-gray-500 -mt-2">
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  <span>{chapter.videos.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{chapter.totalViews}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{chapter.assignedPatients}</span>
                </div>
              </div>

              {/* Videos List */}
              {isExpanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                  {chapter.videos.map((video) => {
                    const isSaved = savedVideos.has(video.id);
                    const isPublic = publicVideos.has(video.id);
                    const isMenuOpen = activeVideoMenu === video.id;

                    return (
                      <div
                        key={video.id}
                        className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-32 sm:w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 group cursor-pointer">
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                              <Play className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                            {video.duration}
                          </div>
                          {/* Badge indicators */}
                          {isSaved && (
                            <div className="absolute top-1 left-1 flex gap-1">
                              <span className="px-1.5 py-0.5 bg-sky-500 text-white text-[10px] font-medium rounded">
                                Saved
                              </span>
                              {isPublic && (
                                <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-medium rounded flex items-center gap-0.5">
                                  <Globe className="w-2.5 h-2.5" />
                                  Public
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{video.title}</h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {video.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{video.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>{video.completionRate}% completed</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {/* Quick Add/Remove Button */}
                          <button
                            onClick={() => handleToggleSaved(video.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isSaved
                                ? "text-sky-600 bg-sky-50 hover:bg-sky-100"
                                : "text-gray-400 hover:text-sky-600 hover:bg-sky-50"
                            )}
                            aria-label={isSaved ? "Remove from My Videos" : "Add to My Videos"}
                            title={isSaved ? "Remove from My Videos" : "Add to My Videos"}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>

                          {/* Send Button */}
                          <Link
                            href={`/doctor/send?video=${video.id}`}
                            className="p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            aria-label="Send video"
                            title="Send to Patient"
                          >
                            <Send className="w-4 h-4" />
                          </Link>

                          {/* More Options Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveVideoMenu(isMenuOpen ? null : video.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              aria-label="More options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setActiveVideoMenu(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
                                  <button
                                    onClick={() => handleToggleSaved(video.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    {isSaved ? (
                                      <>
                                        <BookmarkCheck className="w-4 h-4 text-sky-600" />
                                        <span>Remove from My Videos</span>
                                      </>
                                    ) : (
                                      <>
                                        <Bookmark className="w-4 h-4" />
                                        <span>Add to My Videos</span>
                                      </>
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => handleTogglePublic(video.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Globe className={cn("w-4 h-4", isPublic && "text-emerald-600")} />
                                    <span>{isPublic ? "Remove from Public Profile" : "Add to Public Profile"}</span>
                                  </button>

                                  <div className="border-t border-gray-100 my-1" />
                                  
                                  <Link
                                    href={`/doctor/send?video=${video.id}`}
                                    onClick={() => setActiveVideoMenu(null)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Send className="w-4 h-4" />
                                    <span>Send to Patient</span>
                                  </Link>

                                  <Link
                                    href={`/doctor/create-chapters?clone=${video.id}`}
                                    onClick={() => setActiveVideoMenu(null)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Wand2 className="w-4 h-4 text-violet-600" />
                                    <span>AI Clone with My Avatar</span>
                                  </Link>

                                  <div className="border-t border-gray-100 my-1" />

                                  <button
                                    onClick={() => setActiveVideoMenu(null)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit Video</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Chapter Actions */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                      <Plus className="w-4 h-4" />
                      Add Video
                    </button>
                    <Link
                      href={`/doctor/send?chapter=${chapter.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700"
                    >
                      <Send className="w-4 h-4" />
                      Send Entire Chapter
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No chapters found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
