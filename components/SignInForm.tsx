"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true";
  const [showEmailForm, setShowEmailForm] = useState(!googleEnabled);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn("email", {
        email,
        redirect: true,
        callbackUrl: "/feed",
      });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signIn("google", {
        callbackUrl: "/feed",
      });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/images/1another-logo.png"
          alt="1Another"
          width={200}
          height={60}
          className="h-12 w-auto"
          priority
        />
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to 1Another
        </h1>
        <p className="text-gray-600">
          Sign in to access your personalized health content
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Benefits list */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>Save your progress across devices</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>Get personalized health reminders</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>Connect with your healthcare providers</span>
        </div>
      </div>

      {showEmailForm ? (
        // Email sign-in form
        <div className="space-y-4">
          <button
            onClick={() => setShowEmailForm(false)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in options
          </button>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                autoFocus
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
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
        </div>
      ) : (
        // Sign in options
        <div className="space-y-3">
          {/* Google Sign In - only show if configured */}
          {googleEnabled && (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
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

          {/* Email Sign In button */}
          <button
            onClick={() => setShowEmailForm(true)}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed transition-all"
          >
            <Mail className="w-5 h-5" />
            Continue with Email
          </button>
        </div>
      )}

      {/* Privacy note */}
      <p className="mt-6 text-xs text-center text-gray-500">
        By continuing, you agree to receive personalized health content.
        <br />
        Your data is encrypted and HIPAA-compliant.
      </p>

      {/* Browse without signing in */}
      <div className="mt-6 text-center">
        <a
          href="/feed"
          className="text-sm text-sky-600 hover:text-sky-700 font-medium hover:underline"
        >
          Browse content without signing in →
        </a>
      </div>
    </div>
  );
};
