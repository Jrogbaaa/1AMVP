"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";
import { RateLimitMessage } from "@/components/RateLimitMessage";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Calendar, Heart } from "lucide-react";
import type { Video, Doctor } from "@/lib/types";

// Mock data - in production, this would come from your database
const MOCK_DOCTOR: Doctor = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Sarah Johnson",
  specialty: "Cardiology",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
  clinicName: "Heart Health Clinic",
  createdAt: new Date().toISOString(),
};

const MOCK_VIDEOS: Video[] = [
  {
    id: "750e8400-e29b-41d4-a716-446655440001",
    title: "Your Follow-Up from Dr. Johnson",
    description: "Here's your personalized follow-up about your recent visit and next steps for your care.",
    videoUrl: "/videoplayback.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=720&h=1280&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=720&h=1280&fit=crop&q=80",
    duration: 120,
    category: "Follow-Up",
    tags: ["personalized", "follow-up", "cardiology"],
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    isPersonalized: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440002",
    title: "Understanding Blood Pressure",
    description: "Dr. Sarah explains what blood pressure numbers mean and how to monitor your heart health.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=720&h=1280&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=720&h=1280&fit=crop&q=80",
    duration: 180,
    category: "Education",
    tags: ["blood pressure", "heart health", "basics"],
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440003",
    title: "Heart-Healthy Diet Tips",
    description: "Dr. Johnson shares simple and practical nutrition tips for maintaining a healthy heart.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=720&h=1280&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=720&h=1280&fit=crop&q=80",
    duration: 240,
    category: "Education",
    tags: ["nutrition", "diet", "heart health"],
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440004",
    title: "Medication Reminders",
    description: "Dr. Martinez explains why taking your medication on schedule is crucial for your health.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=720&h=1280&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=720&h=1280&fit=crop&q=80",
    duration: 150,
    category: "Education",
    tags: ["medication", "compliance", "tips"],
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440005",
    title: "Exercise for Heart Health",
    description: "Dr. Chen demonstrates safe and effective exercises to strengthen your cardiovascular system.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=720&h=1280&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=720&h=1280&fit=crop&q=80",
    duration: 200,
    category: "Education",
    tags: ["exercise", "cardio", "fitness"],
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
];

const FeedContent = () => {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("p");
  const doctorId = searchParams.get("d");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [healthScore, setHealthScore] = useState(55); // Start at 55%
  const [scrollCount, setScrollCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxScrolls = 20;
  const remainingScrolls = Math.max(0, maxScrolls - scrollCount);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);

      if (newIndex !== currentIndex && newIndex < MOCK_VIDEOS.length) {
        setCurrentIndex(newIndex);
        setScrollCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= maxScrolls) {
            setIsRateLimited(true);
          }
          return newCount;
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    // Update health score when onboarding is completed
    setHealthScore((prev) => Math.min(prev + 10, 100)); // +10% for completing onboarding
  };

  const handleHeartClick = () => {
    setIsActionMenuOpen(true);
  };

  const handleCloseActionMenu = () => {
    setIsActionMenuOpen(false);
  };

  const handleVideoComplete = () => {
    // Update health score when video is completed
    if (currentIndex === 0) {
      // Completed doctor's personalized video - big boost!
      setHealthScore((prev) => Math.min(prev + 20, 100));
    } else {
      // Completed educational video - small boost
      setHealthScore((prev) => Math.min(prev + 5, 100));
    }
  };

  return (
    <>
      <div className="feed-container relative">
        {/* Navigation buttons - left side */}
        <div className="absolute left-4 bottom-48 z-50 flex flex-col gap-3">
          <Link
            href="/account"
            className="flex items-center justify-center w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group"
            aria-label="Schedule Follow-Up"
            tabIndex={0}
          >
            <Calendar className="w-6 h-6 text-primary-600 group-hover:text-primary-700" />
          </Link>
        </div>

        {/* Rate limit warning */}
        {remainingScrolls <= 5 && remainingScrolls > 0 && !isRateLimited && (
          <RateLimitMessage remainingScrolls={remainingScrolls} />
        )}

        {/* Feed container */}
        {!isRateLimited ? (
          <div ref={containerRef} className="snap-container">
            {MOCK_VIDEOS.map((video, index) => (
              <div key={video.id} className="snap-item">
                <VideoCard
                  video={video}
                  doctor={index === 0 ? MOCK_DOCTOR : undefined}
                  isPersonalized={index === 0}
                  patientName="Dave"
                  isActive={currentIndex === index}
                  onComplete={handleVideoComplete}
                  onMessage={handleOpenChat}
                  onHeartClick={handleHeartClick}
                  healthScore={healthScore}
                />
              </div>
            ))}
          </div>
        ) : (
          <RateLimitMessage />
        )}
      </div>

      {/* Chat onboarding */}
      <ChatOnboarding
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        doctor={MOCK_DOCTOR}
        patientName="Dave"
        userId={patientId || "demo-user"}
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
              <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <Heart
                      className="absolute inset-0 w-16 h-16 text-gray-300"
                      strokeWidth={2}
                      fill="none"
                    />
                    <div 
                      className="absolute inset-0"
                      style={{ clipPath: `inset(${100 - healthScore}% 0 0 0)` }}
                    >
                      <Heart
                        className={`w-16 h-16 ${
                          healthScore >= 70 ? "text-green-500" : 
                          healthScore >= 40 ? "text-yellow-500" : 
                          "text-red-500"
                        }`}
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-lg">
                      {healthScore}%
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Heart Health Score</h3>
                    <p className="text-sm text-gray-600">
                      {healthScore >= 70 ? "Great progress!" : 
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
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Take morning medication</p>
                      <p className="text-sm text-gray-500">Due at 9:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">30-minute walk</p>
                      <p className="text-sm text-gray-500">Recommended daily activity</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Log blood pressure</p>
                      <p className="text-sm text-gray-500">Morning reading</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Watch educational video</p>
                      <p className="text-sm text-gray-500">Learn about heart-healthy diet</p>
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
    <ProtectedRoute>
      <Suspense fallback={
        <div className="feed-container flex items-center justify-center">
          <div className="text-white text-xl">Loading your personalized feed...</div>
        </div>
      }>
        <FeedContent />
      </Suspense>
    </ProtectedRoute>
  );
}

