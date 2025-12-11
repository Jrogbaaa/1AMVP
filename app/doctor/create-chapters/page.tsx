"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Check,
  Sparkles,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Wand2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Film,
  UserCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  script: string;
}

interface TemplateChapter {
  id: string;
  title: string;
  description: string;
  category: string;
  videos: TemplateVideo[];
  status: "not_started" | "in_progress" | "completed";
}

const TEMPLATE_CHAPTERS: TemplateChapter[] = [
  {
    id: "1",
    title: "Heart Health Basics",
    description: "Essential information about how your heart works and how to keep it healthy.",
    category: "Foundation",
    status: "completed",
    videos: [
      {
        id: "v1-1",
        title: "Understanding Your Heart",
        description: "Learn the basic anatomy and function of your heart.",
        duration: "4:32",
        thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=225&fit=crop",
        script: "Your heart is a remarkable organ that beats about 100,000 times a day...",
      },
      {
        id: "v1-2",
        title: "Heart Rate & Rhythm",
        description: "What your heart rate tells you about your health.",
        duration: "3:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=225&fit=crop",
        script: "A normal resting heart rate for adults ranges from 60 to 100 beats per minute...",
      },
      {
        id: "v1-3",
        title: "Signs of a Healthy Heart",
        description: "Key indicators that show your heart is functioning well.",
        duration: "5:10",
        thumbnailUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=225&fit=crop",
        script: "There are several key indicators that your heart is in good shape...",
      },
    ],
  },
  {
    id: "2",
    title: "Blood Pressure Management",
    description: "Learn to understand, monitor, and manage your blood pressure effectively.",
    category: "Foundation",
    status: "in_progress",
    videos: [
      {
        id: "v2-1",
        title: "Reading Blood Pressure Numbers",
        description: "What systolic and diastolic numbers mean for your health.",
        duration: "3:20",
        thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=225&fit=crop",
        script: "Blood pressure is measured using two numbers: systolic and diastolic...",
      },
      {
        id: "v2-2",
        title: "Home Monitoring Tips",
        description: "How to accurately measure blood pressure at home.",
        duration: "4:15",
        thumbnailUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=225&fit=crop",
        script: "Monitoring your blood pressure at home is an important part of managing your health...",
      },
    ],
  },
  {
    id: "3",
    title: "Diet & Nutrition",
    description: "Heart-healthy eating habits and dietary recommendations.",
    category: "Lifestyle",
    status: "not_started",
    videos: [
      {
        id: "v3-1",
        title: "Heart-Healthy Foods",
        description: "The best foods to support cardiovascular health.",
        duration: "5:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop",
        script: "Eating a heart-healthy diet is one of the best things you can do for your cardiovascular health...",
      },
      {
        id: "v3-2",
        title: "Foods to Limit or Avoid",
        description: "Understanding which foods can harm your heart.",
        duration: "4:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=225&fit=crop",
        script: "While many foods support heart health, some can increase your risk of cardiovascular problems...",
      },
    ],
  },
  {
    id: "4",
    title: "Exercise & Physical Activity",
    description: "Safe and effective exercises for cardiovascular health.",
    category: "Lifestyle",
    status: "not_started",
    videos: [
      {
        id: "v4-1",
        title: "Starting a Safe Exercise Routine",
        description: "How to begin exercising safely with heart conditions.",
        duration: "5:15",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
        script: "Starting an exercise routine is one of the best decisions you can make for your heart...",
      },
      {
        id: "v4-2",
        title: "Low-Impact Cardio Exercises",
        description: "Gentle exercises that strengthen your heart.",
        duration: "7:20",
        thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop",
        script: "Low-impact exercises are perfect for people of all fitness levels...",
      },
    ],
  },
  {
    id: "5",
    title: "Medication Management",
    description: "Understanding and properly taking your heart medications.",
    category: "Treatment",
    status: "not_started",
    videos: [
      {
        id: "v5-1",
        title: "Understanding Your Medications",
        description: "Learn what each medication does and why it's important.",
        duration: "6:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=225&fit=crop",
        script: "Understanding your medications is crucial for effective treatment...",
      },
      {
        id: "v5-2",
        title: "Managing Side Effects",
        description: "Common side effects and how to handle them.",
        duration: "4:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=225&fit=crop",
        script: "All medications can have side effects. Here's how to manage them effectively...",
      },
    ],
  },
  {
    id: "6",
    title: "Stress Management",
    description: "Techniques to reduce stress and protect your heart.",
    category: "Lifestyle",
    status: "not_started",
    videos: [
      {
        id: "v6-1",
        title: "How Stress Affects Your Heart",
        description: "Understanding the connection between stress and heart health.",
        duration: "4:00",
        thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
        script: "Chronic stress can have a significant impact on your cardiovascular system...",
      },
      {
        id: "v6-2",
        title: "Breathing Exercises",
        description: "Simple breathing techniques for instant calm.",
        duration: "5:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop",
        script: "Deep breathing is one of the most effective ways to quickly reduce stress...",
      },
    ],
  },
  {
    id: "7",
    title: "Sleep & Recovery",
    description: "The importance of quality sleep for heart health.",
    category: "Lifestyle",
    status: "not_started",
    videos: [
      {
        id: "v7-1",
        title: "Sleep and Heart Health",
        description: "Why good sleep is crucial for your cardiovascular system.",
        duration: "4:20",
        thumbnailUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=225&fit=crop",
        script: "Sleep is when your body does much of its repair work, including your heart...",
      },
    ],
  },
  {
    id: "8",
    title: "Warning Signs & Emergency Care",
    description: "Recognizing symptoms that require immediate attention.",
    category: "Safety",
    status: "not_started",
    videos: [
      {
        id: "v8-1",
        title: "Heart Attack Warning Signs",
        description: "Know the symptoms that could save your life.",
        duration: "5:15",
        thumbnailUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=400&h=225&fit=crop",
        script: "Recognizing the warning signs of a heart attack can save your life...",
      },
      {
        id: "v8-2",
        title: "When to Call 911",
        description: "Understanding what constitutes a cardiac emergency.",
        duration: "3:45",
        thumbnailUrl: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&h=225&fit=crop",
        script: "Knowing when to call 911 is crucial. Here are the situations that require emergency care...",
      },
    ],
  },
  {
    id: "9",
    title: "Follow-Up Care",
    description: "Preparing for and maximizing your follow-up appointments.",
    category: "Treatment",
    status: "not_started",
    videos: [
      {
        id: "v9-1",
        title: "Preparing for Your Visit",
        description: "Questions to ask and information to bring.",
        duration: "3:30",
        thumbnailUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=225&fit=crop",
        script: "Being prepared for your follow-up appointments helps you get the most out of them...",
      },
    ],
  },
  {
    id: "10",
    title: "Living Well Long-Term",
    description: "Strategies for maintaining heart health for years to come.",
    category: "Foundation",
    status: "not_started",
    videos: [
      {
        id: "v10-1",
        title: "Building Healthy Habits",
        description: "Small changes that make a big difference over time.",
        duration: "5:00",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
        script: "Building lasting healthy habits is the key to long-term heart health...",
      },
    ],
  },
];

export default function CreateChaptersPage() {
  const [expandedChapter, setExpandedChapter] = useState<string | null>("1");
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isAvatarTrained, setIsAvatarTrained] = useState(true); // TODO: fetch from backend

  const handleToggleChapter = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const handleToggleVideo = (videoId: string) => {
    setSelectedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleSelectAllInChapter = (chapter: TemplateChapter) => {
    const allSelected = chapter.videos.every((v) => selectedVideos.has(v.id));
    setSelectedVideos((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        chapter.videos.forEach((v) => newSet.delete(v.id));
      } else {
        chapter.videos.forEach((v) => newSet.add(v.id));
      }
      return newSet;
    });
  };

  const handleGenerateVideo = async (videoId: string) => {
    if (!isAvatarTrained) {
      setGenerationError("Please train your AI avatar first before generating videos.");
      return;
    }
    
    setGenerationError(null);
    setGeneratingVideoId(videoId);
    setIsGenerating(true);
    
    try {
      // Simulate API call to HeyGen
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // In real app, this would trigger HeyGen API and update chapter status
    } catch {
      setGenerationError("Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
      setGeneratingVideoId(null);
    }
  };

  const handleGenerateSelected = async () => {
    if (!isAvatarTrained) {
      setGenerationError("Please train your AI avatar first before generating videos.");
      return;
    }
    
    setGenerationError(null);
    setIsGenerating(true);
    
    try {
      // Simulate batch generation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setSelectedVideos(new Set());
    } catch {
      setGenerationError("Failed to generate videos. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDismissError = () => {
    setGenerationError(null);
  };

  const getStatusBadge = (status: TemplateChapter["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Personalized
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            Template
          </span>
        );
    }
  };

  const totalVideos = TEMPLATE_CHAPTERS.reduce((sum, ch) => sum + ch.videos.length, 0);
  const completedChapters = TEMPLATE_CHAPTERS.filter((ch) => ch.status === "completed").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/doctor"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Your Chapter Videos</h1>
            <p className="text-gray-500 mt-1">
              Personalize template videos with your AI avatar
            </p>
          </div>
          {selectedVideos.size > 0 && (
            <button
              onClick={handleGenerateSelected}
              disabled={isGenerating || !isAvatarTrained}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate {selectedVideos.size} Video{selectedVideos.size !== 1 ? "s" : ""}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <Film className="w-8 h-8 text-violet-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="font-semibold text-gray-900">Personalization Progress</h3>
              <span className="text-sm text-violet-600 font-medium">
                {completedChapters} of {TEMPLATE_CHAPTERS.length} chapters completed
              </span>
            </div>
            <div className="w-full h-3 bg-violet-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all"
                style={{ width: `${(completedChapters / TEMPLATE_CHAPTERS.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{totalVideos}</p>
            <p className="text-sm text-gray-500">Total Videos</p>
          </div>
        </div>
      </div>

      {/* AI Avatar Status */}
      <div className={cn(
        "rounded-xl p-4 border flex items-center justify-between",
        isAvatarTrained 
          ? "bg-white border-gray-200" 
          : "bg-amber-50 border-amber-200"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isAvatarTrained
              ? "bg-gradient-to-br from-pink-500 to-rose-600"
              : "bg-amber-200"
          )}>
            <UserCircle className={cn(
              "w-7 h-7",
              isAvatarTrained ? "text-white" : "text-amber-600"
            )} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">Your AI Avatar</p>
              {isAvatarTrained ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  Active
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Not Trained
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {isAvatarTrained 
                ? "Trained and ready to generate videos" 
                : "Train your avatar to start generating personalized videos"}
            </p>
          </div>
        </div>
        <a
          href="https://www.heygen.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isAvatarTrained ? "Manage Avatar on HeyGen (opens in new tab)" : "Train Avatar on HeyGen (opens in new tab)"}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            isAvatarTrained
              ? "text-violet-600 hover:bg-violet-50"
              : "bg-amber-500 text-white hover:bg-amber-600"
          )}
        >
          {isAvatarTrained ? "Manage Avatar" : "Train Avatar"}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Error Banner */}
      {generationError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-red-800">Generation Error</p>
            <p className="text-sm text-red-700 mt-1">{generationError}</p>
          </div>
          <button
            onClick={handleDismissError}
            className="p-1 text-red-400 hover:text-red-600 rounded transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Chapter List */}
      <div className="space-y-4">
        {TEMPLATE_CHAPTERS.map((chapter, index) => {
          const isExpanded = expandedChapter === chapter.id;
          const selectedInChapter = chapter.videos.filter((v) => selectedVideos.has(v.id)).length;
          const allSelectedInChapter = selectedInChapter === chapter.videos.length;

          return (
            <div
              key={chapter.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Chapter Header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleToggleChapter(chapter.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggleChapter(chapter.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`chapter-content-${chapter.id}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 text-violet-700 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                    {getStatusBadge(chapter.status)}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{chapter.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {chapter.videos.length} video{chapter.videos.length !== 1 ? "s" : ""}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Chapter Videos */}
              {isExpanded && (
                <div id={`chapter-content-${chapter.id}`} className="border-t border-gray-100">
                  {/* Select All */}
                  <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAllInChapter(chapter);
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                          allSelectedInChapter
                            ? "bg-violet-600 border-violet-600"
                            : selectedInChapter > 0
                            ? "bg-violet-100 border-violet-400"
                            : "border-gray-300"
                        )}
                      >
                        {allSelectedInChapter && <Check className="w-3 h-3 text-white" />}
                        {selectedInChapter > 0 && !allSelectedInChapter && (
                          <div className="w-2 h-2 bg-violet-600 rounded-sm" />
                        )}
                      </div>
                      {allSelectedInChapter ? "Deselect All" : "Select All for Generation"}
                    </button>
                    {chapter.status === "not_started" && (
                      <span className="text-xs text-gray-400">
                        Click to select videos for AI personalization
                      </span>
                    )}
                  </div>

                  {/* Video List */}
                  <div className="divide-y divide-gray-100">
                    {chapter.videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleVideo(video.id)}
                          aria-label={selectedVideos.has(video.id) ? `Deselect ${video.title}` : `Select ${video.title}`}
                          aria-pressed={selectedVideos.has(video.id)}
                          className={cn(
                            "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                            selectedVideos.has(video.id)
                              ? "bg-violet-600 border-violet-600"
                              : "border-gray-300 hover:border-violet-400"
                          )}
                        >
                          {selectedVideos.has(video.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>

                        {/* Thumbnail */}
                        <div className="relative w-28 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white" fill="white" />
                          </div>
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                            {video.duration}
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{video.title}</h4>
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                            {video.description}
                          </p>
                        </div>

                        {/* Generate Button */}
                        <button
                          onClick={() => handleGenerateVideo(video.id)}
                          disabled={isGenerating || !isAvatarTrained}
                          className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                            chapter.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-violet-100 text-violet-700 hover:bg-violet-200",
                            (!isAvatarTrained && chapter.status !== "completed") && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {generatingVideoId === video.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating...
                            </>
                          ) : chapter.status === "completed" ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Generated
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4" />
                              Generate
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">How AI Video Generation Works</p>
          <p className="text-sm text-amber-700 mt-1">
            When you generate a video, our AI takes the template script and creates a new video with your trained avatar speaking the content. 
            Each video takes approximately 2-5 minutes to generate. Once complete, your personalized videos will appear in your Video Library and can be sent to patients.
          </p>
        </div>
      </div>
    </div>
  );
}
