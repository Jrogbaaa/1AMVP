"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Play, MessageCircle, Heart, Filter, Check, User } from "lucide-react";
import { HeartScore } from "@/components/HeartScore";
import { TrustBadge } from "@/components/TrustBadge";
import { UserMenu } from "@/components/UserMenu";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { AuthPrompt } from "@/components/AuthPrompt";
import { useEngagement } from "@/hooks/useEngagement";
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
  // Auth state
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  // Engagement tracking
  const { trackInteraction } = useEngagement();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authPromptTrigger, setAuthPromptTrigger] = useState<"earned_trust" | "save_progress" | "set_reminder" | "personalized_content" | "follow_doctor">("follow_doctor");
  
  // Initialize with first three doctors already added
  const [addedDoctors, setAddedDoctors] = useState<Set<string>>(
    new Set([
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002", 
      "550e8400-e29b-41d4-a716-446655440003"
    ])
  );
  const healthScore = 55;

  const cardiologyTopics = ["all", "blood-pressure", "heart-disease", "arrhythmia", "cholesterol"];
  const specialties = ["all", "cardiology", "primary-care", "endocrinology", "gastroenterology", "pulmonology"];

  // Get patient name for display
  const patientName = session?.user?.name?.split(" ")[0] || "there";

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    trackInteraction();
    
    // If not authenticated and trying to add a new doctor, prompt to sign in
    if (!isAuthenticated && !addedDoctors.has(doctor.id)) {
      setAuthPromptTrigger("follow_doctor");
      setShowAuthPrompt(true);
      return;
    }
    
    setAddedDoctors((prev) => new Set(prev).add(doctor.id));
  };

  const handleAddDoctor = (e: React.MouseEvent, doctorId: string) => {
    e.preventDefault();
    e.stopPropagation();
    trackInteraction();
    
    // If not authenticated, prompt to sign in to follow doctors
    if (!isAuthenticated) {
      setAuthPromptTrigger("follow_doctor");
      setShowAuthPrompt(true);
      return;
    }
    
    setAddedDoctors((prev) => new Set(prev).add(doctorId));
  };

  const handleCloseAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="dashboard-container">
          <div className="flex items-center justify-between py-4">
            {/* Left: Logo and Nav */}
            <div className="flex items-center gap-6">
              <Link href="/feed" className="flex items-center">
                <Image
                  src="/images/1another-logo.png"
                  alt="1Another - Intelligent Health"
                  width={280}
                  height={80}
                  className="h-16 w-auto"
                  priority
                />
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/feed" className="text-gray-600 hover:text-gray-900 font-medium">
                  My Feed
                </Link>
                <Link href="/discover" className="text-primary-600 font-semibold border-b-2 border-primary-600 pb-1">
                  Discover
                </Link>
                <Link href="/my-health" className="text-gray-600 hover:text-gray-900 font-medium">
                  My Health
                </Link>
              </nav>
            </div>

            {/* Right: Insurance Logos, Heart Score, User Menu */}
            <div className="flex items-center gap-4">
              {/* Insurance Logos - hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                <div className="bg-[#003A70] rounded px-2 py-1">
                  <Image
                    src="/images/kaiser-logo.png"
                    alt="Kaiser Permanente"
                    width={80}
                    height={22}
                    className="h-5 w-auto"
                  />
                </div>
                <Image
                  src="/images/united-healthcare-logo.svg"
                  alt="UnitedHealthcare"
                  width={120}
                  height={28}
                  className="h-6 w-auto"
                />
              </div>
              {/* Heart Score - always visible */}
              <HeartScore score={healthScore} />
              {/* User Menu or Sign In button */}
              <div className="hidden sm:block">
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => {
                      setAuthPromptTrigger("save_progress");
                      setShowAuthPrompt(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-container py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Doctors
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Explore content from your experts
          </p>
          <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded-lg">
            <p className="text-gray-900 font-medium">
              Hey {patientName}, here are some other videos I recommend you take a look at:
            </p>
          </div>
        </div>

        {/* Instagram-style doctor profiles */}
        <div className="mb-8">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {MOCK_DOCTORS.filter((doctor) => {
              // Filter doctors by specialty
              if (selectedSpecialty === "all") return true;
              return doctor.specialty.toLowerCase() === selectedSpecialty.replace("-", " ");
            }).map((doctor) => {
              const isAdded = addedDoctors.has(doctor.id);
              return (
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
                    {/* Checkmark badge for added doctors */}
                    {isAdded && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                    {/* Add button for doctors not added yet */}
                    {!isAdded && (
                      <button
                        onClick={(e) => handleAddDoctor(e, doctor.id)}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm hover:bg-primary-600 transition-colors shadow-md border-2 border-white"
                        aria-label={`Add Dr. ${doctor.name}`}
                      >
                        +
                      </button>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900 max-w-[80px] truncate">
                      Dr. {doctor.name.split(' ')[1]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Specialty Filter - Horizontal scroll on mobile */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Specialty:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => {
                  setSelectedSpecialty(specialty);
                  // When selecting a specialty, update category too
                  if (specialty === "cardiology") {
                    setSelectedCategory("cardiology");
                  } else if (specialty !== "all") {
                    setSelectedCategory("all");
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedSpecialty === specialty
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {specialty === "all" 
                  ? "All" 
                  : specialty.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </button>
            ))}
          </div>

          {/* Cardiology topics filter */}
          {selectedSpecialty === "cardiology" && (
            <div className="mt-4 flex flex-wrap gap-2">
              {cardiologyTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedTopic === topic
                      ? "bg-primary-100 text-primary-700 border border-primary-300"
                      : "bg-white text-gray-600 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {topic === "all" ? "All Topics" : topic.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Featured content section - Cardiology */}
        {(selectedSpecialty === "all" || selectedSpecialty === "cardiology") && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cardiology
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

            </div>
          </div>
        )}

        {/* Nutrition and Exercise section */}
        {(selectedSpecialty === "all" || selectedSpecialty === "primary-care") && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nutrition and Exercise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}

        {/* Other Specialties sections */}
        {selectedSpecialty === "endocrinology" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Endocrinology
            </h2>
            <div className="p-8 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600">Content coming soon for Endocrinology</p>
            </div>
          </div>
        )}

        {selectedSpecialty === "gastroenterology" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gastroenterology
            </h2>
            <div className="p-8 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600">Content coming soon for Gastroenterology</p>
            </div>
          </div>
        )}

        {selectedSpecialty === "pulmonology" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Pulmonology
            </h2>
            <div className="p-8 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600">Content coming soon for Pulmonology</p>
            </div>
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
        className="fixed bottom-14 md:bottom-8 right-4 md:right-8 flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 hover:scale-110 transition-all duration-200 z-40"
        aria-label="Message your doctor"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </button>

      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around py-1.5">
          <Link href="/feed" className="flex flex-col items-center gap-0.5 text-gray-600">
            <Play className="w-5 h-5" />
            <span className="text-[10px] font-medium">My Feed</span>
          </Link>
          <Link href="/discover" className="flex flex-col items-center gap-0.5 text-primary-600">
            <div className="w-5 h-5 rounded-full border-2 border-primary-600 flex items-center justify-center">
              <Play className="w-2.5 h-2.5" />
            </div>
            <span className="text-[10px] font-medium">Discover</span>
          </Link>
          <Link href="/my-health" className="flex flex-col items-center gap-0.5 text-gray-600">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">My Health</span>
          </Link>
        </div>
      </nav>

      {/* Auth Prompt */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={handleCloseAuthPrompt}
        trigger={authPromptTrigger}
      />

      {/* Chat onboarding */}
      <ChatOnboarding
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        doctor={selectedDoctor || MOCK_DOCTORS[0]}
        patientName={patientName}
        userId={session?.user?.id || "anonymous"}
      />
    </div>
  );
}
