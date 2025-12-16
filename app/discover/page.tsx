"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Play, MessageCircle, Heart, Filter, Check, User, Lock, Crown, Plus } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { HeartScore } from "@/components/HeartScore";
import { TrustBadge } from "@/components/TrustBadge";
import { UserMenu } from "@/components/UserMenu";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { AuthPrompt } from "@/components/AuthPrompt";
import { useEngagement } from "@/hooks/useEngagement";
import Image from "next/image";
import Link from "next/link";
import type { Doctor } from "@/lib/types";

// Extended doctor type with insurer info
interface ExtendedDoctor extends Doctor {
  insurer?: string;
}

// First five doctors are free tier, rest are premium
const FREE_TIER_DOCTOR_IDS = [
  "550e8400-e29b-41d4-a716-446655440001",
  "550e8400-e29b-41d4-a716-446655440002",
  "550e8400-e29b-41d4-a716-446655440003",
  "550e8400-e29b-41d4-a716-446655440004",
  "550e8400-e29b-41d4-a716-446655440005",
];

// Mock doctor profiles data
const MOCK_DOCTORS: ExtendedDoctor[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Sarah Johnson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart Health Clinic",
    insurer: "Kaiser",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Michael Chen",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80",
    clinicName: "Boston Cardiology Center",
    insurer: "UnitedHealthcare",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Emily Rodriguez",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80",
    clinicName: "Advanced Heart Care",
    insurer: "Aetna",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "James Martinez",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80",
    clinicName: "Cardiovascular Associates",
    insurer: "Cigna",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Lisa Thompson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80&sat=-100",
    clinicName: "Heart & Vascular Institute",
    insurer: "Blue Cross",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "David Kim",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80",
    clinicName: "Metro Heart Specialists",
    insurer: "Humana",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Priya Patel",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&q=80",
    clinicName: "Cardiac Care Center",
    insurer: "Kaiser",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "Robert Williams",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart Health Partners",
    insurer: "Anthem",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "Amanda Foster",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    clinicName: "Premier Cardiology",
    insurer: "UnitedHealthcare",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    name: "Daniel Lee",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&q=80",
    clinicName: "Integrated Heart Solutions",
    insurer: "Cigna",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    name: "Jennifer Adams",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
    clinicName: "Wellness Heart Clinic",
    insurer: "Aetna",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    name: "Thomas Brown",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
    clinicName: "Comprehensive Cardiac Care",
    insurer: "Blue Cross",
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
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  // Initialize with first three doctors already added
  const [addedDoctors, setAddedDoctors] = useState<Set<string>>(
    new Set([
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002", 
      "550e8400-e29b-41d4-a716-446655440003",
      "550e8400-e29b-41d4-a716-446655440004",
      "550e8400-e29b-41d4-a716-446655440005"
    ])
  );

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

  const handleDoctorClick = (doctor: Doctor, isPremium: boolean) => {
    // If premium doctor, show upgrade prompt
    if (isPremium) {
      setShowUpgradePrompt(true);
      return;
    }
    
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

  const handleAddDoctor = (e: React.MouseEvent, doctorId: string, isPremium: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If premium doctor, show upgrade prompt
    if (isPremium) {
      setShowUpgradePrompt(true);
      return;
    }
    
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
    <div className="min-h-screen bg-gray-100">
      {/* Compact Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-3 md:px-6">
          <div className="flex items-center justify-between py-2 md:py-4">
            {/* Left: Logo */}
            <Link href="/feed" className="flex flex-col items-center">
              <Image
                src="/images/1another-logo.png?v=2"
                alt="1Another"
                width={140}
                height={40}
                className="h-8 md:h-12 w-auto"
                priority
                unoptimized
              />
              <span className="text-[#00BCD4] font-semibold text-[10px] md:text-sm tracking-wide">
                Intelligent Health
              </span>
            </Link>
            
            {/* Desktop Nav - hidden on mobile */}
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

            {/* Right: Heart Score + Menu */}
            <div className="flex items-center gap-2 md:gap-4">
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
              <HeartScore score={55} />
              <div className="hidden sm:block">
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => {
                      setAuthPromptTrigger("save_progress");
                      setShowAuthPrompt(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - tighter padding on mobile */}
      <main className="px-3 md:px-6 py-3 md:py-6 pb-16 max-w-7xl mx-auto">
        {/* Header Card - Modular */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Your Doctors
          </h1>
          <p className="text-gray-500 text-sm">
            Explore content from your experts
          </p>
        </div>

        {/* Doctor Profiles - Modular Card */}
        <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {MOCK_DOCTORS.filter((doctor) => {
              // Filter doctors by specialty
              if (selectedSpecialty === "all") return true;
              return doctor.specialty.toLowerCase() === selectedSpecialty.replace("-", " ");
            }).map((doctor, index, filteredArray) => {
              const isAdded = addedDoctors.has(doctor.id);
              const isPremium = !FREE_TIER_DOCTOR_IDS.includes(doctor.id);
              const prevDoctor = index > 0 ? filteredArray[index - 1] : null;
              const isPrevFree = prevDoctor ? FREE_TIER_DOCTOR_IDS.includes(prevDoctor.id) : false;
              const isFirstPremium = isPremium && isPrevFree;
              
              return (
                <React.Fragment key={doctor.id}>
                  {/* Suggested Doctor - appears before first premium doctor */}
                  {isFirstPremium && (
                    <Link
                      href="/feed"
                      className="flex flex-col items-center gap-1 flex-shrink-0 group cursor-pointer"
                      onClick={() => {
                        setAddedDoctors((prev) => new Set(prev).add("550e8400-e29b-41d4-a716-446655440006"));
                        trackInteraction();
                      }}
                    >
                      <div className="relative">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-sky-500 via-blue-500 to-sky-600 p-[2px] group-hover:scale-105 transition-transform duration-200">
                          <div className="w-full h-full rounded-full bg-white p-[2px]">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                              <Image
                                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80"
                                alt="Dr. David Kim"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                        {/* Blue plus badge */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center shadow border-2 border-white">
                          <Plus className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      </div>
                      <p className="text-[10px] md:text-xs font-medium text-gray-700 max-w-[70px] truncate text-center">
                        Dr. Kim
                      </p>
                      <p className="text-[8px] text-gray-500 max-w-[70px] truncate text-center">
                        Metro Heart
                      </p>
                      <p className="text-[8px] text-sky-600 font-medium max-w-[70px] truncate text-center">
                        + Add
                      </p>
                    </Link>
                  )}
                  <div
                    className={`flex flex-col items-center gap-1 flex-shrink-0 group cursor-pointer ${isPremium ? 'opacity-60' : ''}`}
                    onClick={(e) => {
                      if (isPremium) {
                        e.preventDefault();
                        setShowUpgradePrompt(true);
                      }
                    }}
                  >
                    {isPremium ? (
                      // Premium doctor - not clickable to feed
                      <div className="flex flex-col items-center gap-1">
                        <div className="relative">
                          {/* Grayscale ring for premium */}
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-gray-400 via-gray-300 to-gray-400 p-[2px]">
                            <div className="w-full h-full rounded-full bg-white p-[2px]">
                              <div className="relative w-full h-full rounded-full overflow-hidden">
                                {doctor.avatarUrl ? (
                                  <Image
                                    src={doctor.avatarUrl}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover grayscale"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                                    <span className="text-white text-lg font-bold">
                                      {doctor.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Premium lock badge */}
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow border-2 border-white">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <p className="text-[10px] md:text-xs font-medium text-gray-400 max-w-[70px] truncate text-center">
                          Dr. {doctor.name.split(' ')[1]}
                        </p>
                        <p className="text-[8px] text-gray-400 max-w-[70px] truncate text-center">
                          {doctor.clinicName}
                        </p>
                        {doctor.insurer && (
                          <p className="text-[8px] text-gray-400 max-w-[70px] truncate text-center">
                            {doctor.insurer}
                          </p>
                        )}
                      </div>
                    ) : (
                    // Free tier doctor - clickable
                    <Link
                      href={`/feed?doctor=${doctor.id}`}
                      className="flex flex-col items-center gap-1"
                      onClick={() => handleDoctorClick(doctor, false)}
                    >
                      <div className="relative">
                        {/* Gradient ring - smaller on mobile */}
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-primary-500 via-pink-500 to-yellow-500 p-[2px] group-hover:scale-105 transition-transform duration-200">
                          <div className="w-full h-full rounded-full bg-white p-[2px]">
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
                                  <span className="text-white text-lg font-bold">
                                    {doctor.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Checkmark badge */}
                        {isAdded && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow border-2 border-white">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                        {/* Add button */}
                        {!isAdded && (
                          <button
                            onClick={(e) => handleAddDoctor(e, doctor.id, false)}
                            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs hover:bg-primary-600 transition-colors shadow border-2 border-white"
                            aria-label={`Add Dr. ${doctor.name}`}
                          >
                            +
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] md:text-xs font-medium text-gray-700 max-w-[70px] truncate text-center">
                        Dr. {doctor.name.split(' ')[1]}
                      </p>
                      <p className="text-[8px] text-gray-500 max-w-[70px] truncate text-center">
                        {doctor.clinicName}
                      </p>
                      {doctor.insurer && (
                        <p className="text-[8px] text-gray-500 max-w-[70px] truncate text-center">
                          {doctor.insurer}
                        </p>
                      )}
                    </Link>
                  )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Specialty Filter - Modular Card */}
        <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">Filter:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => {
                  setSelectedSpecialty(specialty);
                  if (specialty === "cardiology") {
                    setSelectedCategory("cardiology");
                  } else if (specialty !== "all") {
                    setSelectedCategory("all");
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedSpecialty === specialty
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cardiologyTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    selectedTopic === topic
                      ? "bg-primary-100 text-primary-700 border border-primary-200"
                      : "bg-gray-50 text-gray-500 border border-gray-200"
                  }`}
                >
                  {topic === "all" ? "All Topics" : topic.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cardiology Videos - Modular Card */}
        {(selectedSpecialty === "all" || selectedSpecialty === "cardiology") && (
          <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              Cardiology
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80" alt="Understanding Blood Pressure" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">3:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-semibold rounded-lg mb-1">Heart Health</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Understanding Blood Pressure</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Johnson explains BP</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80" alt="Heart-Healthy Diet" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-lg mb-1">Nutrition</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Heart-Healthy Diet Tips</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Chen on nutrition</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80" alt="Managing Cholesterol" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">5:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-semibold rounded-lg mb-1">Cholesterol</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Managing Cholesterol</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Rodriguez explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80" alt="Heart Rate Zones" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:15</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-semibold rounded-lg mb-1">Exercise</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Heart Rate Zones</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Martinez on exercise</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80" alt="Understanding Arrhythmia" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">6:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-semibold rounded-lg mb-1">Arrhythmia</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Understanding Arrhythmia</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Kim explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&q=80" alt="Stress and Heart Disease" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">3:45</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded-lg mb-1">Stress</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Stress & Heart Disease</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Patel on stress</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Primary Care - Modular Card */}
        {(selectedSpecialty === "all" || selectedSpecialty === "primary-care") && (
          <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              Primary Care
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&q=80" alt="Annual Checkup" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">3:20</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-semibold rounded-lg mb-1">Checkup</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Annual Physical Guide</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Williams explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80" alt="Preventive Care" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:45</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-lg mb-1">Prevention</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Preventive Screenings</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Foster on prevention</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&q=80" alt="Vaccination Guide" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">2:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-lg mb-1">Vaccines</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Vaccination Schedule</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Lee explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80" alt="Wellness Tips" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">5:15</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-lg mb-1">Wellness</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Daily Wellness Tips</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Adams on wellness</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80" alt="Sleep Health" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">8:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                  </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-semibold rounded-lg mb-1">Sleep</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Better Sleep Habits</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Brown explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80" alt="Stress Management" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-semibold rounded-lg mb-1">Stress</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">Managing Stress</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Johnson on stress</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Endocrinology Videos */}
        {(selectedSpecialty === "all" || selectedSpecialty === "endocrinology") && (
          <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">Endocrinology</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80" alt="Diabetes Management" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-lg mb-1">Diabetes</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Diabetes Management</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Chen on diabetes</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80" alt="Thyroid Health" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">3:45</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-semibold rounded-lg mb-1">Thyroid</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Thyroid Health</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Rodriguez explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80" alt="Hormone Balance" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">5:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-pink-50 text-pink-600 text-[10px] font-semibold rounded-lg mb-1">Hormones</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Hormone Balance</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Martinez on hormones</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80" alt="Metabolic Health" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:15</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-semibold rounded-lg mb-1">Metabolism</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Metabolic Health</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Johnson explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80" alt="Insulin Resistance" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">6:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-semibold rounded-lg mb-1">Insulin</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Insulin Resistance</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Kim explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&q=80" alt="Adrenal Health" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">3:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded-lg mb-1">Adrenals</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Adrenal Health</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Patel on adrenals</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Gastroenterology Videos */}
        {(selectedSpecialty === "all" || selectedSpecialty === "gastroenterology") && (
          <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">Gastroenterology</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&q=80" alt="Gut Health Basics" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:15</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-semibold rounded-lg mb-1">Gut Health</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Gut Health Basics</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Williams explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80" alt="IBS Management" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">5:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-semibold rounded-lg mb-1">IBS</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">IBS Management</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Foster on IBS</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&q=80" alt="Digestive Health" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">3:45</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-600 text-[10px] font-semibold rounded-lg mb-1">Digestion</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Digestive Health</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Lee explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80" alt="Colonoscopy Prep" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-lg mb-1">Screening</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Colonoscopy Prep</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Adams explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80" alt="Acid Reflux" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">5:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-lg mb-1">GERD</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Managing Acid Reflux</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Brown on GERD</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80" alt="Probiotics" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">3:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-lg mb-1">Probiotics</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Probiotics Guide</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Chen on probiotics</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Pulmonology Videos */}
        {(selectedSpecialty === "all" || selectedSpecialty === "pulmonology") && (
          <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">Pulmonology</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80" alt="Breathing Exercises" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">6:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-semibold rounded-lg mb-1">Breathing</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Breathing Exercises</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Rodriguez on breathing</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80" alt="Asthma Management" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded-lg mb-1">Asthma</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Asthma Management</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Martinez on asthma</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80" alt="Sleep Apnea" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">5:15</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-semibold rounded-lg mb-1">Sleep</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Sleep Apnea</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Kim on sleep apnea</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&q=80" alt="COPD Management" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:45</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-semibold rounded-lg mb-1">COPD</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">COPD Management</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Patel on COPD</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80" alt="Lung Health" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">3:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-lg mb-1">Prevention</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Lung Health Tips</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Johnson explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80" alt="Allergy Management" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-semibold rounded-lg mb-1">Allergies</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Respiratory Allergies</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Chen on allergies</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Trust badge */}
        <div className="mt-4 flex justify-center">
          <TrustBadge />
        </div>
      </main>

      {/* Floating message button with notification - Mobile */}
      <button
        onClick={handleOpenChat}
        className="md:hidden fixed bottom-14 right-4 flex items-center justify-center w-14 h-14 bg-[#37A9D9] rounded-full shadow-lg hover:bg-[#2A8DBF] active:scale-95 transition-all duration-200 z-40"
        aria-label="Message your doctor"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          2
        </span>
      </button>

      {/* Desktop Floating message button */}
      <button
        onClick={handleOpenChat}
        className="hidden md:flex fixed bottom-8 right-8 items-center justify-center w-14 h-14 bg-[#37A9D9] rounded-full shadow-lg hover:bg-[#2A8DBF] hover:scale-110 transition-all duration-200 z-40"
        aria-label="Message your doctor"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          2
        </span>
      </button>

      {/* Mobile navigation */}
      <MobileBottomNav />

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

      {/* Premium Upgrade Prompt */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUpgradePrompt(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl">
            <button
              onClick={() => setShowUpgradePrompt(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Unlock Premium Doctors
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Upgrade to premium to access all doctors and their personalized content. Get unlimited access to expert health guidance.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                >
                  Upgrade to Premium
                </button>
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="w-full py-2 px-4 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
