"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Play, MessageCircle, Filter, Check, User, Crown, Plus, Search, TrendingUp } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { TrustBadge } from "@/components/TrustBadge";
import { MessagesDrawer } from "@/components/MessagesDrawer";
import { UserMenu } from "@/components/UserMenu";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { AuthPrompt } from "@/components/AuthPrompt";
import { VerticalVideoPreview } from "@/components/VerticalVideoPreview";
import { useEngagement } from "@/hooks/useEngagement";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { Doctor, Video } from "@/lib/types";

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
    name: "Jack Ellis",
    specialty: "Cardiology",
    avatarUrl: "/images/doctors/doctor-jack.jpg",
    clinicName: "1Another Cardiology",
    insurer: "Kaiser",
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

// Trending vertical video previews for TikTok-style display
const TRENDING_VIDEOS: Video[] = [
  {
    id: "trend-001",
    title: "Why Your Heart Beats Faster at Night",
    description: "Dr. Johnson explains the surprising reason your heart rate changes while you sleep.",
    videoUrl: "/videos/doctor-jack-video-1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=600&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=600&fit=crop&q=80",
    duration: 45,
    category: "Cardiology",
    tags: ["heart rate", "sleep", "health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440001",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "trend-002",
    title: "The #1 Sign of Heart Disease",
    description: "Learn the early warning sign most people miss.",
    videoUrl: "/videos/doctor-jack-video-2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop&q=80",
    duration: 60,
    category: "Cardiology",
    tags: ["heart disease", "symptoms", "prevention"],
    doctorId: "550e8400-e29b-41d4-a716-446655440002",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "trend-003",
    title: "Anxiety or Heart Attack?",
    description: "How to tell the difference between anxiety symptoms and cardiac events.",
    videoUrl: "/videos/doctor-jack-video-3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=600&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=600&fit=crop&q=80",
    duration: 52,
    category: "Mental Health",
    tags: ["anxiety", "heart health", "mental health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440006",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "trend-004",
    title: "Foods That Heal Your Heart",
    description: "5 superfoods cardiologists recommend for heart health.",
    videoUrl: "/videos/doctor-jack-video-1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=600&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=600&fit=crop&q=80",
    duration: 38,
    category: "Nutrition",
    tags: ["nutrition", "diet", "heart health"],
    doctorId: "550e8400-e29b-41d4-a716-446655440003",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "trend-005",
    title: "Stress is Killing Your Heart",
    description: "The science behind stress-related heart problems.",
    videoUrl: "/videos/doctor-jack-video-2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=600&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=600&fit=crop&q=80",
    duration: 65,
    category: "Mental Health",
    tags: ["stress", "mental health", "heart"],
    doctorId: "550e8400-e29b-41d4-a716-446655440005",
    isPersonalized: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "trend-006",
    title: "Blood Pressure Myths Debunked",
    description: "Common misconceptions about high blood pressure.",
    videoUrl: "/videos/doctor-jack-video-3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=600&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=600&fit=crop&q=80",
    duration: 48,
    category: "Cardiology",
    tags: ["blood pressure", "myths", "facts"],
    doctorId: "550e8400-e29b-41d4-a716-446655440004",
    isPersonalized: false,
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
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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

  const [searchQuery, setSearchQuery] = useState("");
  
  const specialties = ["all", "cardiology", "primary-care", "endocrinology", "gastroenterology", "pulmonology", "mental-health"];
  
  // Filter specialties based on search query
  const filteredSpecialties = searchQuery 
    ? specialties.filter(s => 
        s.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s === "cardiology" && (searchQuery.toLowerCase().includes("heart") || searchQuery.toLowerCase().includes("cardiac"))) ||
        (s === "mental-health" && (searchQuery.toLowerCase().includes("mental") || searchQuery.toLowerCase().includes("anxiety") || searchQuery.toLowerCase().includes("depression")))
      )
    : specialties;

  // Get patient name for display
  const patientName = session?.user?.name?.split(" ")[0] || "there";

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleOpenMessages = () => {
    setIsMessagesOpen(true);
  };

  const handleCloseMessages = () => {
    setIsMessagesOpen(false);
  };

  const handleSelectDoctorFromMessages = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsMessagesOpen(false);
    setIsChatOpen(true);
  };

  // Get list of followed doctors for messages drawer
  const followedDoctors = MOCK_DOCTORS.filter((d) => addedDoctors.has(d.id));

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

  const handleToggleDoctor = (e: React.MouseEvent, doctorId: string, isPremium: boolean) => {
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
    
    setAddedDoctors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(doctorId)) {
        newSet.delete(doctorId);
      } else {
        newSet.add(doctorId);
      }
      return newSet;
    });
  };

  const handleCloseAuthPrompt = () => {
    setShowAuthPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>My Feed</span>
          </Link>
          <Link
            href="/discover"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold transition-all"
          >
            <svg className="w-6 h-6 text-[#00BFA6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            {MOCK_DOCTORS.slice(0, 5).map((doctor) => (
              <Link
                key={doctor.id}
                href={`/feed?doctor=${doctor.id}`}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
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

      {/* Mobile Header - only visible on mobile/tablet */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-3">
          <div className="flex items-center justify-between py-2">
            {/* Left: Logo */}
            <Link href="/feed" className="flex flex-col items-center">
              <Logo variant="withTagline" className="h-12 w-auto" />
            </Link>

            {/* Right: Sign In on mobile */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => {
                    setAuthPromptTrigger("save_progress");
                    setShowAuthPrompt(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-sky-600 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content - offset for sidebar on desktop */}
      <main className="lg:ml-64 px-3 md:px-6 py-3 md:py-6 pb-16 max-w-7xl mx-auto">
        {/* Header Card - Modular */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                Discover
              </h1>
              <p className="text-gray-500 text-sm">
                Explore content from your experts
              </p>
            </div>
          </div>
          
          {/* Search Input - smaller on mobile */}
          <div className="relative">
            <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
            <input
            type="text"
            placeholder="Search doctors or topics..."
            value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2.5 bg-gray-50 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BFA6]/30 focus:border-[#00BFA6] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Doctor Profiles - Modular Card */}
        <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {MOCK_DOCTORS.filter((doctor) => {
              // Filter doctors by search query
              if (searchQuery) {
                const search = searchQuery.toLowerCase();
                const matchesSearch = 
                  doctor.name.toLowerCase().includes(search) ||
                  doctor.specialty.toLowerCase().includes(search) ||
                  doctor.clinicName?.toLowerCase().includes(search) ||
                  doctor.insurer?.toLowerCase().includes(search);
                if (!matchesSearch) return false;
              }
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
                  {isFirstPremium && (() => {
                    const drKimId = "550e8400-e29b-41d4-a716-446655440006";
                    const isDrKimAdded = addedDoctors.has(drKimId);
                    return (
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 group cursor-pointer">
                        <div className="relative">
                          {/* Avatar - clickable to profile */}
                          <Link
                            href={`/profile/${drKimId}`}
                            className="block w-16 h-16 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-sky-500 via-blue-500 to-sky-600 p-[2px] group-hover:scale-105 transition-transform duration-200"
                          >
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
                          </Link>
                          {/* Plus/Check badge - toggles add state without navigation */}
                          {isDrKimAdded ? (
                            <button
                              onClick={(e) => handleToggleDoctor(e, drKimId, false)}
                              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow border-2 border-white hover:bg-green-600 transition-colors"
                              aria-label="Remove Dr. Kim"
                            >
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleToggleDoctor(e, drKimId, false)}
                              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center shadow border-2 border-white hover:from-emerald-600 hover:to-sky-600 transition-all"
                              aria-label="Add Dr. Kim"
                            >
                              <Plus className="w-3 h-3 text-white" strokeWidth={3} />
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] md:text-xs font-medium text-gray-700 max-w-[70px] truncate text-center">
                          Dr. Kim
                        </p>
                        <p className="text-[8px] text-gray-500 max-w-[70px] truncate text-center">
                          Metro Heart
                        </p>
                        <p className={`text-[8px] font-medium max-w-[70px] truncate text-center ${isDrKimAdded ? 'text-green-600' : 'text-sky-600'}`}>
                          {isDrKimAdded ? '✓ Added' : '+ Add'}
                        </p>
                      </div>
                    );
                  })()}
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
                          <div className="w-16 h-16 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-gray-400 via-gray-300 to-gray-400 p-[2px]">
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
                    // Free tier doctor - clickable (goes to profile page)
                    <Link
                      href={`/profile/${doctor.id}`}
                      className="flex flex-col items-center gap-1"
                      onClick={() => handleDoctorClick(doctor, false)}
                    >
                      <div className="relative">
                        {/* Gradient ring */}
                        <div className="w-16 h-16 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-primary-500 via-pink-500 to-yellow-500 p-[2px] group-hover:scale-105 transition-transform duration-200">
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
                        {/* Checkmark badge - clickable to remove */}
                        {isAdded && (
                          <button
                            onClick={(e) => handleToggleDoctor(e, doctor.id, false)}
                            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow border-2 border-white hover:bg-green-600 transition-colors"
                            aria-label={`Remove Dr. ${doctor.name}`}
                          >
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </button>
                        )}
                        {/* Add button */}
                        {!isAdded && (
                          <button
                            onClick={(e) => handleToggleDoctor(e, doctor.id, false)}
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
        </div>

        {/* Trending Videos - TikTok-style Vertical Previews */}
        <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#00BFA6]" />
            <h2 className="text-base font-bold text-gray-900">Trending Now</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {TRENDING_VIDEOS.filter(video => {
              // Filter based on search term
              if (searchQuery) {
                const search = searchQuery.toLowerCase();
                return (
                  video.title.toLowerCase().includes(search) ||
                  video.description?.toLowerCase().includes(search) ||
                  video.category?.toLowerCase().includes(search) ||
                  video.tags?.some(tag => tag.toLowerCase().includes(search))
                );
              }
              // Filter based on specialty
              if (selectedSpecialty !== "all") {
                if (selectedSpecialty === "cardiology") {
                  return video.category === "Cardiology";
                }
                if (selectedSpecialty === "mental-health") {
                  return video.category === "Mental Health";
                }
              }
              return true;
            }).map((video) => {
              const doctor = MOCK_DOCTORS.find(d => d.id === video.doctorId);
              return (
                <VerticalVideoPreview
                  key={video.id}
                  video={video}
                  doctor={doctor}
                  href={`/feed?video=${video.id}`}
                />
              );
            })}
          </div>
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

        {/* Mental Health Videos */}
        {(selectedSpecialty === "all" || selectedSpecialty === "mental-health") && (
          <div className="bg-white rounded-2xl p-3 mb-3 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">Mental Health</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80" alt="Managing Anxiety" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">5:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-semibold rounded-lg mb-1">Anxiety</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Managing Anxiety</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Johnson explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80" alt="Depression Support" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">6:15</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-lg mb-1">Depression</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Understanding Depression</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Chen on support</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80" alt="Stress Relief" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-semibold rounded-lg mb-1">Stress</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Stress Relief Techniques</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Rodriguez explains</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80" alt="Sleep & Mental Health" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">5:00</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded-lg mb-1">Sleep</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Sleep & Mental Health</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Martinez on sleep</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80" alt="Mindfulness Meditation" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">7:30</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-lg mb-1">Mindfulness</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Mindfulness Meditation</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Kim guides you</p>
                </div>
              </Link>
              <Link href="/feed" className="flex-shrink-0 w-44 bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&q=80" alt="Work-Life Balance" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">4:45</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-lg mb-1">Wellness</span>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">Work-Life Balance</h3>
                  <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">Dr. Patel on balance</p>
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
        onClick={handleOpenMessages}
        className="md:hidden fixed bottom-14 right-4 flex items-center justify-center w-14 h-14 bg-[#37A9D9] rounded-full shadow-lg hover:bg-[#2A8DBF] active:scale-95 transition-all duration-200 z-40"
        aria-label="View messages"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          2
        </span>
      </button>

      {/* Desktop Floating message button */}
      <button
        onClick={handleOpenMessages}
        className="hidden md:flex fixed bottom-8 right-8 items-center justify-center w-14 h-14 bg-[#37A9D9] rounded-full shadow-lg hover:bg-[#2A8DBF] hover:scale-110 transition-all duration-200 z-40"
        aria-label="View messages"
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

      {/* Messages Drawer */}
      <MessagesDrawer
        isOpen={isMessagesOpen}
        onClose={handleCloseMessages}
        doctors={followedDoctors}
        onSelectDoctor={handleSelectDoctorFromMessages}
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
