"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  X,
  Mail,
  Loader2,
  Heart,
  Bell,
  Bookmark,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

type AuthPromptTrigger =
  | "earned_trust" // After watching first video
  | "save_progress" // User tried to save something
  | "set_reminder" // User tried to set a reminder
  | "personalized_content" // User tried to access personalized content
  | "follow_doctor"; // User tried to follow a doctor

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: AuthPromptTrigger;
  onAuthSuccess?: () => void;
}

const TRIGGER_CONTENT: Record<
  AuthPromptTrigger,
  { title: string; description: string; icon: React.ReactNode }
> = {
  earned_trust: {
    title: "Save Your Progress",
    description:
      "Create a free account to save your viewing history, get personalized recommendations, and receive health reminders from your doctors.",
    icon: <Heart className="w-8 h-8 text-rose-500" />,
  },
  save_progress: {
    title: "Save This Content",
    description:
      "Sign in to save this video to your library and access it anytime across all your devices.",
    icon: <Bookmark className="w-8 h-8 text-sky-500" />,
  },
  set_reminder: {
    title: "Set Health Reminders",
    description:
      "Create an account to receive personalized health reminders and never miss an important appointment or medication.",
    icon: <Bell className="w-8 h-8 text-amber-500" />,
  },
  personalized_content: {
    title: "Unlock Personalized Content",
    description:
      "Sign in to access personalized health content from your doctors tailored specifically for you.",
    icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
  },
  follow_doctor: {
    title: "Follow Your Doctor",
    description:
      "Create an account to follow doctors and get notified when they post new health content.",
    icon: <Heart className="w-8 h-8 text-rose-500" />,
  },
};

export const AuthPrompt = ({
  isOpen,
  onClose,
  trigger = "earned_trust",
  onAuthSuccess,
}: AuthPromptProps) => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // If Google OAuth isn't enabled, show email form by default
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true";
  const [showEmailForm, setShowEmailForm] = useState(!googleEnabled);
  
  // Use refs to avoid stale closures and infinite loops
  const onCloseRef = useRef(onClose);
  const onAuthSuccessRef = useRef(onAuthSuccess);
  
  // Keep refs updated
  useEffect(() => {
    onCloseRef.current = onClose;
    onAuthSuccessRef.current = onAuthSuccess;
  });

  const content = TRIGGER_CONTENT[trigger];

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (status === "authenticated" && session && isOpen) {
      onAuthSuccessRef.current?.();
      onCloseRef.current();
    }
  }, [status, session, isOpen]);

  // Don't render if not open or already authenticated
  if (!isOpen || status === "authenticated") return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signIn("google", {
        callbackUrl: window.location.href,
      });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn("email", {
        email,
        redirect: true,
        callbackUrl: window.location.href,
      });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setEmail("");
    setShowEmailForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close"
      />

      {/* Modal Panel */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 pt-8">
          {/* Icon and header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              {content.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {content.title}
            </h2>
            <p className="text-gray-600">{content.description}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Benefits list */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Save your progress across all devices</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Get personalized health reminders</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>Access content from your doctors</span>
            </div>
          </div>

          {/* Sign in options */}
          <div className="space-y-3">
            {/* Google Sign In - only show if configured */}
            {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" && (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading && !showEmailForm ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              </>
            )}

            {/* Email Sign In */}
            {showEmailForm ? (
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Continue with Email
                    </>
                  )}
                </button>
              </form>
            ) : googleEnabled ? (
              <button
                onClick={() => setShowEmailForm(true)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed transition-all"
              >
                <Mail className="w-5 h-5" />
                Continue with Email
              </button>
            ) : null}
          </div>

          {/* Skip / Maybe Later */}
          <button
            onClick={handleClose}
            className="w-full mt-4 py-3 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
          >
            Maybe Later
          </button>

          {/* Privacy note */}
          <p className="mt-4 text-xs text-center text-gray-500">
            By continuing, you agree to receive personalized health content.
            Your data is encrypted and HIPAA-compliant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
