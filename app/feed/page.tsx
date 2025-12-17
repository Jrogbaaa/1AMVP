"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";
import { QACard, QA_QUESTIONS } from "@/components/QACard";
import { ReminderCard } from "@/components/ReminderCard";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { AuthPrompt } from "@/components/AuthPrompt";
import { ScheduleAppointment } from "@/components/ScheduleAppointment";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import { useEngagement } from "@/hooks/useEngagement";
import { Calendar, Heart, ArrowLeft, Play, Search, Share2, User, MessageCircle } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { HeartScore } from "@/components/HeartScore";
import type { Video, Doctor } from "@/lib/types";
import Image from "next/image";

// Mock doctors data
const MOCK_DOCTORS: Record<string, Doctor> = {
  "550e8400-e29b-41d4-a716-446655440000": {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Jack Ellis",
    specialty: "Cardiology",
    avatarUrl: "/images/doctors/doctor-jack.jpg",
    clinicName: "1Another Cardiology",
    createdAt: new Date().toISOString(),
  },
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

const MOCK_DOCTOR = MOCK_DOCTORS["550e8400-e29b-41d4-a716-446655440001"];

const MOCK_VIDEOS: Video[] = [
  // Hey Dave video (personalized greeting from Dr. Jack Ellis)
  {
    id: "750e8400-e29b-41d4-a716-446655440000",
    title: "Hey Dave",
    description: "Your personalized health update from Dr. Jack Ellis",
    videoUrl: "/videos/hey-dave.mp4",
    thumbnailUrl: "/images/doctors/doctor-jack.jpg",
    posterUrl: "/images/doctors/doctor-jack.jpg",
    duration: 60,
    category: "Follow-Up",
    tags: ["personalized", "follow-up", "greeting"],
    doctorId: "550e8400-e29b-41d4-a716-446655440000",
    isPersonalized: true,
    createdAt: new Date().toISOString(),
  },
  // Doctor Jack's Videos
  {
    id: "750e8400-e29b-41d4-a716-446655440006",
    title: "Understanding Your Heart Rhythm",
    description: "Dr. Jack explains the basics of heart rhythm and what to look for in your daily heart health.",
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
  {
    id: "750e8400-e29b-41d4-a716-446655440007",
    title: "Managing Cholesterol Levels",
    description: "Dr. Jack discusses effective strategies for managing cholesterol and protecting your heart.",
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
  {
    id: "750e8400-e29b-41d4-a716-446655440008",
    title: "Signs of Heart Disease to Watch",
    description: "Dr. Jack outlines the early warning signs of heart disease and when to seek medical attention.",
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
  const [healthScore, setHealthScore] = useState(55); // Start at 55%
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptTrigger, setAuthPromptTrigger] = useState<"earned_trust" | "save_progress" | "set_reminder" | "personalized_content" | "follow_doctor">("earned_trust");
  const containerRef = useRef<HTMLDivElement>(null);
  const watchTimeRef = useRef<number>(0);
  const watchTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter videos by doctor if specified
  const filteredVideos = doctorFilter
    ? MOCK_VIDEOS.filter((video) => video.doctorId === doctorFilter)
    : MOCK_VIDEOS;

  // Combined feed with Q&A overlays interspersed between videos
  // Q&A items overlay on top of the video underneath them
  type FeedItem = 
    | { type: 'video'; data: Video }
    | { type: 'qa'; data: typeof QA_QUESTIONS[number]; backgroundVideo: Video }
    | { type: 'reminder'; backgroundVideo: Video };

  const combinedFeed: FeedItem[] = [];
  let qaIndex = 0;
  let reminderInserted = false;
  
  filteredVideos.forEach((video, index) => {
    combinedFeed.push({ type: 'video', data: video });
    
    // Insert reminder overlay after the first video (using next video as background)
    if (index === 0 && !reminderInserted && filteredVideos[index + 1]) {
      combinedFeed.push({ type: 'reminder', backgroundVideo: filteredVideos[index + 1] });
      reminderInserted = true;
    }
    // Insert Q&A overlay after every 2nd video
    else if ((index + 1) % 2 === 0 && qaIndex < QA_QUESTIONS.length && filteredVideos[index + 1]) {
      combinedFeed.push({ type: 'qa', data: QA_QUESTIONS[qaIndex], backgroundVideo: filteredVideos[index + 1] });
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
    // Update health score when onboarding is completed
    setHealthScore((prev) => Math.min(prev + 10, 100)); // +10% for completing onboarding
  };

  const handleHeartClick = () => {
    trackInteraction();
    
    // If not authenticated, prompt to sign in for personalized reminders
    if (!isAuthenticated) {
      setAuthPromptTrigger("set_reminder");
      setShowAuthPrompt(true);
      return;
    }
    
    setIsActionMenuOpen(true);
  };

  const handleCloseActionMenu = () => {
    setIsActionMenuOpen(false);
  };

  const handleVideoComplete = useCallback(() => {
    // Track video completion (only for video items)
    const feedItem = combinedFeed[currentIndex];
    if (feedItem && feedItem.type === 'video') {
      trackVideoComplete(feedItem.data.id);
    }
    
    // Update health score when video is completed
    if (currentIndex === 0) {
      // Completed doctor's personalized video - big boost!
      setHealthScore((prev) => Math.min(prev + 20, 100));
    } else {
      // Completed educational video - small boost
      setHealthScore((prev) => Math.min(prev + 5, 100));
    }
  }, [combinedFeed, currentIndex, trackVideoComplete]);

  const handleQAAnswer = useCallback((questionId: string, answerId: string) => {
    // Track Q&A interaction
    trackInteraction();
    
    // Give a small health score boost for engaging with Q&A
    setHealthScore((prev) => Math.min(prev + 3, 100));
    
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
              <Image
                src="/images/1another-logo.png?v=2"
                alt="1Another"
                width={280}
                height={80}
                className="h-12 w-auto"
                priority
                unoptimized
              />
              <span className="text-[#00BCD4] font-semibold text-sm tracking-wide">
                Intelligent Health
              </span>
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
                  href={`/feed?doctor=${doctor.id}`}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-colors ${
                    doctorFilter === doctor.id 
                      ? 'bg-[#00BFA6]/10 text-[#00BFA6]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
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
              
              // Render Q&A Overlay (with video playing behind)
              if (feedItem.type === 'qa') {
                const bgVideo = feedItem.backgroundVideo;
                const bgDoctor = bgVideo.doctorId ? MOCK_DOCTORS[bgVideo.doctorId] : MOCK_DOCTOR;
                
                return (
                  <div key={`qa-${feedItem.data.id}`} className="snap-item">
                    <div className="h-full w-full flex items-center justify-center md:gap-4">
                      <div className="h-full w-full md:h-[calc(100vh-2rem)] md:max-h-[900px] md:w-auto md:aspect-[9/16] md:rounded-2xl md:overflow-hidden md:shadow-2xl relative">
                        {/* Video playing in background */}
                        <VideoCard
                          video={bgVideo}
                          doctor={bgDoctor}
                          isPersonalized={bgVideo.isPersonalized}
                          patientName={patientName}
                          isActive={isCurrentItem}
                          onComplete={handleVideoComplete}
                          onMessage={handleOpenChat}
                          onHeartClick={handleHeartClick}
                          healthScore={healthScore}
                        />
                        
                        {/* Q&A Overlay on top of video */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                          <div className="w-[90%] max-w-sm">
                            {/* Q&A Content */}
                            <div className="bg-gradient-to-br from-[#00BFA6]/95 via-[#00A6CE]/95 to-[#7C3AED]/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl overflow-hidden">
                              {/* Content */}
                              <div className="relative z-10">
                                {/* Header */}
                                <div className="mb-3 text-center">
                                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                                    <span className="text-white/90 text-[10px] font-semibold uppercase tracking-wide">
                                      Quick Check-in
                                    </span>
                                  </div>
                                  <h2 className="text-white text-lg font-bold drop-shadow-lg">
                                    {feedItem.data.question}
                                  </h2>
                                  {feedItem.data.subtitle && (
                                    <p className="text-white/80 text-xs mt-1">
                                      {feedItem.data.subtitle}
                                    </p>
                                  )}
                                </div>

                                {/* Options */}
                                <div className="space-y-2">
                                  {feedItem.data.options.map((option) => (
                                    <button
                                      key={option.id}
                                      onClick={() => handleQAAnswer(feedItem.data.id, option.id)}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                      aria-label={`Select ${option.label}`}
                                    >
                                      <span className="text-lg">{option.emoji}</span>
                                      <span className="font-medium text-sm">{option.label}</span>
                                    </button>
                                  ))}
                                </div>

                                {/* Swipe hint */}
                                <p className="mt-3 text-white/60 text-[10px] text-center">
                                  Answer to continue or swipe to skip
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop sidebar - ORDER: Doctor → Discover → My Heart */}
                      <div className="hidden md:flex flex-col gap-6 items-center py-8">
                        {/* Doctor avatar - FIRST */}
                        {bgDoctor && (
                          <button
                            className="flex flex-col items-center gap-2 group"
                            onClick={handleOpenChat}
                            aria-label={`Message Dr. ${bgDoctor.name}`}
                          >
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-md hover:scale-110 transition-transform">
                                {bgDoctor.avatarUrl ? (
                                  <Image
                                    src={bgDoctor.avatarUrl}
                                    alt={bgDoctor.name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                      {bgDoctor.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                +
                              </div>
                            </div>
                            <span className="text-xs text-gray-700 font-medium max-w-[70px] truncate">Dr. {bgDoctor.name.split(' ')[0]}</span>
                          </button>
                        )}
                        {/* Discover - SECOND */}
                        <Link href="/discover" className="flex flex-col items-center gap-2 group" aria-label="Discover Doctors">
                          <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 hover:scale-110 transition-all duration-200">
                            <Search className="w-6 h-6 text-gray-700" />
                          </div>
                          <span className="text-xs text-gray-700 font-medium">Discover</span>
                        </Link>
                        {/* My Heart - THIRD */}
                        <button onClick={handleHeartClick} className="flex flex-col items-center gap-2 hover:scale-110 transition-transform" aria-label="View action items and reminders">
                          <HeartScore score={healthScore} className="scale-125" />
                          <span className="text-xs text-gray-700 font-medium">My Heart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Render Reminder Overlay (with video playing behind)
              if (feedItem.type === 'reminder') {
                const bgVideo = feedItem.backgroundVideo;
                const bgDoctor = bgVideo.doctorId ? MOCK_DOCTORS[bgVideo.doctorId] : MOCK_DOCTOR;
                
                return (
                  <div key="reminder-card" className="snap-item">
                    <div className="h-full w-full flex items-center justify-center md:gap-4">
                      <div className="h-full w-full md:h-[calc(100vh-2rem)] md:max-h-[900px] md:w-auto md:aspect-[9/16] md:rounded-2xl md:overflow-hidden md:shadow-2xl relative">
                        {/* Video playing in background */}
                        <VideoCard
                          video={bgVideo}
                          doctor={bgDoctor}
                          isPersonalized={bgVideo.isPersonalized}
                          patientName={patientName}
                          isActive={isCurrentItem}
                          onComplete={handleVideoComplete}
                          onMessage={handleOpenChat}
                          onHeartClick={handleHeartClick}
                          healthScore={healthScore}
                        />
                        
                        {/* Reminder Overlay on top of video */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                          <div className="w-[90%] max-w-sm">
                            {/* Reminder Content */}
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl">
                              {/* Continuity badge - progression context */}
                              <div className="flex justify-center mb-3">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-[10px] font-semibold">
                                  <span>🔄</span>
                                  <span>Coming up next in your care plan</span>
                                </div>
                              </div>
                              
                              {/* Doctor Avatar */}
                              <div className="flex justify-center mb-3">
                                <div className="relative">
                                  <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-sky-100 shadow-lg">
                                    <Image
                                      src="/images/doctors/doctor-jack.jpg"
                                      alt="Dr. Jack Ellis"
                                      width={56}
                                      height={56}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                    <span className="text-[10px]">🩺</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Doctor Name with relationship context */}
                              <p className="text-center text-xs text-gray-500 mb-2">
                                Dr. Jack Ellis <span className="text-sky-600 font-medium">mentioned this</span>
                              </p>

                              {/* Title - more directive */}
                              <h2 className="text-base font-bold text-gray-900 text-center mb-1">
                                Your Next Step: Colonoscopy
                              </h2>
                              
                              {/* Context from last visit */}
                              <p className="text-gray-500 text-center text-[11px] mb-2 italic">
                                &ldquo;Based on your family history, let&apos;s get this scheduled.&rdquo;
                              </p>

                              {/* Due date badge */}
                              <div className="flex justify-center mb-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Due in 60 days</span>
                                </div>
                              </div>

                              {/* Score boost */}
                              <div className="flex justify-center mb-3">
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">
                                  +15% Health Score
                                </span>
                              </div>

                              {/* Schedule button - clear CTA */}
                              <button
                                onClick={() => setIsScheduleOpen(true)}
                                className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-sky-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                              >
                                <Calendar className="w-4 h-4" />
                                Schedule Now
                              </button>
                              
                              {/* Alternative action */}
                              <button
                                className="w-full mt-2 py-2 text-sky-600 font-medium text-sm hover:text-sky-700 transition-colors"
                              >
                                Learn What Happens Next →
                              </button>

                              {/* Swipe hint */}
                              <p className="text-center text-[10px] text-gray-400 mt-1">
                                Swipe to continue
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop sidebar - ORDER: Doctor → Discover → My Heart */}
                      <div className="hidden md:flex flex-col gap-6 items-center py-8">
                        {/* Doctor avatar - FIRST */}
                        {bgDoctor && (
                          <button
                            className="flex flex-col items-center gap-2 group"
                            onClick={handleOpenChat}
                            aria-label={`Message Dr. ${bgDoctor.name}`}
                          >
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-md hover:scale-110 transition-transform">
                                {bgDoctor.avatarUrl ? (
                                  <Image
                                    src={bgDoctor.avatarUrl}
                                    alt={bgDoctor.name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                      {bgDoctor.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                +
                              </div>
                            </div>
                            <span className="text-xs text-gray-700 font-medium max-w-[70px] truncate">Dr. {bgDoctor.name.split(' ')[0]}</span>
                          </button>
                        )}
                        {/* Discover - SECOND */}
                        <Link href="/discover" className="flex flex-col items-center gap-2 group" aria-label="Discover Doctors">
                          <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 hover:scale-110 transition-all duration-200">
                            <Search className="w-6 h-6 text-gray-700" />
                          </div>
                          <span className="text-xs text-gray-700 font-medium">Discover</span>
                        </Link>
                        {/* My Heart - THIRD */}
                        <button onClick={handleHeartClick} className="flex flex-col items-center gap-2 hover:scale-110 transition-transform" aria-label="View action items and reminders">
                          <HeartScore score={healthScore} className="scale-125" />
                          <span className="text-xs text-gray-700 font-medium">My Heart</span>
                        </button>
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
                        onComplete={handleVideoComplete}
                        onMessage={handleOpenChat}
                        onHeartClick={handleHeartClick}
                        onScheduleClick={() => setIsScheduleOpen(true)}
                        healthScore={healthScore}
                      />
                    </div>

                    {/* Desktop sidebar - buttons outside video */}
                    {/* ORDER: Doctor Profile → Discover → My Heart (builds relationship first) */}
                    <div className="hidden md:flex flex-col gap-6 items-center py-8">
                      {/* Doctor avatar - FIRST (relationship-focused) */}
                      {videoDoctor && (
                        <button
                          className="flex flex-col items-center gap-2 group"
                          onClick={handleOpenChat}
                          aria-label={`Message Dr. ${videoDoctor.name}`}
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
                        </button>
                      )}

                      {/* Discover button - SECOND */}
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

                      {/* Heart score - THIRD (My Heart) */}
                      <button
                        onClick={handleHeartClick}
                        className="flex flex-col items-center gap-2 hover:scale-110 transition-transform"
                        aria-label="View action items and reminders"
                      >
                        <HeartScore score={healthScore} className="scale-125" />
                        <span className="text-xs text-gray-700 font-medium">My Heart</span>
                      </button>

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

      {/* Action Items / Reminders Menu */}
      {isActionMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseActionMenu}
          />
          
          {/* Menu Panel */}
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Action Items & Reminders</h2>
                <button
                  onClick={handleCloseActionMenu}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Health Score Summary */}
              <div className={`mb-6 p-4 rounded-xl ${
                healthScore >= 100 
                  ? 'bg-gradient-to-r from-[#00BFA6]/10 to-[#00A6CE]/10 border border-[#00BFA6]/30' 
                  : 'bg-gradient-to-r from-primary-50 to-primary-100'
              }`}>
                <div className="flex items-center gap-4">
                  <HeartScore score={healthScore} className="scale-150" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Heart Health Score</h3>
                    <p className="text-sm text-gray-600">
                      {healthScore >= 100 ? "Perfect! You're at 100%! 🎉" :
                       healthScore >= 70 ? "Great progress!" : 
                       healthScore >= 40 ? "Keep it up!" : 
                       "Let's improve together"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Today's Actions</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">Schedule Colonoscopy</p>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">+10%</span>
                      </div>
                      <p className="text-sm text-gray-500">Book your appointment</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">Schedule Blood Test</p>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">+8%</span>
                      </div>
                      <p className="text-sm text-gray-500">Book your lab work</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">Schedule Follow-Up Visit</p>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">+15%</span>
                      </div>
                      <p className="text-sm text-gray-500">Book your next appointment</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">Schedule Stress Test</p>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">+12%</span>
                      </div>
                      <p className="text-sm text-gray-500">Book your cardiac screening</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseActionMenu}
                className="mt-6 w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
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