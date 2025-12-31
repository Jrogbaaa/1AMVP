"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TrustBadge } from "@/components/TrustBadge";
import { ScheduleAppointment } from "@/components/ScheduleAppointment";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { UserMenu } from "@/components/UserMenu";
import { PreventiveCareChecklist } from "@/components/PreventiveCareChecklist";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Image from "next/image";
import Link from "next/link";
import type { Doctor, User as UserType } from "@/lib/types";
import type { PreventiveCareProfile } from "@/lib/preventive-care-logic";
import type { Session } from "next-auth";

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

// Mock doctors for sidebar
const MOCK_DOCTORS: Doctor[] = [
  MOCK_DOCTOR,
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
];

// Score values for each action item
const ACTION_SCORES: Record<string, number> = {
  med1: 2,
  bp: 3,
  walk: 5,
  video: 5,
  water: 3,
};

interface AuthenticatedDashboardProps {
  session: Session | null;
}

export default function AuthenticatedDashboard({ session }: AuthenticatedDashboardProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Get user ID safely - ensure it's a valid string
  const userId = session?.user?.id && typeof session.user.id === "string" ? session.user.id : null;

  // Query for preventive care profile - only called when user is authenticated with valid ID
  const preventiveCareProfile = useQuery(
    api.preventiveCare.getProfile,
    userId ? { userId } : "skip"
  );

  // Convert Convex profile to PreventiveCareProfile type
  const profileForChecklist: PreventiveCareProfile | null = preventiveCareProfile ? {
    dateOfBirth: preventiveCareProfile.dateOfBirth,
    sexAtBirth: preventiveCareProfile.sexAtBirth,
    anatomyPresent: preventiveCareProfile.anatomyPresent,
    isPregnant: preventiveCareProfile.isPregnant,
    weeksPregnant: preventiveCareProfile.weeksPregnant,
    smokingStatus: preventiveCareProfile.smokingStatus,
    smokingYears: preventiveCareProfile.smokingYears,
    packsPerDay: preventiveCareProfile.packsPerDay,
    quitYear: preventiveCareProfile.quitYear,
    alcoholFrequency: preventiveCareProfile.alcoholFrequency,
    drinksPerOccasion: preventiveCareProfile.drinksPerOccasion,
    sexuallyActive: preventiveCareProfile.sexuallyActive,
    partnersLast12Months: preventiveCareProfile.partnersLast12Months,
    stiHistory: preventiveCareProfile.stiHistory,
    hivRisk: preventiveCareProfile.hivRisk,
    conditions: preventiveCareProfile.conditions,
    cancerTypes: preventiveCareProfile.cancerTypes,
    familyHistory: preventiveCareProfile.familyHistory,
    heightInches: preventiveCareProfile.heightInches,
    weightLbs: preventiveCareProfile.weightLbs,
    lastBloodPressure: preventiveCareProfile.lastBloodPressure,
    lastCholesterol: preventiveCareProfile.lastCholesterol,
    lastDiabetesTest: preventiveCareProfile.lastDiabetesTest,
    lastColonoscopy: preventiveCareProfile.lastColonoscopy,
    lastCervicalScreening: preventiveCareProfile.lastCervicalScreening,
    lastMammogram: preventiveCareProfile.lastMammogram,
    lastHivTest: preventiveCareProfile.lastHivTest,
    lastDepressionScreening: preventiveCareProfile.lastDepressionScreening,
    zipCode: preventiveCareProfile.zipCode,
    insurancePlan: preventiveCareProfile.insurancePlan,
    hasPCP: preventiveCareProfile.hasPCP,
    openToTelehealth: preventiveCareProfile.openToTelehealth,
    preferredAppointmentTimes: preventiveCareProfile.preferredAppointmentTimes,
  } : null;

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
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold transition-all"
          >
            <svg className="w-6 h-6 text-[#00BFA6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span>My Health</span>
          </Link>
          
          <div className="pt-4 border-t border-gray-100 mt-4">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Doctors</p>
            {MOCK_DOCTORS.map((doctor) => (
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
        </div>
      </aside>

      {/* Mobile Header - only visible on mobile/tablet */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-3">
          <div className="flex items-center justify-between py-2">
            {/* Left: Logo */}
            <Link href="/feed" className="flex flex-col items-center">
              <Image
                src="/images/1another-logo.png?v=2"
                alt="1Another"
                width={140}
                height={40}
                className="h-8 w-auto"
                priority
                unoptimized
              />
              <span className="text-[#00BCD4] font-semibold text-[10px] tracking-wide">
                Intelligent Health
              </span>
            </Link>

            {/* Right: User Menu on mobile */}
            <div className="flex items-center gap-2">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main content - offset for sidebar on desktop */}
      <main className="lg:ml-64 px-3 md:px-6 py-3 md:py-6 pb-16 max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-3">
            {/* Health Summary - Modular Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-4 shadow-sm border border-emerald-100">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-0.5">
                  My Health
                </h1>
                <p className="text-gray-600 text-sm">Track your health actions</p>
              </div>
              
              {/* Personalize My Page Button - only show if not completed onboarding */}
              {!preventiveCareProfile && (
                <Link
                  href="/my-health/onboarding"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-teal-700 transition-all shadow-md group"
                >
                  <Sparkles className="w-5 h-5" />
                  Personalize My Page
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* Reminders - Modular Card */}
            <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                Reminders
              </h2>

              {/* Annual Reminders */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <span>📅</span> Annual Reminders
                  </h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                    0/4 done
                  </span>
                </div>
                <div className="space-y-2">
                  {/* Schedule Colonoscopy - Top Priority */}
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">Schedule Colonoscopy</p>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+15%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Due in 60 days</p>
                      </div>
                      <button
                        onClick={handleScheduleAppointment}
                        className="px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex-shrink-0"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">Annual Physical</p>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">+15%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Due: March 2025</p>
                      </div>
                      <button
                        onClick={handleScheduleAppointment}
                        className="px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex-shrink-0"
                      >
                        Schedule
                      </button>
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
                      <button
                        onClick={handleScheduleAppointment}
                        className="px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex-shrink-0"
                      >
                        Schedule
                      </button>
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
                      <button
                        onClick={handleScheduleAppointment}
                        className="px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm flex-shrink-0"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Reminders */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <span>✅</span> Daily Reminders
                  </h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                    {[checkedItems.med1, checkedItems.bp, checkedItems.walk].filter(Boolean).length}/3 done
                  </span>
                </div>
              
                <div className="space-y-2">
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      checkedItems['med1'] ? 'bg-green-50 border border-green-200' : 'bg-emerald-50 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                    onClick={() => handleCheckboxChange('med1')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckboxChange('med1')}
                    aria-label="Take morning medication"
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
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckboxChange('bp')}
                    aria-label="Log blood pressure"
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
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckboxChange('walk')}
                    aria-label="30-minute walk"
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

              {/* Weekly Reminders */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                    <span>📆</span> Weekly Reminders
                  </h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                    {[checkedItems.video, checkedItems.water].filter(Boolean).length}/2 done
                  </span>
                </div>
                <div className="space-y-2">
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      checkedItems['video'] ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-100 hover:bg-amber-100'
                    }`}
                    onClick={() => handleCheckboxChange('video')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckboxChange('video')}
                    aria-label="Watch educational videos"
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
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckboxChange('water')}
                    aria-label="Track water intake"
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

            {/* Preventive Care Checklist - Show if completed onboarding */}
            {profileForChecklist && (
              <div id="checklist" className="bg-white rounded-2xl p-3 md:p-4 shadow-sm">
                <PreventiveCareChecklist
                  profile={profileForChecklist}
                  onSchedule={(screeningId, locationId) => {
                    console.log("Schedule:", screeningId, "at location:", locationId);
                    setIsScheduleOpen(true);
                  }}
                />
              </div>
            )}

          </div>

          {/* Right column - Doctor (SECONDARY) */}
          <div className="space-y-3">
            {/* Doctor card - Modular */}
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-2">
                Your Primary Care Specialist
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

            {/* Trust badge - no card wrapper on mobile */}
            <div className="hidden md:block card">
              <TrustBadge />
            </div>
            <div className="md:hidden py-2">
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

      {/* Floating message button - Mobile */}
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
      </button>

      {/* Mobile navigation */}
      <MobileBottomNav />

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

