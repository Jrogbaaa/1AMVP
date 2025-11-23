"use client";

import { useState } from "react";
import { HeartScore } from "@/components/HeartScore";
import { TrustBadge } from "@/components/TrustBadge";
import { ScheduleAppointment } from "@/components/ScheduleAppointment";
import { ChatOnboarding } from "@/components/ChatOnboarding";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import { signOut } from "next-auth/react";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Doctor, User as UserType } from "@/lib/types";

// Mock data
const MOCK_USER: UserType = {
  id: "650e8400-e29b-41d4-a716-446655440001",
  name: "Dave Thompson",
  email: "dave@example.com",
  phone: "(617) 555-1234",
  dateOfBirth: "1985-06-15",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

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

export default function MyHealthPage() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const healthScore = 55;

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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="dashboard-container">
            <div className="flex items-center justify-between py-4">
              {/* Left: Logo and Nav */}
              <div className="flex items-center gap-4">
                <Link href="/feed" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    1A
                  </div>
                  <span className="hidden sm:inline">1Another</span>
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

              {/* Right: Heart Score, User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <HeartScore score={healthScore} showMessage />
                </div>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

      {/* Main content */}
      <main className="dashboard-container py-8">
        {/* Top row - Reminders & Doctor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left column - Health Actions & Reminders (PRIMARY) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Score Summary Card */}
            <div className="card bg-gradient-to-br from-primary-50 to-blue-50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    My Health
                  </h1>
                  <p className="text-gray-600">Keep track of your health actions</p>
                </div>
                <HeartScore score={healthScore} className="scale-125" />
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className={`px-3 py-1 rounded-full font-semibold ${
                  healthScore >= 70 ? "bg-green-100 text-green-700" : 
                  healthScore >= 40 ? "bg-yellow-100 text-yellow-700" : 
                  "bg-red-100 text-red-700"
                }`}>
                  {healthScore >= 70 ? "Great progress!" : 
                   healthScore >= 40 ? "Keep it up!" : 
                   "Let's improve together"}
                </div>
              </div>
            </div>

            {/* Action Items & Reminders - Time-based Sections */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Action Items & Reminders
              </h2>

              {/* This Day */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    📅 This Day
                  </h3>
                  <span className="text-sm text-gray-500">
                    {Object.values(checkedItems).filter(Boolean).length} of 3 completed
                  </span>
                </div>
              
                <div className="space-y-3">
                  <div 
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                      checkedItems['med1'] ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCheckboxChange('med1')}
                  >
                    <div className="mt-0.5">
                      {checkedItems['med1'] ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" fill="currentColor" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${checkedItems['med1'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        Take morning medication
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Due at 9:00 AM · Aspirin 81mg</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                      checkedItems['bp'] ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCheckboxChange('bp')}
                  >
                    <div className="mt-0.5">
                      {checkedItems['bp'] ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" fill="currentColor" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${checkedItems['bp'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        Log blood pressure
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Morning reading · Target: 120/80</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                      checkedItems['walk'] ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCheckboxChange('walk')}
                  >
                    <div className="mt-0.5">
                      {checkedItems['walk'] ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" fill="currentColor" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${checkedItems['walk'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        30-minute walk
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Recommended daily activity</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* This Week */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📆 This Week
                </h3>
                <div className="space-y-3">
                  <div 
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                      checkedItems['video'] ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCheckboxChange('video')}
                  >
                    <div className="mt-0.5">
                      {checkedItems['video'] ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" fill="currentColor" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${checkedItems['video'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        Watch educational videos
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Complete 3 videos on heart-healthy living</p>
                    </div>
                  </div>

                  <div 
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                      checkedItems['water'] ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCheckboxChange('water')}
                  >
                    <div className="mt-0.5">
                      {checkedItems['water'] ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" fill="currentColor" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${checkedItems['water'] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        Track daily water intake
                      </p>
                      <p className="text-sm text-gray-500 mt-1">8 glasses per day for 7 days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* This Year */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📅 This Year
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Annual Physical Exam</p>
                        <p className="text-sm text-gray-500 mt-1">Due: March 2025</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white text-primary-600 text-sm font-medium rounded-lg border border-primary-600 hover:bg-primary-50 transition-colors">
                          📅 Add to Calendar
                        </button>
                        <button
                          onClick={handleScheduleAppointment}
                          className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Cholesterol Screening</p>
                        <p className="text-sm text-gray-500 mt-1">Due: June 2025</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white text-primary-600 text-sm font-medium rounded-lg border border-primary-600 hover:bg-primary-50 transition-colors">
                          📅 Add to Calendar
                        </button>
                        <button
                          onClick={handleScheduleAppointment}
                          className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Flu Vaccination</p>
                        <p className="text-sm text-gray-500 mt-1">Due: October 2025</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white text-primary-600 text-sm font-medium rounded-lg border border-primary-600 hover:bg-primary-50 transition-colors">
                          📅 Add to Calendar
                        </button>
                        <button
                          onClick={handleScheduleAppointment}
                          className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/discover"
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      <Play className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900">Browse Discover</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                <Link
                  href="/feed"
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">My Feed</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right column - Doctor & Schedule (SECONDARY) */}
          <div className="space-y-6">
            {/* Doctor card */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
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

          {/* Hospital Groups */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hospital Groups
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
            </div>
          </div>

          {/* Insurance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Insurer
            </h3>
            <div className="p-4 bg-[#003A70] rounded-lg">
              <Image
                src="/images/kaiser-logo.png"
                alt="Kaiser Permanente"
                width={150}
                height={40}
                className="h-8 w-auto"
              />
              <div className="mt-3 text-white/90 text-xs space-y-1">
                <p>Member ID: KP-123456789</p>
                <p>Group: 98765</p>
                <p>Plan: PPO Gold</p>
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
                  {MOCK_USER.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {MOCK_USER.name}
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
                <span>{MOCK_USER.email}</span>
              </div>
            </div>
            {MOCK_USER.phone && (
              <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <span>{MOCK_USER.phone}</span>
                </div>
              </div>
            )}
            {MOCK_USER.dateOfBirth && (
              <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                  <span>{new Date(MOCK_USER.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Patient ID</p>
                <span className="text-sm font-mono">{MOCK_USER.id.slice(0, 8)}...</span>
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
          <Link href="/discover" className="flex flex-col items-center gap-1 text-gray-600">
            <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center">
              <Play className="w-3 h-3" />
            </div>
            <span className="text-xs font-medium">Discover</span>
          </Link>
          <Link href="/my-health" className="flex flex-col items-center gap-1 text-primary-600">
            <Heart className="w-6 h-6" fill="currentColor" />
            <span className="text-xs font-medium">My Health</span>
          </Link>
        </div>
      </nav>

      {/* Schedule appointment modal */}
      <ScheduleAppointment
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        doctor={MOCK_DOCTOR}
        userId={MOCK_USER.id}
      />

      {/* Chat onboarding */}
      <ChatOnboarding
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        doctor={MOCK_DOCTOR}
        patientName={MOCK_USER.name}
        userId={MOCK_USER.id}
      />
      </div>
    </ProtectedRoute>
  );
}
