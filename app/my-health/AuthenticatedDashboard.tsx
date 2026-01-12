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
import { DoctorCommunicationsWidget } from "@/components/DoctorCommunicationsWidget";
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
  ChevronDown,
} from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { Doctor, User as UserType } from "@/lib/types";
import type { PreventiveCareProfile } from "@/lib/preventive-care-logic";
import type { Session } from "next-auth";

// Mock data with real doctor profile photos
const MOCK_DOCTOR: Doctor = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Sarah Johnson",
  specialty: "Cardiology",
  avatarUrl: "/images/doctors/doctor-lisa.jpg",
  clinicName: "Heart Health Clinic",
  clinicAddress: "123 Medical Center Dr, Boston, MA 02115",
  phone: "(617) 555-0100",
  email: "sjohnson@hearthealthclinic.com",
  createdAt: new Date().toISOString(),
};

// Mock doctors for sidebar with real profile photos
const MOCK_DOCTORS: Doctor[] = [
  MOCK_DOCTOR,
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Michael Chen",
    specialty: "Cardiology",
    avatarUrl: "/images/doctors/doctor-ryan.jpg",
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
    name: "Jack Ellis",
    specialty: "Cardiology",
    avatarUrl: "/images/doctors/doctor-jack.jpg",
    clinicName: "1Another Cardiology",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Lisa Thompson",
    specialty: "Cardiology",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
    clinicName: "Heart & Vascular Institute",
    createdAt: new Date().toISOString(),
  },
];

interface AuthenticatedDashboardProps {
  session: Session | null;
}

export default function AuthenticatedDashboard({ session }: AuthenticatedDashboardProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

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
                href={`/profile/${doctor.id}`}
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
        <div className="p-4 border-t border-gray-100 relative">
          <button 
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            aria-expanded={isProfileExpanded}
            aria-label="Toggle profile options"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#00A6CE] flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email || "Your profile"}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Popup menu - appears above the profile button */}
          {isProfileExpanded && (
            <>
              {/* Backdrop to close menu */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileExpanded(false)}
              />
              {/* Popup card */}
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Profile details */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-sky-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#00A6CE] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {session?.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {session?.user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{session?.user?.email || "Your profile"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="p-2">
                  <Link
                    href="/my-health/onboarding"
                    onClick={() => setIsProfileExpanded(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit Health Profile</span>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
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

            {/* Preventive Care Checklist - Show FIRST if completed onboarding */}
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

            {/* Combined Messages & Reminders from Your Doctor */}
            {userId && (
              <DoctorCommunicationsWidget patientId={userId} />
            )}

          </div>

          {/* Right column - Doctor (SECONDARY) */}
          <div className="space-y-3">
            {/* Combined Doctors Card - Mobile shows all doctors, Desktop shows primary only */}
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              {/* Desktop: Primary Care Specialist only */}
              <div className="hidden lg:block">
              <h2 className="text-sm font-bold text-gray-900 mb-2">
                Your Primary Care Specialist
              </h2>
                <Link
                  href={`/profile/${MOCK_DOCTOR.id}`}
                  className="flex items-start gap-3 mb-4 hover:opacity-80 transition-opacity"
                >
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
                </Link>

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

              {/* Mobile: Combined Your Doctors list */}
              <div className="lg:hidden">
                <h2 className="text-sm font-bold text-gray-900 mb-3">
                  Your Doctors
                </h2>
                <div className="space-y-2">
                  {/* Primary Care Specialist - highlighted */}
                  <Link
                    href={`/profile/${MOCK_DOCTOR.id}`}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-50 to-teal-50 rounded-xl border border-sky-100"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-sky-200">
                      {MOCK_DOCTOR.avatarUrl ? (
                        <Image
                          src={MOCK_DOCTOR.avatarUrl}
                          alt={MOCK_DOCTOR.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {MOCK_DOCTOR.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">Dr. {MOCK_DOCTOR.name}</p>
                      <p className="text-xs text-gray-500">{MOCK_DOCTOR.specialty}</p>
                      <p className="text-xs text-sky-600 font-medium">Primary Care</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>

                  {/* Other doctors */}
                  {MOCK_DOCTORS.filter(d => d.id !== MOCK_DOCTOR.id).slice(0, 2).map((doctor) => (
                    <Link
                      key={doctor.id}
                      href={`/profile/${doctor.id}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        {doctor.avatarUrl ? (
                          <Image
                            src={doctor.avatarUrl}
                            alt={doctor.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#00BFA6] to-[#00A6CE] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{doctor.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Dr. {doctor.name}</p>
                        <p className="text-xs text-gray-500">{doctor.specialty}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>

                <button
                  onClick={handleScheduleAppointment}
                  className="w-full btn-primary mt-3"
                >
                  <Calendar className="w-5 h-5 mr-2 inline" />
                  Schedule Appointment
                </button>
              </div>
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

        {/* Healthcare Providers Section - Full width stacked */}
        <div className="space-y-6 mb-6">
          {/* Connected Doctors - Desktop only (mobile version is combined above) */}
          <div className="hidden lg:block card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Doctors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link
                href={`/profile/${MOCK_DOCTORS[0]?.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
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
              </Link>
              <Link
                href={`/profile/${MOCK_DOCTORS[1]?.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
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
              </Link>
            </div>
          </div>

          {/* Your Insurer */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Insurer
            </h3>
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

          {/* Doctor Groups */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Doctor Groups
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

