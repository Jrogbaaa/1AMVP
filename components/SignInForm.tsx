"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

      {/* Email sign-in form */}
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
