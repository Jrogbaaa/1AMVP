"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { VideoCard } from "@/components/VideoCard";
import { RateLimitMessage } from "@/components/RateLimitMessage";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { HeartScore } from "@/components/HeartScore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import type { Video, Doctor, FeedItem } from "@/lib/types";

// Mock data - in production, this would come from your database
const MOCK_DOCTOR: Doctor = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Sarah Johnson",
  specialty: "Cardiology",
  avatarUrl: "https://i.pravatar.cc/150?img=5", // Female doctor avatar placeholder
  clinicName: "Heart Health Clinic",
  createdAt: new Date().toISOString(),
};

const MOCK_VIDEOS: Video[] = [
  {
    id: "750e8400-e29b-41d4-a716-446655440001",
    title: "Your Follow-Up from Dr. Johnson",
    description: "Here's your personalized follow-up about your recent visit and next steps for your care.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://picsum.photos/seed/doctor1/720/1280", // Medical theme
    posterUrl: "https://picsum.photos/seed/doctor1/720/1280",
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
    description: "Learn what blood pressure numbers mean and how to monitor your heart health.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://picsum.photos/seed/bp123/720/1280", // Blood pressure theme
    duration: 180,
    category: "Education",
    tags: ["blood pressure", "heart health", "basics"],
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440003",
    title: "Heart-Healthy Diet Tips",
    description: "Simple and practical nutrition tips for maintaining a healthy heart.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://picsum.photos/seed/diet456/720/1280", // Diet theme
    duration: 240,
    category: "Education",
    tags: ["nutrition", "diet", "heart health"],
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440004",
    title: "Medication Reminders",
    description: "Why taking your medication on schedule is crucial for your health.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://picsum.photos/seed/meds789/720/1280", // Medication theme
    duration: 150,
    category: "Education",
    tags: ["medication", "compliance", "tips"],
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440005",
    title: "Exercise for Heart Health",
    description: "Safe and effective exercises to strengthen your cardiovascular system.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://picsum.photos/seed/exercise321/720/1280", // Exercise theme
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
        {/* User menu in top left */}
        <div className="absolute top-4 left-4 z-40">
          <UserMenu />
        </div>

        {/* Heart score in top right */}
        <div className="absolute top-4 right-4 z-40">
          <HeartScore score={healthScore} />
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

