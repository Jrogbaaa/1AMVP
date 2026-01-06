"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";
import { QA_QUESTIONS } from "@/components/QACard";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { AuthPrompt } from "@/components/AuthPrompt";
import { ScheduleAppointment } from "@/components/ScheduleAppointment";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { useEngagement } from "@/hooks/useEngagement";
import { Calendar, Search, Share2, User, MessageCircle, CheckCircle2, Check } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import type { Video, Doctor } from "@/lib/types";
import Image from "next/image";
import { Logo } from "@/components/Logo";

// Mock doctors data - removed Dr. Ryan Mitchell, keeping Dr. Jack and others
const MOCK_DOCTORS: Record<string, Doctor> = {
  "550e8400-e29b-41d4-a716-446655440001": {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Sarah Johnson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart Health Clinic",
    createdAt: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440002": {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Michael Chen",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80",
    clinicName: "Boston Cardiology Center",
    createdAt: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440003": {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Emily Rodriguez",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80",
    clinicName: "Advanced Heart Care",
    createdAt: new Date().toISOString(),
  },
  "550e8400-e29b-41d4-a716-446655440004": {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Jack Ellis",
    specialty: "Cardiology",
    avatarUrl: "/images/doctors/doctor-jack.jpg",
    clinicName: "1Another Cardiology",
    createdAt: new Date().toISOString(),
  },
};

const MOCK_DOCTOR = MOCK_DOCTORS["550e8400-e29b-41d4-a716-446655440004"]; // Dr. Jack Ellis as default

const MOCK_VIDEOS: Video[] = [
  // First video: Dr. Jack Ellis
  {
    id: "750e8400-e29b-41d4-a716-446655440006",
    title: "Understanding Your Heart Rhythm",
    description: "Learn the basics of heart rhythm",
    videoUrl: "/videos/doctor-jack-video-1.mp4",
    thumbnailUrl: "/images/doctors/doctor-jack.jpg",
    posterUrl: "/images/doctors/doctor-jack.jpg",
    duration: 180,
    category: "Education",
    tags: ["heart rhythm", "cardiology", "basics"],
    doctorId: "550e8400-e29b-41d4-a716-446655440004",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  // Second video: Dr. Jack Ellis
  {
    id: "750e8400-e29b-41d4-a716-446655440009",
    title: "Blood Pressure Basics",
    description: "Understanding your blood pressure readings",
    videoUrl: "/videos/doctor-jack-video-2.mp4",
    thumbnailUrl: "/images/doctors/doctor-jack.jpg",
    posterUrl: "/images/doctors/doctor-jack.jpg",
    duration: 150,
    category: "Education",
    tags: ["blood pressure", "cardiology", "basics"],
    doctorId: "550e8400-e29b-41d4-a716-446655440004",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  // Third video: Dr. Jack Ellis
  {
    id: "750e8400-e29b-41d4-a716-446655440007",
    title: "Managing Cholesterol Levels",
    description: "Effective strategies for cholesterol management",
    videoUrl: "/videos/doctor-jack-video-2.mp4",
    thumbnailUrl: "/images/doctors/doctor-jack.jpg",
    posterUrl: "/images/doctors/doctor-jack.jpg",
    duration: 210,
    category: "Education",
    tags: ["cholesterol", "prevention", "heart health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440004",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  // Fourth video: Dr. Jack Ellis
  {
    id: "750e8400-e29b-41d4-a716-446655440010",
    title: "Heart-Healthy Diet Tips",
    description: "Nutrition advice for a healthy heart",
    videoUrl: "/videos/doctor-jack-video-3.mp4",
    thumbnailUrl: "/images/doctors/doctor-jack.jpg",
    posterUrl: "/images/doctors/doctor-jack.jpg",
    duration: 200,
    category: "Education",
    tags: ["nutrition", "diet", "heart health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440004",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  // Fifth video: Dr. Jack Ellis
  {
    id: "750e8400-e29b-41d4-a716-446655440008",
    title: "Signs of Heart Disease to Watch",
    description: "Early warning signs to know",
    videoUrl: "/videos/doctor-jack-video-3.mp4",
    thumbnailUrl: "/images/doctors/doctor-jack.jpg",
    posterUrl: "/images/doctors/doctor-jack.jpg",
    duration: 240,
    category: "Education",
    tags: ["warning signs", "heart disease", "prevention"],
    doctorId: "550e8400-e29b-41d4-a716-446655440004",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
];

const FeedContent = () => {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("p");
  const doctorFilter = searchParams.get("doctor");
  
  // Auth state
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  // Engagement tracking
  const {
    engagement,
    isLoaded: isEngagementLoaded,
    trackVideoView,
    trackVideoComplete,
    trackWatchTime,
    trackInteraction,
    hasEarnedTrust,
    markAuthPromptDismissed,
  } = useEngagement();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptTrigger, setAuthPromptTrigger] = useState<"earned_trust" | "save_progress" | "set_reminder" | "personalized_content" | "follow_doctor">("earned_trust");
  const [isGlobalMuted, setIsGlobalMuted] = useState(false); // Global mute state
  const containerRef = useRef<HTMLDivElement>(null);
  const watchTimeRef = useRef<number>(0);
  const watchTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle global mute change - persists across all videos
  const handleMuteChange = useCallback((muted: boolean) => {
    setIsGlobalMuted(muted);
  }, []);

  // Filter videos by doctor if specified
  const filteredVideos = doctorFilter
    ? MOCK_VIDEOS.filter((video) => video.doctorId === doctorFilter)
    : MOCK_VIDEOS;

  // Combined feed with Q&A, reminder, and message cards interspersed between videos
  // Cards are now inline (not overlays), showing as smaller units
  type FeedItem = 
    | { type: 'video'; data: Video }
    | { type: 'qa'; data: typeof QA_QUESTIONS[number] }
    | { type: 'reminder' }
    | { type: 'message' };

  const combinedFeed: FeedItem[] = [];
  let qaIndex = 0;
  let reminderInserted = false;
  let messageInserted = false;
  
  filteredVideos.forEach((video, index) => {
    combinedFeed.push({ type: 'video', data: video });
    
    // Insert message card after the 2nd video
    if (index === 1 && !messageInserted) {
      combinedFeed.push({ type: 'message' });
      messageInserted = true;
    }
    // Insert reminder card after the 4th video
    else if (index === 3 && !reminderInserted) {
      combinedFeed.push({ type: 'reminder' });
      reminderInserted = true;
    }
    // Insert Q&A card after every 5th video (less frequent)
    else if ((index + 1) % 5 === 0 && qaIndex < QA_QUESTIONS.length) {
      combinedFeed.push({ type: 'qa', data: QA_QUESTIONS[qaIndex] });
      qaIndex++;
    }
  });

  const selectedDoctor = doctorFilter ? MOCK_DOCTORS[doctorFilter] : MOCK_DOCTOR;
  const currentFeedItem = combinedFeed[currentIndex];

  // Get patient name - use session name if authenticated, or default to "there"
  const patientName = session?.user?.name?.split(" ")[0] || "there";

  // Track watch time while video is playing
  useEffect(() => {
    const currentItem = combinedFeed[currentIndex];
    if (currentItem && currentItem.type === 'video') {
      // Start tracking watch time
      watchTimeIntervalRef.current = setInterval(() => {
        watchTimeRef.current += 5;
        if (watchTimeRef.current % 30 === 0) {
          // Save every 30 seconds of watch time
          trackWatchTime(30);
        }
      }, 5000);
    }

    return () => {
      if (watchTimeIntervalRef.current) {
        clearInterval(watchTimeIntervalRef.current);
      }
    };
  }, [combinedFeed, currentIndex, trackWatchTime]);

  // Show auth prompt after earned trust (if not authenticated)
  useEffect(() => {
    if (
      isEngagementLoaded &&
      hasEarnedTrust &&
      !isAuthenticated &&
      !showAuthPrompt &&
      engagement.videosWatched.length >= 1 &&
      !engagement.authPromptDismissedAt
    ) {
      // Small delay to not interrupt the viewing experience
      const timer = setTimeout(() => {
        setAuthPromptTrigger("earned_trust");
        setShowAuthPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isEngagementLoaded, hasEarnedTrust, isAuthenticated, showAuthPrompt, engagement]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);

      if (newIndex !== currentIndex && newIndex < combinedFeed.length) {
        setCurrentIndex(newIndex);
        // Track video view when scrolling to a new video
        const feedItem = combinedFeed[newIndex];
        if (feedItem && feedItem.type === 'video') {
          trackVideoView(feedItem.data.id);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, combinedFeed, trackVideoView]);

  // Track first video view on mount - use ref to prevent infinite loop
  const hasTrackedFirstVideo = useRef(false);
  useEffect(() => {
    if (!hasTrackedFirstVideo.current && combinedFeed.length > 0 && combinedFeed[0].type === 'video') {
      hasTrackedFirstVideo.current = true;
      trackVideoView(combinedFeed[0].data.id);
    }
  }, [combinedFeed, trackVideoView]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleVideoComplete = useCallback(() => {
    // Track video completion (only for video items)
    const feedItem = combinedFeed[currentIndex];
    if (feedItem && feedItem.type === 'video') {
      trackVideoComplete(feedItem.data.id);
    }
  }, [combinedFeed, currentIndex, trackVideoComplete]);

  const handleQAAnswer = useCallback((questionId: string, answerId: string) => {
    // Track Q&A interaction
    trackInteraction();
    
    // In the future, this would send the answer to the backend
    console.log(`Q&A Answer: ${questionId} -> ${answerId}`);
  }, [trackInteraction]);

  const handleCloseAuthPrompt = () => {
    setShowAuthPrompt(false);
    markAuthPromptDismissed();
  };

  const handleShare = async () => {
    trackInteraction();
    
    const feedItem = combinedFeed[currentIndex];
    if (!feedItem || feedItem.type !== 'video') return;

    const video = feedItem.data;

    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description || `Check out this video: ${video.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <>
      <div className="feed-wrapper">
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <Link href="/feed" className="flex flex-col items-center justify-center">
              <Logo variant="withTagline" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/feed"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold transition-all"
            >
              <svg className="w-6 h-6 text-[#00BFA6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>My Feed</span>
            </Link>
            <Link
              href="/discover"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
              </svg>
              <span>Discover</span>
            </Link>
            <Link
              href="/my-health"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span>My Health</span>
            </Link>
            
            <div className="pt-4 border-t border-gray-100 mt-4">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Doctors</p>
              {Object.values(MOCK_DOCTORS).map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/profile/${doctor.id}`}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                    {doctor.avatarUrl ? (
                      <Image
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00BFA6] to-[#00A6CE] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{doctor.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm">Dr. {doctor.name}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-100">
            {isAuthenticated ? (
              <Link
                href="/my-health"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#00A6CE] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {session?.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setAuthPromptTrigger("save_progress");
                  setShowAuthPrompt(true);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 text-sm">Sign In</p>
                  <p className="text-xs text-gray-500">Save your progress</p>
                </div>
              </button>
            )}
          </div>
        </aside>

        <div className="feed-container relative lg:ml-64">
          {/* Feed container */}
          <div ref={containerRef} className="snap-container">
            {combinedFeed.map((feedItem, index) => {
              const isCurrentItem = currentIndex === index;
              
              // Render Q&A Inline Card - matches video form factor but shorter to show peek of adjacent videos
              if (feedItem.type === 'qa') {
                return (
                  <div key={`qa-${feedItem.data.id}`} className="snap-item-card">
                    {/* Desktop: Flex container matching video layout */}
                    <div className="h-full w-full flex items-center justify-center md:gap-4">
                      {/* Card container - matches video width, keeps card height - DARK background */}
                      <div className="h-full w-full md:h-full md:w-[calc((100vh-2rem)*9/16)] md:max-w-[506px] md:rounded-2xl md:overflow-hidden md:shadow-2xl relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                        {/* Inner content with padding */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          {/* Doctor photo with message icon */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-shrink-0">
                              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl">
                              <Image
                                  src={selectedDoctor.avatarUrl || "/images/doctors/doctor-jack.jpg"}
                                alt={selectedDoctor.name}
                                  width={64}
                                  height={64}
                                className="w-full h-full object-cover"
                              />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                                <MessageCircle className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-white font-bold text-base">Dr. {selectedDoctor.name}</p>
                              <p className="text-sky-400 text-sm font-medium">Quick Check-in</p>
                            </div>
                          </div>

                          {/* Question card - full width within container */}
                          <div className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/20">
                            <h2 className="text-white text-lg font-bold mb-2">
                              {feedItem.data.question}
                            </h2>
                            {feedItem.data.subtitle && (
                              <p className="text-white/70 text-sm mb-4">
                                {feedItem.data.subtitle}
                              </p>
                            )}

                            {/* Options */}
                            <div className="space-y-2">
                              {feedItem.data.options.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => handleQAAnswer(feedItem.data.id, option.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all active:scale-[0.98]"
                                  aria-label={`Select ${option.label}`}
                                  tabIndex={0}
                                >
                                  <span className="text-xl">{option.emoji}</span>
                                  <span className="font-medium text-sm">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop sidebar placeholder - matches video layout spacing */}
                      <div className="hidden md:flex flex-col gap-6 items-center py-8 w-14">
                        {/* Empty space to match video sidebar width */}
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Render Message Card - Doctor check-in with response options
              if (feedItem.type === 'message') {
                return (
                  <div key="message-card" className="snap-item-card">
                    {/* Desktop: Flex container matching video layout */}
                    <div className="h-full w-full flex items-center justify-center md:gap-4">
                      {/* Card container - matches video width, keeps card height - DARK background */}
                      <div className="h-full w-full md:h-full md:w-[calc((100vh-2rem)*9/16)] md:max-w-[506px] md:rounded-2xl md:overflow-hidden md:shadow-2xl relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                        {/* Inner content with padding */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          {/* Doctor photo with message icon */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-shrink-0">
                              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl">
                                <Image
                                  src={selectedDoctor.avatarUrl || "/images/doctors/doctor-jack.jpg"}
                                  alt={selectedDoctor.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                                <MessageCircle className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-white font-bold text-base">Dr. {selectedDoctor.name}</p>
                              <p className="text-sky-400 text-sm font-medium">Message</p>
                            </div>
                          </div>

                          {/* Message content */}
                          <div className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/20">
                            <h2 className="text-white text-lg font-bold mb-4">
                              Have you started taking your medicine?
                            </h2>

                            {/* Response options */}
                            <div className="space-y-2">
                              <button
                                onClick={() => trackInteraction()}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-sm rounded-xl text-white transition-all active:scale-[0.98] border border-emerald-500/30"
                                aria-label="Just started"
                                tabIndex={0}
                              >
                                <span className="text-xl">🌱</span>
                                <span className="font-medium text-sm">Just started</span>
                              </button>
                              <button
                                onClick={() => trackInteraction()}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-sm rounded-xl text-white transition-all active:scale-[0.98] border border-amber-500/30"
                                aria-label="In progress"
                                tabIndex={0}
                              >
                                <span className="text-xl">⏳</span>
                                <span className="font-medium text-sm">In progress</span>
                              </button>
                              <button
                                onClick={() => trackInteraction()}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-sky-500/20 hover:bg-sky-500/30 backdrop-blur-sm rounded-xl text-white transition-all active:scale-[0.98] border border-sky-500/30"
                                aria-label="Completed cycle"
                                tabIndex={0}
                              >
                                <span className="text-xl">✅</span>
                                <span className="font-medium text-sm">Completed cycle</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop sidebar placeholder - matches video layout spacing */}
                      <div className="hidden md:flex flex-col gap-6 items-center py-8 w-14">
                        {/* Empty space to match video sidebar width */}
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Render Reminder Inline Card - matches video form factor but shorter to show peek of adjacent videos
              if (feedItem.type === 'reminder') {
                return (
                  <div key="reminder-card" className="snap-item-card">
                    {/* Desktop: Flex container matching video layout */}
                    <div className="h-full w-full flex items-center justify-center md:gap-4">
                      {/* Card container - matches video width, keeps card height - DARK background */}
                      <div className="h-full w-full md:h-full md:w-[calc((100vh-2rem)*9/16)] md:max-w-[506px] md:rounded-2xl md:overflow-hidden md:shadow-2xl relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                        {/* Inner content with padding */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          {/* Doctor photo with check mark icon */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-shrink-0">
                              <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/20 shadow-xl">
                                <Image
                                  src={selectedDoctor.avatarUrl || "/images/doctors/doctor-jack.jpg"}
                                  alt={selectedDoctor.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                                <Check className="w-5 h-5 text-white stroke-[3]" />
                              </div>
                            </div>
                            <div>
                              <p className="text-white font-bold text-base">Dr. {selectedDoctor.name}</p>
                              <p className="text-emerald-400 text-sm font-medium">Reminder</p>
                            </div>
                          </div>

                          {/* Reminder content */}
                          <div className="w-full max-w-xs bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/20">
                            <h2 className="text-white text-lg font-bold mb-2">
                              Schedule Colonoscopy
                            </h2>
                            
                            <p className="text-white/70 text-sm mb-4">
                              Based on your family history, let&apos;s get this scheduled.
                            </p>

                            {/* Due date badge */}
                            <div className="flex justify-start mb-4">
                              <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium border border-amber-500/30">
                                <Calendar className="w-4 h-4" />
                                <span>Due in 60 days</span>
                              </div>
                            </div>

                            {/* Schedule button */}
                            <button
                              onClick={() => setIsScheduleOpen(true)}
                              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                              aria-label="Schedule colonoscopy appointment"
                              tabIndex={0}
                            >
                              <Calendar className="w-4 h-4" />
                              Schedule Now
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop sidebar placeholder - matches video layout spacing */}
                      <div className="hidden md:flex flex-col gap-6 items-center py-8 w-14">
                        {/* Empty space to match video sidebar width */}
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Render Video Card
              const video = feedItem.data;
              const videoDoctor = video.doctorId ? MOCK_DOCTORS[video.doctorId] : MOCK_DOCTOR;
              
              return (
                <div key={video.id} className="snap-item">
                  {/* Desktop: Flex container with video + sidebar */}
                  <div className="h-full w-full flex items-center justify-center md:gap-4">
                    {/* Video container - centered on desktop */}
                    <div className="h-full w-full md:h-[calc(100vh-2rem)] md:max-h-[900px] md:w-auto md:aspect-[9/16] md:rounded-2xl md:overflow-hidden md:shadow-2xl relative">
                      <VideoCard
                        video={video}
                        doctor={videoDoctor}
                        isPersonalized={video.isPersonalized}
                        patientName={patientName}
                        isActive={isCurrentItem}
                        isMuted={isGlobalMuted}
                        onMuteChange={handleMuteChange}
                        onComplete={handleVideoComplete}
                        onMessage={handleOpenChat}
                        onScheduleClick={() => setIsScheduleOpen(true)}
                      />
                    </div>

                    {/* Desktop sidebar - Doctor Profile → Discover → Share */}
                    <div className="hidden md:flex flex-col gap-6 items-center py-8">
                      {/* Doctor avatar - link to profile */}
                      {videoDoctor && (
                        <Link
                          href={`/profile/${videoDoctor.id}`}
                          className="flex flex-col items-center gap-2 group"
                          aria-label={`View Dr. ${videoDoctor.name}'s profile`}
                        >
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-md hover:scale-110 transition-transform">
                              {videoDoctor.avatarUrl ? (
                                <Image
                                  src={videoDoctor.avatarUrl}
                                  alt={videoDoctor.name}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                                  <span className="text-white font-bold text-xl">
                                    {videoDoctor.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                              +
                            </div>
                          </div>
                          <span className="text-xs text-gray-700 font-medium max-w-[70px] truncate">Dr. {videoDoctor.name.split(' ')[0]}</span>
                        </Link>
                      )}

                      {/* Discover button */}
                      <Link
                        href="/discover"
                        className="flex flex-col items-center gap-2 group"
                        aria-label="Discover Doctors"
                      >
                        <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 hover:scale-110 transition-all duration-200">
                          <Search className="w-6 h-6 text-gray-700" />
                        </div>
                        <span className="text-xs text-gray-700 font-medium">Discover</span>
                      </Link>

                      {/* Share button */}
                      {!video.isPersonalized && (
                        <button
                          onClick={handleShare}
                          className="flex flex-col items-center gap-2 group"
                          aria-label="Share video"
                        >
                          <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 hover:scale-110 transition-all duration-200">
                            <Share2 className="w-6 h-6 text-gray-700" />
                          </div>
                          <span className="text-xs text-gray-700 font-medium">Share</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile navigation */}
          <MobileBottomNav />

        </div>
      </div>

      {/* Chat onboarding */}
      <ChatOnboarding
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        doctor={selectedDoctor}
        patientName={patientName}
        userId={session?.user?.id || patientId || "anonymous"}
      />

      {/* Auth Prompt - Shows after earned trust */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={handleCloseAuthPrompt}
        trigger={authPromptTrigger}
      />

      {/* Schedule Appointment Modal */}
      <ScheduleAppointment
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        doctor={selectedDoctor}
        userId={session?.user?.id || patientId || "anonymous"}
      />
    </>
  );
};

export default function FeedPage() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <FeedContent />
    </Suspense>
  );
}