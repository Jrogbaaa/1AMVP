"use client";

import { useState } from "react";
import { Play, MessageCircle, Heart } from "lucide-react";
import { HeartScore } from "@/components/HeartScore";
import { TrustBadge } from "@/components/TrustBadge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import Image from "next/image";
import Link from "next/link";
import type { Doctor } from "@/lib/types";

// Mock doctor profiles data
const MOCK_DOCTORS: Doctor[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Sarah Johnson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart Health Clinic",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Michael Chen",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80",
    clinicName: "Boston Cardiology Center",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Emily Rodriguez",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80",
    clinicName: "Advanced Heart Care",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "James Martinez",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80",
    clinicName: "Cardiovascular Associates",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Lisa Thompson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80&sat=-100",
    clinicName: "Heart & Vascular Institute",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "David Kim",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80",
    clinicName: "Metro Heart Specialists",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Priya Patel",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&q=80",
    clinicName: "Cardiac Care Center",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "Robert Williams",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart Health Partners",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "Amanda Foster",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    clinicName: "Premier Cardiology",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    name: "Daniel Lee",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&q=80",
    clinicName: "Integrated Heart Solutions",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    name: "Jennifer Adams",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
    clinicName: "Wellness Heart Clinic",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    name: "Thomas Brown",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
    clinicName: "Comprehensive Cardiac Care",
    createdAt: new Date().toISOString(),
  },
];

export default function DiscoverPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const healthScore = 55;

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
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
                  <Link href="/discover" className="text-primary-600 font-semibold border-b-2 border-primary-600 pb-1">
                    Discover
                  </Link>
                  <Link href="/my-heart" className="text-gray-600 hover:text-gray-900 font-medium">
                    My Heart
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
            Discover Doctors
          </h1>
          <p className="text-gray-600 text-lg">
            Explore content from leading cardiologists
          </p>
        </div>

        {/* Instagram-style doctor profiles */}
        <div className="mb-8">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {MOCK_DOCTORS.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/feed?doctor=${doctor.id}`}
                className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer"
                onClick={() => handleDoctorClick(doctor)}
              >
                <div className="relative">
                  {/* Gradient ring */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 via-pink-500 to-yellow-500 p-[3px] group-hover:scale-110 transition-transform duration-200">
                    <div className="w-full h-full rounded-full bg-white p-[3px]">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        {doctor.avatarUrl ? (
                          <Image
                            src={doctor.avatarUrl}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              {doctor.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* New badge for featured doctors */}
                  {parseInt(doctor.id.slice(-1)) <= 3 && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      NEW
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-900 max-w-[80px] truncate">
                    Dr. {doctor.name.split(' ')[1]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured content section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Educational Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured video cards */}
            <Link
              href="/feed"
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="relative aspect-video mb-4 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=720&h=480&fit=crop&q=80"
                  alt="Understanding Blood Pressure"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                  3:00
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-2">
                  Heart Health
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  Understanding Blood Pressure
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  Learn what blood pressure numbers mean and how to monitor your heart health.
                </p>
              </div>
            </Link>

            <Link
              href="/feed"
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="relative aspect-video mb-4 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=720&h=480&fit=crop&q=80"
                  alt="Heart-Healthy Diet"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                  4:00
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-2">
                  Nutrition
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  Heart-Healthy Diet Tips
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  Simple and practical nutrition tips for maintaining a healthy heart.
                </p>
              </div>
            </Link>

            <Link
              href="/feed"
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="relative aspect-video mb-4 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=720&h=480&fit=crop&q=80"
                  alt="Exercise for Heart Health"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
                  3:20
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-2">
                  Exercise
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  Exercise for Heart Health
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  Safe and effective exercises to strengthen your cardiovascular system.
                </p>
              </div>
            </Link>
          </div>
        </div>

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
            <span className="text-xs font-medium">My Feed</span>
          </Link>
          <Link href="/discover" className="flex flex-col items-center gap-1 text-primary-600">
            <div className="w-6 h-6 rounded-full border-2 border-primary-600 flex items-center justify-center">
              <Play className="w-3 h-3" />
            </div>
            <span className="text-xs font-medium">Discover</span>
          </Link>
          <Link href="/my-heart" className="flex flex-col items-center gap-1 text-gray-600">
            <Heart className="w-6 h-6" />
            <span className="text-xs font-medium">My Heart</span>
          </Link>
        </div>
      </nav>

      {/* Chat onboarding */}
      <ChatOnboarding
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        doctor={selectedDoctor || MOCK_DOCTORS[0]}
        patientName="Dave"
        userId="demo-user"
      />
      </div>
    </ProtectedRoute>
  );
}
