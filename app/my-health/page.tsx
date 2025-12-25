"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { AuthPrompt } from "@/components/AuthPrompt";
import { CheckCircle2, Lock, Loader2 } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Image from "next/image";
import Link from "next/link";

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
      <MobileBottomNav />

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

// Lazy load the authenticated dashboard to avoid Convex hook issues when not authenticated
const AuthenticatedDashboard = dynamic(
  () => import("./AuthenticatedDashboard"),
  { 
    loading: () => <LoadingView />,
    ssr: false 
  }
);

export default function MyHealthPage() {
  const { data: session, status } = useSession();

  // Show loading state while checking auth
  if (status === "loading") {
    return <LoadingView />;
  }

  // Show unauthenticated view if not signed in
  if (status === "unauthenticated") {
    return <UnauthenticatedView />;
  }

  // Render authenticated dashboard (which uses Convex hooks)
  return <AuthenticatedDashboard session={session} />;
}
