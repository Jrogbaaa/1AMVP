"use client";

import { useState, Component, ReactNode } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { AuthPrompt } from "@/components/AuthPrompt";
import { CheckCircle2, Lock, Loader2, AlertCircle, RefreshCw, User } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";

// Error boundary to catch Convex and other async errors
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ConvexErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Dashboard error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're having trouble loading your health dashboard. This might be a temporary issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <p className="mt-4 text-sm text-gray-500">
              If this problem persists, please{" "}
              <Link href="/feed" className="text-sky-600 hover:underline">
                browse health content
              </Link>
              {" "}instead.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Unauthenticated view component
const UnauthenticatedView = () => {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
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
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setShowAuthPrompt(true)}
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
        </div>
      </aside>

      {/* Mobile Header - only visible on mobile/tablet */}
      <header className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-3">
          <div className="flex items-center justify-between py-2">
            <Link href="/feed" className="flex flex-col items-center">
              <Logo variant="withTagline" className="h-12 w-auto" />
            </Link>

            {/* Right: Sign In on mobile */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAuthPrompt(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - offset for sidebar on desktop */}
      <main className="lg:ml-64 dashboard-container py-16">
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

  // Ensure session is valid before rendering dashboard
  if (!session?.user?.id) {
    return <LoadingView />;
  }

  // Render authenticated dashboard (which uses Convex hooks) wrapped in error boundary
  return (
    <ConvexErrorBoundary>
      <AuthenticatedDashboard session={session} />
    </ConvexErrorBoundary>
  );
}
