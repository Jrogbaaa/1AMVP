"use client";

import { useState } from "react";
import { HeartScore } from "@/components/HeartScore";
import { TrustBadge } from "@/components/TrustBadge";
import { ScheduleAppointment } from "@/components/ScheduleAppointment";
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
  Search,
  ChevronRight,
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
  avatarUrl: "/images/doctors/dr-johnson.jpg",
  clinicName: "Heart Health Clinic",
  clinicAddress: "123 Medical Center Dr, Boston, MA 02115",
  phone: "(617) 555-0100",
  email: "sjohnson@hearthealthclinic.com",
  createdAt: new Date().toISOString(),
};

export default function AccountPage() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const healthScore = 55;

  const handleScheduleAppointment = () => {
    setIsScheduleOpen(true);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
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
                  <Link href="/library" className="text-gray-600 hover:text-gray-900 font-medium">
                    Library
                  </Link>
                  <Link href="/account" className="text-primary-600 font-semibold border-b-2 border-primary-600 pb-1">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - User info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile card */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">
                      {MOCK_USER.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {MOCK_USER.name}
                    </h1>
                    <p className="text-gray-500">Patient</p>
                  </div>
                </div>
                <button className="btn-ghost">
                  <Settings className="w-5 h-5 mr-2 inline" />
                  Edit
                </button>
              </div>

              {/* User details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{MOCK_USER.email}</span>
                </div>
                {MOCK_USER.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{MOCK_USER.phone}</span>
                  </div>
                )}
                {MOCK_USER.dateOfBirth && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>
                      Born {new Date(MOCK_USER.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor card */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Doctor
              </h2>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  {MOCK_DOCTOR.avatarUrl ? (
                    <Image
                      src={MOCK_DOCTOR.avatarUrl}
                      alt={MOCK_DOCTOR.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {MOCK_DOCTOR.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Dr. {MOCK_DOCTOR.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{MOCK_DOCTOR.specialty}</p>

                  {MOCK_DOCTOR.clinicName && (
                    <div className="space-y-2 text-sm">
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
                      {MOCK_DOCTOR.email && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{MOCK_DOCTOR.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleScheduleAppointment}
                className="w-full btn-primary"
              >
                <Calendar className="w-5 h-5 mr-2 inline" />
                Schedule Follow-Up
              </button>
            </div>

            {/* Quick actions */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Link
                  href="/library"
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">Browse Library</span>
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

          {/* Right column - Health score & stats */}
          <div className="space-y-6">
            {/* Health score card */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Health Score
              </h2>
              <div className="flex flex-col items-center py-6">
                <HeartScore score={healthScore} className="mb-4 scale-150" />
                <p className="text-center text-gray-600 mt-6">
                  Keep engaging with your personalized content to improve your score!
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Watched doctor video</span>
                  <span className="font-semibold text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completed onboarding</span>
                  <span className="font-semibold text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Scheduled follow-up</span>
                  <span className="font-semibold text-gray-400">—</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Educational videos</span>
                  <span className="font-semibold text-primary-600">2/5</span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="card">
              <TrustBadge />
            </div>

            {/* Sign out */}
            <button 
              onClick={handleSignOut}
              className="w-full btn-ghost text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-2 inline" />
              Sign Out
            </button>
          </div>
        </div>
      </main>

      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around py-3">
          <Link href="/feed" className="flex flex-col items-center gap-1 text-gray-600">
            <Play className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </Link>
          <Link href="/library" className="flex flex-col items-center gap-1 text-gray-600">
            <Search className="w-6 h-6" />
            <span className="text-xs font-medium">Library</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-1 text-primary-600">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Account</span>
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
      </div>
    </ProtectedRoute>
  );
}

