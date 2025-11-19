"use client";

import { useState } from "react";
import { Search, Filter, Play, MessageCircle } from "lucide-react";
import { HeartScore } from "@/components/HeartScore";
import { TrustBadge } from "@/components/TrustBadge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import Image from "next/image";
import Link from "next/link";
import type { Video, Doctor } from "@/lib/types";

// Mock data
const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Understanding Blood Pressure",
    description: "Learn what blood pressure numbers mean and how to monitor your heart health.",
    videoUrl: "/videos/blood-pressure.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1280&h=720&fit=crop&q=80",
    duration: 180,
    category: "Heart Health",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Heart-Healthy Diet Tips",
    description: "Simple and practical nutrition tips for maintaining a healthy heart.",
    videoUrl: "/videos/diet.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1280&h=720&fit=crop&q=80",
    duration: 240,
    category: "Nutrition",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Medication Safety",
    description: "Essential tips for taking your medications safely and effectively.",
    videoUrl: "/videos/medication.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1280&h=720&fit=crop&q=80",
    duration: 150,
    category: "Medication",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Exercise Guidelines",
    description: "Safe and effective exercises for cardiovascular health.",
    videoUrl: "/videos/exercise.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&h=720&fit=crop&q=80",
    duration: 200,
    category: "Exercise",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Stress Management",
    description: "Techniques to reduce stress and improve heart health.",
    videoUrl: "/videos/stress.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1280&h=720&fit=crop&q=80",
    duration: 220,
    category: "Mental Health",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Sleep and Heart Health",
    description: "How quality sleep impacts your cardiovascular system.",
    videoUrl: "/videos/sleep.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?w=1280&h=720&fit=crop&q=80",
    duration: 190,
    category: "Wellness",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
];

const CATEGORIES = ["All", "Heart Health", "Nutrition", "Medication", "Exercise", "Mental Health", "Wellness"];

const MOCK_DOCTOR: Doctor = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Sarah Johnson",
  specialty: "Cardiology",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
  clinicName: "Heart Health Clinic",
  createdAt: new Date().toISOString(),
};

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const healthScore = 55;

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const filteredVideos = MOCK_VIDEOS.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="dashboard-container">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Link href="/feed" className="text-2xl font-bold text-primary-600">
                  1Another
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/feed" className="text-gray-600 hover:text-gray-900 font-medium">
                    My Feed
                  </Link>
                  <Link href="/library" className="text-primary-600 font-semibold border-b-2 border-primary-600 pb-1">
                    Library
                  </Link>
                  <Link href="/account" className="text-gray-600 hover:text-gray-900 font-medium">
                    Account
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <HeartScore score={healthScore} showMessage />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

      {/* Main content */}
      <main className="dashboard-container py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Video Library
          </h1>
          <p className="text-gray-600 text-lg">
            Browse educational content tailored to your health needs
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="text-gray-500 w-5 h-5 flex-shrink-0" />
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/library/${video.id}`}
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video mb-4 bg-gray-200 rounded-lg overflow-hidden">
                {video.thumbnailUrl ? (
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 via-blue-100 to-primary-200">
                    <Play className="w-16 h-16 text-primary-600" />
                  </div>
                )}
                {/* Duration badge */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                )}
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                {/* Category badge */}
                {video.category && (
                  <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-2">
                    {video.category}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* No results */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Trust badge */}
        <div className="mt-12 flex justify-center">
          <TrustBadge />
        </div>
      </main>

      {/* Floating message button */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 flex items-center justify-center w-14 h-14 bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 hover:scale-110 transition-all duration-200 z-40"
        aria-label="Message your doctor"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around py-3">
          <Link href="/feed" className="flex flex-col items-center gap-1 text-gray-600">
            <Play className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </Link>
          <Link href="/library" className="flex flex-col items-center gap-1 text-primary-600">
            <Search className="w-6 h-6" />
            <span className="text-xs font-medium">Library</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-1 text-gray-600">
            <div className="w-6 h-6 rounded-full bg-gray-300" />
            <span className="text-xs font-medium">Account</span>
          </Link>
        </div>
      </nav>

      {/* Chat onboarding */}
      <ChatOnboarding
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        doctor={MOCK_DOCTOR}
        patientName="Dave"
        userId="demo-user"
      />
      </div>
    </ProtectedRoute>
  );
}

