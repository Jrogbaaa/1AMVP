"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeartScore } from "@/components/HeartScore";
import { TrustBadge } from "@/components/TrustBadge";
import { ScheduleAppointment } from "@/components/ScheduleAppointment";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { AuthPrompt } from "@/components/AuthPrompt";
import { UserMenu } from "@/components/UserMenu";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  Play,
  Heart,
  ChevronRight,
  MessageCircle,
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Doctor, User as UserType } from "@/lib/types";

// Mock data
const MOCK_DOCTOR: Doctor = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Sarah Johnson",
  specialty: "Cardiology",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
  clinicName: "Heart Health Clinic",
  clinicAddress: "123 Medical Center Dr, Boston, MA 02115",
  phone: "(617) 555-0100",
  email: "sjohnson@hearthealthclinic.com",
  createdAt: new Date().toISOString(),
};

// Score values for each action item
const ACTION_SCORES: Record<string, number> = {
  med1: 2,
  bp: 3,
  walk: 5,
  video: 5,
  water: 3,
};

// Unauthenticated view component
const UnauthenticatedView = () => {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="dashboard-container">
          <div className="flex items-center justify-between py-4">
            <Link href="/feed" className="flex flex-col items-center">
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
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/feed" className="text-gray-600 hover:text-gray-900 font-medium">
                My Feed
              </Link>
              <Link href="/discover" className="text-gray-600 hover:text-gray-900 font-medium">
                Discover
              </Link>
              <Link href="/my-health" className="text-primary-600 font-semibold border-b-2 border-primary-600 pb-1">
                My Health
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-container py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Lock icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-6">
            <Lock className="w-10 h-10 text-sky-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Personal Health Dashboard
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Sign in to access your health profile, track your progress, set reminders, and stay connected with your doctors.
          </p>

          {/* Benefits */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">What you'll get:</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700">Track your health score and daily tasks</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700">Schedule appointments with your doctors</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700">Get personalized health reminders</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700">View your insurance and provider info</span>
              </div>
            </div>
          </div>

          {/* Sign in button */}
          <button
            onClick={() => setShowAuthPrompt(true)}
            className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 px-6 py-4 bg-sky-600 text-white rounded-xl font-semibold text-lg hover:bg-sky-700 transition-colors shadow-lg"
          >
            Sign In to Continue
          </button>

          {/* Or browse content */}
          <p className="mt-6 text-gray-500">
            Not ready yet?{" "}
            <Link href="/feed" className="text-sky-600 font-medium hover:underline">
              Browse health content
            </Link>
          </p>
        </div>
      </main>

      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around py-1.5">
          <Link href="/feed" className="flex flex-col items-center gap-0.5 text-gray-600">
            <Play className="w-5 h-5" />
            <span className="text-[10px] font-medium">My Feed</span>
          </Link>
          <Link href="/discover" className="flex flex-col items-center gap-0.5 text-gray-600">
            <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <Play className="w-2.5 h-2.5" />
            </div>
            <span className="text-[10px] font-medium">Discover</span>
          </Link>
          <Link href="/my-health" className="flex flex-col items-center gap-0.5 text-primary-600">
            <Heart className="w-5 h-5" fill="currentColor" />
            <span className="text-[10px] font-medium">My Health</span>
          </Link>
        </div>
      </nav>

      {/* Auth Prompt */}
      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        trigger="personalized_content"
      />
    </div>
  );
};

// Loading view
const LoadingView = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-sky-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading your health dashboard...</p>
    </div>
  </div>
);

export default function MyHealthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [floatingCheck, setFloatingCheck] = useState<{id: string; active: boolean} | null>(null);

  // Show loading state while checking auth
  if (status === "loading") {
    return <LoadingView />;
  }

  // Show unauthenticated view if not signed in
  if (status === "unauthenticated") {
    return <UnauthenticatedView />;
  }

  // Create user object from session
  const currentUser: UserType = {
    id: session?.user?.id || "user-id",
    name: session?.user?.name || "User",
    email: session?.user?.email || "user@example.com",
    phone: "(617) 555-1234", // Mock data
    dateOfBirth: "1985-06-15", // Mock data
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Calculate health score based on completed items
  const baseScore = 55;
  const completedScore = Object.entries(checkedItems)
    .filter(([_, checked]) => checked)
    .reduce((sum, [id]) => sum + (ACTION_SCORES[id] || 0), 0);
  const healthScore = Math.min(baseScore + completedScore, 100);

  const handleScheduleAppointment = () => {
    setIsScheduleOpen(true);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleCheckboxChange = (id: string) => {
    const isNowChecked = !checkedItems[id];
    
    setCheckedItems((prev) => ({
      ...prev,
      [id]: isNowChecked,
    }));
    
    // Trigger animations when checking an item
    if (isNowChecked) {
      // Show floating check animation
      setFloatingCheck({ id, active: true });
      
      // Trigger heart pulse after a delay
      setTimeout(() => {
        setIsHeartAnimating(true);
        setFloatingCheck(null);
      }, 400);
      
      // Reset heart animation
      setTimeout(() => {
        setIsHeartAnimating(false);
      }, 900);
    }
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
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/feed" className="text-gray-600 hover:text-gray-900 font-medium">
                My Feed
              </Link>
              <Link href="/discover" className="text-gray-600 hover:text-gray-900 font-medium">
                Discover
              </Link>
              <Link href="/my-health" className="text-primary-600 font-semibold border-b-2 border-primary-600 pb-1">
                My Health
              </Link>
            </nav>

            {/* Right: Heart Score + Menu */}
            <div className="flex items-center gap-2 md:gap-4">
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
              <HeartScore score={healthScore} isAnimating={isHeartAnimating} />
              <div className="hidden sm:block">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - tighter padding on mobile */}
      <main className="px-3 md:px-6 py-3 md:py-6 pb-16 max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-3">
            {/* Health Score Summary - Modular Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-4 shadow-sm border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5">
                    My Health
                  </h1>
                  <p className="text-gray-600 text-sm">Track your health actions</p>
                </div>
                {/* Hidden on mobile to avoid duplicate with header */}
                <div className="hidden md:block">
                  <HeartScore score={healthScore} className="scale-110" isAnimating={isHeartAnimating} />
                </div>
              </div>
            </div>

            {/* Action Items - Modular Card */}
            <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                Action Items & Reminders
              </h2>

              {/* Annual Reminders */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                  <span>📅</span> Annual Reminders
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">Annual Physical</p>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+15%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Due: March 2025</p>
                      </div>
                      <div className="flex gap-1.5 md:gap-1.5 flex-shrink-0">
                        <button className="px-3 py-2 md:px-2 md:py-1 bg-white text-primary-600 text-xs md:text-[10px] font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors">
                          📅 Add
                        </button>
                        <button
                          onClick={handleScheduleAppointment}
                          className="px-3 py-2 md:px-2 md:py-1 bg-primary-600 text-white text-xs md:text-[10px] font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">Cholesterol Screening</p>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+10%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Due: June 2025</p>
                      </div>
                      <div className="flex gap-1.5 md:gap-1.5 flex-shrink-0">
                        <button className="px-3 py-2 md:px-2 md:py-1 bg-white text-primary-600 text-xs md:text-[10px] font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors">
                          📅 Add
                        </button>
                        <button
                          onClick={handleScheduleAppointment}
                          className="px-3 py-2 md:px-2 md:py-1 bg-primary-600 text-white text-xs md:text-[10px] font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">Flu Vaccination</p>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+5%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Due: October 2025</p>
                      </div>
                      <div className="flex gap-1.5 md:gap-1.5 flex-shrink-0">
                        <button className="px-3 py-2 md:px-2 md:py-1 bg-white text-primary-600 text-xs md:text-[10px] font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors">
                          📅 Add
                        </button>
                        <button
                          onClick={handleScheduleAppointment}
                          className="px-3 py-2 md:px-2 md:py-1 bg-primary-600 text-white text-xs md:text-[10px] font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <span>✅</span> Today
                  </h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                    {Object.values(checkedItems).filter(Boolean).length}/3 done
                  </span>
                </div>
              
                <div className="space-y-2">
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      checkedItems['med1'] ? 'bg-green-50 border border-green-200' : 'bg-emerald-50 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                    onClick={() => handleCheckboxChange('med1')}
                  >
                    <div className="flex-shrink-0">
                      {checkedItems['med1'] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 animate-check-complete" fill="currentColor" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`font-semibold text-sm ${checkedItems['med1'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          Take morning medication
                        </p>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+2%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">9:00 AM · Aspirin 81mg</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      checkedItems['bp'] ? 'bg-green-50 border border-green-200' : 'bg-emerald-50 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                    onClick={() => handleCheckboxChange('bp')}
                  >
                    <div className="flex-shrink-0">
                      {checkedItems['bp'] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 animate-check-complete" fill="currentColor" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`font-semibold text-sm ${checkedItems['bp'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          Log blood pressure
                        </p>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+3%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Target: 120/80</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      checkedItems['walk'] ? 'bg-green-50 border border-green-200' : 'bg-emerald-50 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                    onClick={() => handleCheckboxChange('walk')}
                  >
                    <div className="flex-shrink-0">
                      {checkedItems['walk'] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 animate-check-complete" fill="currentColor" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`font-semibold text-sm ${checkedItems['walk'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          30-minute walk
                        </p>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+5%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Daily activity</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* This Week */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                  <span>📆</span> This Week
                </h3>
                <div className="space-y-2">
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      checkedItems['video'] ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-100 hover:bg-amber-100'
                    }`}
                    onClick={() => handleCheckboxChange('video')}
                  >
                    <div className="flex-shrink-0">
                      {checkedItems['video'] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 animate-check-complete" fill="currentColor" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`font-semibold text-sm ${checkedItems['video'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          Watch educational videos
                        </p>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+5%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">3 videos on heart health</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      checkedItems['water'] ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-100 hover:bg-amber-100'
                    }`}
                    onClick={() => handleCheckboxChange('water')}
                  >
                    <div className="flex-shrink-0">
                      {checkedItems['water'] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 animate-check-complete" fill="currentColor" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`font-semibold text-sm ${checkedItems['water'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          Track water intake
                        </p>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+3%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">8 glasses/day for 7 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions - Modular Card */}
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Quick Actions
              </h3>
              <div className="space-y-1.5">
                <Link
                  href="/discover"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      <Play className="w-2 h-2 text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">Browse Discover</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/feed"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 text-sm">My Feed</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right column - Doctor (SECONDARY) */}
          <div className="space-y-3">
            {/* Doctor card - Modular */}
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-2">
                Your Doctor
              </h2>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  {MOCK_DOCTOR.avatarUrl ? (
                    <Image
                      src={MOCK_DOCTOR.avatarUrl}
                      alt={MOCK_DOCTOR.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {MOCK_DOCTOR.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {MOCK_DOCTOR.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{MOCK_DOCTOR.specialty}</p>
                </div>
              </div>

              {MOCK_DOCTOR.clinicName && (
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{MOCK_DOCTOR.clinicName}</p>
                      {MOCK_DOCTOR.clinicAddress && (
                        <p className="text-gray-500">{MOCK_DOCTOR.clinicAddress}</p>
                      )}
                    </div>
                  </div>
                  {MOCK_DOCTOR.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{MOCK_DOCTOR.phone}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleScheduleAppointment}
                className="w-full btn-primary"
              >
                <Calendar className="w-5 h-5 mr-2 inline" />
                Schedule Follow-Up
              </button>
            </div>

            {/* Trust badge */}
            <div className="card">
              <TrustBadge />
            </div>
          </div>
        </div>

        {/* Healthcare Providers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Connected Doctors */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Doctors
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80"
                    alt="Dr. Sarah Johnson"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Dr. Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Cardiology</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80"
                    alt="Dr. Michael Chen"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Dr. Michael Chen</p>
                  <p className="text-xs text-gray-500">Primary Care</p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Groups */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Doctor Groups
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 text-sm">Heart Health Clinic</p>
                <p className="text-xs text-gray-500 mt-1">123 Medical Center Dr, Boston, MA</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 text-sm">Boston Medical Center</p>
                <p className="text-xs text-gray-500 mt-1">1 Boston Medical Center Pl, Boston, MA</p>
              </div>
              {/* Kaiser Permanente */}
              <div className="p-3 bg-[#003A70] rounded-lg">
                <Image
                  src="/images/kaiser-logo.png"
                  alt="Kaiser Permanente"
                  width={120}
                  height={32}
                  className="h-6 w-auto"
                />
                <p className="text-xs text-white/80 mt-2">Member Network</p>
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Insurer
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-[#003A70] rounded-lg overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <Image
                    src="/images/united-healthcare-logo-white.svg"
                    alt="UnitedHealthcare"
                    width={160}
                    height={36}
                    className="h-7 w-auto flex-shrink-0"
                  />
                </div>
                <div className="text-white/90 text-xs space-y-1">
                  <p>Member ID: UHC-123456789</p>
                  <p>Group: 98765</p>
                  <p>Plan: PPO Gold</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information Section - Below */}
        <div className="card max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentUser.name}
                </h2>
                <p className="text-gray-500">Patient Profile</p>
              </div>
            </div>
            <button className="btn-ghost">
              <Settings className="w-5 h-5 mr-2 inline" />
              Edit
            </button>
          </div>

          {/* User details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <span>{currentUser.email}</span>
              </div>
            </div>
            {currentUser.phone && (
              <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <span>{currentUser.phone}</span>
                </div>
              </div>
            )}
            {currentUser.dateOfBirth && (
              <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                  <span>{new Date(currentUser.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Patient ID</p>
                <span className="text-sm font-mono">{currentUser.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <button 
            onClick={handleSignOut}
            className="w-full mt-6 btn-ghost text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-2 inline" />
            Sign Out
          </button>
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
          <Link href="/discover" className="flex flex-col items-center gap-0.5 text-gray-600">
            <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <Play className="w-2.5 h-2.5" />
            </div>
            <span className="text-[10px] font-medium">Discover</span>
          </Link>
          <Link href="/my-health" className="flex flex-col items-center gap-0.5 text-primary-600">
            <Heart className="w-5 h-5" fill="currentColor" />
            <span className="text-[10px] font-medium">My Health</span>
          </Link>
        </div>
      </nav>

      {/* Schedule appointment modal */}
      <ScheduleAppointment
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        doctor={MOCK_DOCTOR}
        userId={currentUser.id}
      />

      {/* Chat onboarding */}
      <ChatOnboarding
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        doctor={MOCK_DOCTOR}
        patientName={currentUser.name}
        userId={currentUser.id}
      />
    </div>
  );
}
